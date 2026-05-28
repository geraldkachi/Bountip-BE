import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { SyncService } from '../sync.service';
import {
  SyncOperation,
  OperationStatus,
  OperationType,
} from '../entities/sync-operation.entity';

const mockSyncModel = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  find: jest.fn(),
});

describe('SyncService', () => {
  let service: SyncService;
  let syncModel: ReturnType<typeof mockSyncModel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SyncService,
        {
          provide: getModelToken(SyncOperation.name),
          useFactory: mockSyncModel,
        },
      ],
    }).compile();

    service = module.get<SyncService>(SyncService);
    syncModel = module.get(getModelToken(SyncOperation.name));
  });

  // ─── Test 1: Clean sync — no conflicts ────────────────────────────────────

  describe('Clean Sync', () => {
    it('should accept all operations when no conflicts exist', async () => {
      syncModel.findOne.mockResolvedValue(null); // no duplicates
      // No conflicting ops
      syncModel.findOne
        .mockResolvedValueOnce(null) // idempotency op_1
        .mockResolvedValueOnce(null) // conflict check op_1
        .mockResolvedValueOnce(null) // idempotency op_2
        .mockResolvedValueOnce(null); // conflict check op_2
      syncModel.create.mockResolvedValue({ _id: 'id1', status: OperationStatus.ACCEPTED });

      const result = await service.processBatch({
        tenantId: 'tenant_001',
        clientId: 'pos_01',
        operations: [
          {
            idempotencyKey: 'op_1',
            sequenceNumber: 1,
            operationType: OperationType.ITEM_SOLD,
            payload: { itemId: 'item_1', quantity: 2 },
            clientTimestamp: new Date().toISOString(),
          },
          {
            idempotencyKey: 'op_2',
            sequenceNumber: 2,
            operationType: OperationType.STOCK_ADJUSTED,
            payload: { itemId: 'item_2', quantity: 10 },
            clientTimestamp: new Date().toISOString(),
          },
        ],
      });

      expect(result.summary.accepted).toBe(2);
      expect(result.summary.rejected).toBe(0);
      expect(result.summary.merged).toBe(0);
      expect(result.summary.duplicates).toBe(0);
      expect(result.results[0].status).toBe('accepted');
      expect(result.results[1].status).toBe('accepted');
    });
  });

  // ─── Test 2: Conflict scenario — concurrent stock decrement ───────────────

  describe('Conflict Scenario', () => {
    it('should detect and merge conflicting stock operations from two clients', async () => {
      const conflictingOp = {
        _id: 'existing-op',
        clientId: 'pos_02',
        payload: { itemId: 'item_1', quantity: 3 },
        status: OperationStatus.ACCEPTED,
      };

      // First call = idempotency check (null), second = conflict query (conflicting op)
      syncModel.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(conflictingOp);

      syncModel.create.mockResolvedValue({
        _id: 'merged-op',
        status: OperationStatus.MERGED,
      });

      const result = await service.processBatch({
        tenantId: 'tenant_001',
        clientId: 'pos_01',
        operations: [
          {
            idempotencyKey: 'op_conflict_1',
            sequenceNumber: 1,
            operationType: OperationType.ITEM_SOLD,
            payload: { itemId: 'item_1', quantity: 2 },
            clientTimestamp: new Date(Date.now() - 5000).toISOString(),
          },
        ],
      });

      expect(result.summary.merged).toBe(1);
      expect(result.results[0].status).toBe('merged');
      expect(result.results[0].message).toContain('Concurrent modification detected');
    });

    it('should enforce idempotency — replayed batch returns duplicate without re-saving', async () => {
      syncModel.findOne.mockResolvedValue({
        _id: 'existing-op',
        idempotencyKey: 'op_dup_1',
        status: OperationStatus.ACCEPTED,
      });

      const result = await service.processBatch({
        tenantId: 'tenant_001',
        clientId: 'pos_01',
        operations: [
          {
            idempotencyKey: 'op_dup_1',
            sequenceNumber: 1,
            operationType: OperationType.ORDER_PLACED,
            payload: { orderId: 'ord_1', total: 5000 },
            clientTimestamp: new Date().toISOString(),
          },
        ],
      });

      expect(result.summary.duplicates).toBe(1);
      expect(result.results[0].status).toBe('duplicate');
      expect(result.results[0].message).toContain('idempotency enforced');
      // create must NOT be called — no side effect on replay
      expect(syncModel.create).not.toHaveBeenCalled();
    });
  });
});

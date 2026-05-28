import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';
import { SyncOperation, SyncOperationSchema } from './entities/sync-operation.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SyncOperation.name, schema: SyncOperationSchema },
    ]),
  ],
  controllers: [SyncController],
  providers: [SyncService],
  exports: [SyncService],
})
export class SyncModule {}

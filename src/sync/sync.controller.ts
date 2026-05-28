import { Controller, Post, Get, Body, Query, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SyncService } from './sync.service';
import { SyncBatchDto } from './dto/sync.dto';

@ApiTags('sync')
@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post('batch')
  @HttpCode(200)
  @ApiOperation({ summary: 'Submit a batch of offline operations for sync' })
  async processBatch(@Body() dto: SyncBatchDto) {
    return this.syncService.processBatch(dto);
  }

  @Get('operations')
  @ApiOperation({ summary: 'Get sync operations for a tenant' })
  @ApiQuery({ name: 'tenantId', required: true })
  @ApiQuery({ name: 'clientId', required: false })
  async getOperations(
    @Query('tenantId') tenantId: string,
    @Query('clientId') clientId?: string,
  ) {
    return this.syncService.getOperations(tenantId, clientId);
  }
}

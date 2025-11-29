import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import { TRPCError } from '@trpc/server';
import { SyncService } from './sync.service';
import type { SyncPayload } from './sync.schema';

@injectable()
export class SyncController {
  constructor(@inject(SyncService) private syncService: SyncService) {}

  async upload(userId: string, payload: SyncPayload, ctxUserId: string): Promise<{ success: boolean }> {
    if (userId !== ctxUserId) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Cannot upload data for another user' });
    }

    const blobSize = Buffer.from(payload.encryptedBlob, 'base64').length;
    if (blobSize > 1_000_000) {
      throw new TRPCError({ code: 'PAYLOAD_TOO_LARGE', message: 'Payload too large (max 1MB)' });
    }

    await this.syncService.upload(userId, payload);
    return { success: true };
  }

  async download(userId: string, ctxUserId: string): Promise<SyncPayload> {
    if (userId !== ctxUserId) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Cannot download data for another user' });
    }

    const payload = await this.syncService.download(userId);
    if (!payload) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
    }

    return payload;
  }

  async verify(userId: string, ctxUserId: string): Promise<{ exists: boolean }> {
    if (userId !== ctxUserId) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Cannot verify another user' });
    }

    const exists = await this.syncService.verify(userId);
    return { exists };
  }

  async delete(userId: string, ctxUserId: string): Promise<{ success: boolean }> {
    if (userId !== ctxUserId) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Cannot delete data for another user' });
    }

    await this.syncService.deleteUser(userId);
    return { success: true };
  }
}

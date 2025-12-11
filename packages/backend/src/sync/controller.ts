import 'reflect-metadata'
import { injectable, inject } from 'tsyringe'
import { forbidden } from '../common/errors'
import { SyncService } from './service'
import type { SyncPayload } from './schema'

@injectable()
export class SyncController {
  constructor(@inject(SyncService) private syncService: SyncService) {}

  async upload(
    userId: string,
    payload: SyncPayload,
    ctxUserId: string
  ): Promise<{ success: boolean }> {
    if (userId !== ctxUserId) {
      throw forbidden('Cannot upload data for another user')
    }

    await this.syncService.upload(userId, payload)
    return { success: true }
  }

  async download(userId: string, ctxUserId: string): Promise<SyncPayload | null> {
    if (userId !== ctxUserId) {
      throw forbidden('Cannot download data for another user')
    }

    // Return null if no data exists (first sync)
    const payload = await this.syncService.download(userId)
    return payload
  }

  async verify(userId: string, ctxUserId: string): Promise<{ exists: boolean }> {
    if (userId !== ctxUserId) {
      throw forbidden('Cannot verify another user')
    }

    const exists = await this.syncService.verify(userId)
    return { exists }
  }

  async delete(userId: string, ctxUserId: string): Promise<{ success: boolean }> {
    if (userId !== ctxUserId) {
      throw forbidden('Cannot delete data for another user')
    }

    await this.syncService.deleteUser(userId)
    return { success: true }
  }
}

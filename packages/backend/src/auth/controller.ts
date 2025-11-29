import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import { AuthService } from './service.ts';
import type { UserAccount as ServiceUserAccount } from './service.ts';
import type {
  RegisterInput,
  LoginInput,
  RefreshInput,
  RegisterResponse,
  LoginResponse,
  RefreshResponse,
  VerifyResponse,
  UserAccount,
} from './types';

@injectable()
export class AuthController {
  constructor(@inject(AuthService) private authService: AuthService) {}

  private mapAccount(serviceAccount: ServiceUserAccount): UserAccount {
    return {
      userId: serviceAccount.user_id,
      createdAt: new Date(serviceAccount.created_at),
      inviteCode: serviceAccount.invite_code,
    };
  }

  async register(input: RegisterInput): Promise<RegisterResponse> {
    const result = await this.authService.register(input.userId, input.inviteCode);

    return {
      accessToken: result.accessToken,
      account: this.mapAccount(result.account),
    };
  }

  async login(input: LoginInput): Promise<LoginResponse> {
    const result = await this.authService.login(input.userId);

    return {
      accessToken: result.accessToken,
      account: this.mapAccount(result.account),
    };
  }

  async refresh(input: RefreshInput): Promise<RefreshResponse> {
    const result = await this.authService.renewAccessToken(input.userId);
    return result;
  }

  async verify(userId: string): Promise<VerifyResponse> {
    return {
      valid: true,
      userId,
    };
  }

  async getAccount(userId: string): Promise<UserAccount> {
    const account = await this.authService.getAccount(userId);

    if (!account) {
      throw new Error('Account not found');
    }

    return this.mapAccount(account);
  }
}

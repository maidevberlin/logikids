import 'reflect-metadata';
import {inject, injectable} from 'tsyringe';
import type {UserAccount as ServiceUserAccount} from './service.ts';
import {AuthService} from './service.ts';
import {AccountNotFoundError} from '../common/errors';
import type {
    LoginInput,
    LoginResponse,
    RefreshInput,
    RefreshResponse,
    RegisterInput,
    RegisterResponse,
    UserAccount,
    VerifyResponse,
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
      return await this.authService.renewAccessToken(input.userId);
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
      throw new AccountNotFoundError();
    }

    return this.mapAccount(account);
  }
}

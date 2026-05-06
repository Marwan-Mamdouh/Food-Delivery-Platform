import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class SupabaseJwtGuard extends AuthGuard('supabase') {
  /**
   * Handles the request and throws UnauthorizedException if validation fails.
   */
  handleRequest<TUser = unknown>(err: Error | null, user: TUser): TUser {
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException('Invalid or missing authentication token')
      );
    }
    return user;
  }
}

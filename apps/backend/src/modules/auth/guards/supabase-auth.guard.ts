import { UnauthorizedException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class SupabaseAuthGuard extends AuthGuard('supabase') {
  /**
   * Handles the request and throws UnauthorizedException if validation fails.
   */
  handleRequest<TUser = unknown>(err: Error | null, user: TUser): TUser {
    if (err) {
      throw err;
    }
    
    if (!user) {
      throw new UnauthorizedException('Invalid or missing authentication token');
    }
    
    return user;
  }
}

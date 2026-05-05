import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

interface SupabaseJwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy, 'supabase') {
  constructor(configService: ConfigService) {
    const jwtSecret = configService.get<string>('supabase.jwtSecret');
    if (!jwtSecret) {
      throw new Error('SUPABASE_JWT_SECRET is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  /**
   * Validates the JWT payload and extracts user data.
   * @param payload The decoded JWT payload.
   * @returns The user data to be attached to the request.
   */
  async validate(payload: SupabaseJwtPayload) {
    return Promise.resolve({
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    });
  }
}

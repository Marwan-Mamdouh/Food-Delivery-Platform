import { createPublicKey } from 'crypto';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

interface SupabaseJwtPayload {
  sub: string;
  email: string;
  role: string;
}

interface Jwk {
  kty: string;
  kid: string;
  use: string;
  alg: string;
  crv: string;
  x: string;
  y: string;
  [key: string]: string;
}

interface JwksResponse {
  keys: Jwk[];
}

const JWKS_CACHE_TTL_MS = 60_000;
let jwksCache: { keys: Jwk[]; fetchedAt: number } | null = null;

function decodeJwtHeader(token: string) {
  const parts = token.split('.');
  if (parts.length < 2) {
    throw new Error('Invalid JWT format');
  }
  const headerBase64 = parts[0].replace(/-/g, '+').replace(/_/g, '/');
  const padded = headerBase64.padEnd(
    Math.ceil(headerBase64.length / 4) * 4,
    '=',
  );
  const headerJson = Buffer.from(padded, 'base64').toString('utf8');
  return JSON.parse(headerJson) as { alg: string; kid?: string };
}

async function fetchJwks(projectUrl: string) {
  if (jwksCache && Date.now() - jwksCache.fetchedAt < JWKS_CACHE_TTL_MS) {
    return jwksCache.keys;
  }

  const jwksUrl = `${projectUrl.replace(/\/$/, '')}/auth/v1/.well-known/jwks.json`;
  const response = await fetch(jwksUrl);
  if (!response.ok) {
    throw new Error(`Unable to load JWKS from ${jwksUrl}: ${response.status}`);
  }

  const body = (await response.json()) as JwksResponse;
  if (!Array.isArray(body.keys)) {
    throw new Error('Invalid JWKS response');
  }

  jwksCache = { keys: body.keys, fetchedAt: Date.now() };
  return jwksCache.keys;
}

function jwkToPem(jwk: Jwk) {
  const publicKey = createPublicKey({ key: jwk, format: 'jwk' });
  return publicKey.export({ type: 'spki', format: 'pem' }).toString('utf8');
}

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy, 'supabase') {
  constructor(configService: ConfigService) {
    const projectUrl = configService.get<string>('supabase.projectUrl');
    const jwtSecret = configService.get<string>('supabase.jwtSecret');

    if (!projectUrl) {
      throw new Error('SUPABASE_PROJECT_URL is not defined');
    }

    const issuer = `${projectUrl.replace(/\/$/, '')}/auth/v1`;

    const secretOrKeyProvider = (
      req: Request,
      rawJwtToken: string,
      done: (err: Error | null, secret?: string | Buffer) => void,
    ) => {
      try {
        const header = decodeJwtHeader(rawJwtToken);

        if (header.alg === 'HS256') {
          if (!jwtSecret) {
            return done(new Error('SUPABASE_JWT_SECRET is not defined'));
          }
          return done(null, jwtSecret);
        }

        if (!header.kid) {
          return done(new Error('JWT header missing kid'));
        }

        fetchJwks(projectUrl)
          .then((keys) => {
            const jwk = keys.find((key) => key.kid === header.kid);
            if (!jwk) {
              return done(
                new Error(`JWKS key not found for kid=${header.kid}`),
              );
            }
            const pem = jwkToPem(jwk);
            done(null, pem);
          })
          .catch((err) => {
            done(err instanceof Error ? err : new Error(String(err)));
          });
      } catch (err: unknown) {
        done(err instanceof Error ? err : new Error(String(err)));
      }
    };

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      algorithms: ['ES256', 'HS256', 'RS256'],
      secretOrKeyProvider,
    });

    this.expectedIssuer = issuer;
  }

  private readonly expectedIssuer: string;

  /**
   * Validates the JWT payload and extracts user data.
   * @param payload The decoded JWT payload.
   * @returns The user data to be attached to the request.
   */
  validate(payload: SupabaseJwtPayload) {
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}

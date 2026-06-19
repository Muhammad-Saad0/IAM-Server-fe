export type AccountRole = 'USER' | 'ADMIN';
export type OAuthClientScope = 'openid' | 'email';

export interface CreateAccountRequest {
  readonly email: string;
  readonly password: string;
  readonly roles: readonly AccountRole[];
}

export interface CreatedAccount {
  readonly id: string;
  readonly email: string;
  readonly status: string;
  readonly roles: readonly AccountRole[];
  readonly createdAt: string;
}

export interface CreateOAuthClientRequest {
  readonly clientName: string;
  readonly redirectUris: readonly string[];
  readonly scopes: readonly OAuthClientScope[];
}

export interface CreatedOAuthClient {
  readonly clientId: string;
  readonly clientName: string;
  readonly clientIdIssuedAt: string;
  readonly redirectUris: readonly string[];
  readonly scopes: readonly OAuthClientScope[];
}

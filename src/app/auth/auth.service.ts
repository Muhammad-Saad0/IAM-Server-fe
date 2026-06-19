import { Injectable, signal } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';

import { iamRuntimeConfig } from './iam-runtime-config';

interface IdentityClaims {
  readonly email?: unknown;
  readonly roles?: unknown;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private initializationPromise?: Promise<boolean>;
  private readonly authenticationError = signal<string | null>(null);

  constructor(private readonly oauthService: OAuthService) {
    const origin = window.location.origin;
    const config: AuthConfig = {
      issuer: iamRuntimeConfig().issuer,
      redirectUri: `${origin}/oauth/callback`,
      postLogoutRedirectUri: `${origin}/`,
      clientId: 'admin-ui',
      responseType: 'code',
      scope: 'openid email iam.manage',
      requireHttps: 'remoteOnly',
      strictDiscoveryDocumentValidation: true,
      clearHashAfterLogin: true,
    };

    this.oauthService.setStorage(sessionStorage);
    this.oauthService.configure(config);
  }

  initialize(): Promise<boolean> {
    if (!this.initializationPromise) {
      this.initializationPromise = this.loadSession().finally(() => {
        this.initializationPromise = undefined;
      });
    }

    return this.initializationPromise;
  }

  login(targetUrl = '/'): void {
    this.authenticationError.set(null);

    void this.oauthService
      .loadDiscoveryDocument()
      .then(() => this.oauthService.initCodeFlow(targetUrl))
      .catch((error: unknown) => this.recordError(error));
  }

  logout(): void {
    this.oauthService.logOut();
  }

  hasValidSession(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  accessToken(): string | null {
    return this.hasValidSession() ? this.oauthService.getAccessToken() : null;
  }

  email(): string | null {
    const email = this.identityClaims().email;
    return typeof email === 'string' ? email : null;
  }

  roles(): readonly string[] {
    const roles = this.identityClaims().roles;
    return Array.isArray(roles)
      ? roles.filter((role): role is string => typeof role === 'string')
      : [];
  }

  errorMessage(): string | null {
    return this.authenticationError();
  }

  private async loadSession(): Promise<boolean> {
    try {
      this.authenticationError.set(null);
      await this.oauthService.loadDiscoveryDocumentAndTryLogin();
      return this.hasValidSession();
    } catch (error: unknown) {
      this.recordError(error);
      return false;
    }
  }

  private identityClaims(): IdentityClaims {
    const claims = this.oauthService.getIdentityClaims();
    return claims && typeof claims === 'object' ? (claims as IdentityClaims) : {};
  }

  private recordError(error: unknown): void {
    console.error('OIDC authentication failed', error);
    this.authenticationError.set(
      'Unable to complete authentication with IAM Server. Check the IAM issuer and try again.',
    );
  }
}

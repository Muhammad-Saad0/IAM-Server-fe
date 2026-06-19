import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, defer, Observable, throwError } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { iamRuntimeConfig } from '../auth/iam-runtime-config';
import { ManagementApiClientError, managementApiErrorFrom } from './management-api-error';
import {
  CreateAccountRequest,
  CreatedAccount,
  CreateOAuthClientRequest,
  CreatedOAuthClient,
} from './management.models';

@Injectable({ providedIn: 'root' })
export class ManagementApiService {
  private readonly apiBaseUrl = `${iamRuntimeConfig().issuer.replace(/\/+$/, '')}/api/management`;

  constructor(
    private readonly http: HttpClient,
    private readonly auth: AuthService,
  ) {}

  createAccount(request: CreateAccountRequest): Observable<CreatedAccount> {
    return defer(() =>
      this.http
        .post<CreatedAccount>(`${this.apiBaseUrl}/accounts`, request, this.requestOptions())
        .pipe(catchError((error: unknown) => this.handleError(error))),
    );
  }

  createOAuthClient(request: CreateOAuthClientRequest): Observable<CreatedOAuthClient> {
    return defer(() =>
      this.http
        .post<CreatedOAuthClient>(
          `${this.apiBaseUrl}/oauth-clients`,
          request,
          this.requestOptions(),
        )
        .pipe(catchError((error: unknown) => this.handleError(error))),
    );
  }

  private requestOptions(): { headers: HttpHeaders } {
    const token = this.auth.accessToken();

    if (!token) {
      throw new ManagementApiClientError(
        'UNAUTHORIZED',
        'Your admin session has expired. Log in again and retry the request.',
        401,
      );
    }

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  private handleError(error: unknown): Observable<never> {
    return throwError(() => managementApiErrorFrom(error));
  }
}

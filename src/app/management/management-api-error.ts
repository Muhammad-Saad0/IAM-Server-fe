import { HttpErrorResponse } from '@angular/common/http';

interface BackendApiError {
  readonly code?: unknown;
  readonly message?: unknown;
}

export class ManagementApiClientError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly status?: number,
  ) {
    super(message);
  }
}

export function managementApiErrorFrom(error: unknown): ManagementApiClientError {
  if (!(error instanceof HttpErrorResponse)) {
    return new ManagementApiClientError(
      'REQUEST_FAILED',
      'The management request failed before IAM Server returned a response.',
    );
  }

  if (error.status === 0) {
    return new ManagementApiClientError(
      'NETWORK_ERROR',
      'Unable to reach IAM Server. Check that the backend is running and CORS allows this origin.',
      0,
    );
  }

  const backendError = parseBackendError(error.error);
  const code = backendError.code ?? defaultCode(error.status);
  const message = backendError.message ?? defaultMessage(error.status);

  return new ManagementApiClientError(code, message, error.status);
}

function parseBackendError(error: unknown): { code?: string; message?: string } {
  if (!error || typeof error !== 'object') {
    return {};
  }

  const response = error as BackendApiError;
  return {
    code: typeof response.code === 'string' ? response.code : undefined,
    message: typeof response.message === 'string' ? response.message : undefined,
  };
}

function defaultCode(status: number): string {
  if (status === 401) {
    return 'UNAUTHORIZED';
  }

  if (status === 403) {
    return 'ACCESS_DENIED';
  }

  if (status === 409) {
    return 'ACCOUNT_ALREADY_EXISTS';
  }

  return status >= 400 && status < 500 ? 'VALIDATION_FAILED' : 'REQUEST_FAILED';
}

function defaultMessage(status: number): string {
  if (status === 401) {
    return 'Your admin session is invalid or expired. Log in again and retry.';
  }

  if (status === 403) {
    return 'Your account is missing the ADMIN role or iam.manage scope.';
  }

  if (status === 409) {
    return 'An account with this email already exists.';
  }

  if (status >= 400 && status < 500) {
    return 'The request is invalid. Check the form values and retry.';
  }

  return 'IAM Server could not complete the request. Retry later.';
}

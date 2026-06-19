export interface IamRuntimeConfig {
  readonly issuer: string;
  readonly apiBaseUrl: string;
}

declare global {
  interface Window {
    __IAM_CONFIG__?: Partial<IamRuntimeConfig>;
  }
}

export function iamRuntimeConfig(): IamRuntimeConfig {
  const issuer = window.__IAM_CONFIG__?.issuer ?? 'http://localhost:8080';

  return {
    issuer,
    apiBaseUrl: window.__IAM_CONFIG__?.apiBaseUrl ?? `${issuer.replace(/\/+$/, '')}/api/management`,
  };
}

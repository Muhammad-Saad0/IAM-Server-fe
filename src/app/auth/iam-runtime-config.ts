export interface IamRuntimeConfig {
  readonly issuer: string;
}

declare global {
  interface Window {
    __IAM_CONFIG__?: Partial<IamRuntimeConfig>;
  }
}

export function iamRuntimeConfig(): IamRuntimeConfig {
  return {
    issuer: window.__IAM_CONFIG__?.issuer ?? 'http://localhost:8080',
  };
}

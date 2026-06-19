import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiBadge } from '@taiga-ui/kit';
import { TuiCardLarge } from '@taiga-ui/layout';
import { finalize } from 'rxjs';

import { ManagementApiClientError } from './management-api-error';
import { ManagementApiService } from './management-api.service';
import { CreatedOAuthClient, OAuthClientScope } from './management.models';

interface FormError {
  readonly code: string;
  readonly message: string;
}

@Component({
  selector: 'app-create-oauth-client',
  imports: [ReactiveFormsModule, RouterLink, TuiBadge, TuiButton, TuiCardLarge, TuiIcon],
  templateUrl: './create-oauth-client.component.html',
  styleUrl: './management-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOAuthClientComponent {
  protected readonly submitting = signal(false);
  protected readonly createdClient = signal<CreatedOAuthClient | null>(null);
  protected readonly apiError = signal<FormError | null>(null);
  protected readonly redirectUriError = signal<string | null>(null);

  protected readonly form = new FormGroup({
    clientName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(200)],
    }),
    redirectUris: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    emailScope: new FormControl(true, { nonNullable: true }),
  });

  constructor(private readonly managementApi: ManagementApiService) {}

  protected submit(): void {
    this.apiError.set(null);
    this.createdClient.set(null);
    this.redirectUriError.set(null);

    const redirectUris = this.redirectUris();
    const redirectUriError = this.validateRedirectUris(redirectUris);
    if (redirectUriError) {
      this.redirectUriError.set(redirectUriError);
      this.form.controls.redirectUris.setErrors({ invalidRedirectUris: true });
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const scopes: OAuthClientScope[] = this.form.controls.emailScope.value
      ? ['openid', 'email']
      : ['openid'];

    this.submitting.set(true);
    this.managementApi
      .createOAuthClient({
        clientName: this.form.controls.clientName.value.trim(),
        redirectUris,
        scopes,
      })
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (client) => {
          this.createdClient.set(client);
          this.form.reset({
            clientName: '',
            redirectUris: '',
            emailScope: true,
          });
        },
        error: (error: unknown) => this.apiError.set(this.toFormError(error)),
      });
  }

  protected clearRedirectUriError(): void {
    this.redirectUriError.set(null);
    this.form.controls.redirectUris.setErrors(null);
  }

  private redirectUris(): string[] {
    const lines = this.form.controls.redirectUris.value
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    return Array.from(new Set(lines));
  }

  private validateRedirectUris(redirectUris: readonly string[]): string | null {
    if (!redirectUris.length) {
      return 'Enter at least one redirect URI.';
    }

    const invalidUri = redirectUris.find((redirectUri) => !this.isValidRedirectUri(redirectUri));
    return invalidUri
      ? `Redirect URI must be an absolute HTTP/HTTPS URI without a fragment: ${invalidUri}`
      : null;
  }

  private isValidRedirectUri(redirectUri: string): boolean {
    try {
      const parsed = new URL(redirectUri);
      return ['http:', 'https:'].includes(parsed.protocol) && !parsed.hash;
    } catch {
      return false;
    }
  }

  private toFormError(error: unknown): FormError {
    if (error instanceof ManagementApiClientError) {
      return {
        code: error.code,
        message: error.message,
      };
    }

    return {
      code: 'REQUEST_FAILED',
      message: 'The OAuth client could not be created. Retry the request.',
    };
  }
}

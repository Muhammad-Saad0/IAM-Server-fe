import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiBadge } from '@taiga-ui/kit';
import { TuiCardLarge } from '@taiga-ui/layout';
import { finalize } from 'rxjs';

import { ManagementApiClientError } from './management-api-error';
import { ManagementApiService } from './management-api.service';
import { AccountRole, CreatedAccount } from './management.models';

interface FormError {
  readonly code: string;
  readonly message: string;
}

@Component({
  selector: 'app-create-account',
  imports: [ReactiveFormsModule, RouterLink, TuiBadge, TuiButton, TuiCardLarge, TuiIcon],
  templateUrl: './create-account.component.html',
  styleUrl: './management-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateAccountComponent {
  protected readonly roleOptions: readonly AccountRole[] = ['USER', 'ADMIN'];
  protected readonly submitting = signal(false);
  protected readonly createdAccount = signal<CreatedAccount | null>(null);
  protected readonly apiError = signal<FormError | null>(null);

  protected readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email, Validators.maxLength(320)],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8), Validators.maxLength(128)],
    }),
    roles: new FormGroup({
      USER: new FormControl(true, { nonNullable: true }),
      ADMIN: new FormControl(false, { nonNullable: true }),
    }),
  });

  constructor(private readonly managementApi: ManagementApiService) {}

  protected submit(): void {
    this.apiError.set(null);
    this.createdAccount.set(null);

    const roles = this.selectedRoles();
    if (!roles.length) {
      this.form.controls.roles.setErrors({ required: true });
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.managementApi
      .createAccount({
        email: this.form.controls.email.value.trim(),
        password: this.form.controls.password.value,
        roles,
      })
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (account) => {
          this.createdAccount.set(account);
          this.form.reset({
            email: '',
            password: '',
            roles: {
              USER: true,
              ADMIN: false,
            },
          });
        },
        error: (error: unknown) => this.apiError.set(this.toFormError(error)),
      });
  }

  protected clearRoleError(): void {
    if (this.selectedRoles().length) {
      this.form.controls.roles.setErrors(null);
    }
  }

  private selectedRoles(): AccountRole[] {
    const roles = this.form.controls.roles.getRawValue();
    return this.roleOptions.filter((role) => roles[role]);
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
      message: 'The account could not be created. Retry the request.',
    };
  }
}

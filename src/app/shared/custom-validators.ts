import { AbstractControl, ValidationErrors } from '@angular/forms';
import * as zxcvbn from 'zxcvbn';

export function safePasswordValidator(control: AbstractControl): ValidationErrors|any {
  const { score } = zxcvbn(control.value || '');

  return (score >= 3) ? null : { weak: true };
}


import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators } from '@angular/forms';

export function uniqueUsernameValidator(control: AbstractControl): Promise<{[key: string]: any}> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(null);
    }, 1000)
  });
}

/*
@Directive({
  selector: '[uniqueUsername]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: UniqueUsernameDirective,
    multi: true
  }]
})
export class UniqueUsernameDirective implements Validator, OnChanges {
  @Input() uniqueUsername: string;
}
*/

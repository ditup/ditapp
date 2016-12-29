/*
import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators } from '@angular/forms';

export function uniqueUsernameValidator(control: AbstractControl): Promise<{[key: string]: any}> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(null);
    }, 1000);
  });
}
*/
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

import { Directive, forwardRef, Injectable } from "@angular/core";
import { NG_ASYNC_VALIDATORS, AsyncValidator, AbstractControl } from "@angular/forms";
import { Observable } from "rxjs/Rx";

import { ModelService } from '../model.service';

/*
@Directive({
  selector: "[asyncValidator][formControlName], [asyncValidator][ngModel]",
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => UniqueUsernameValidator),
      multi: true
    },
    ModelService
  ]
})
*/
@Injectable()
export /*default*/ class UniqueUsernameValidator implements AsyncValidator {

  constructor(private model: ModelService) {
    console.log('constructing',  this.model, model);
  }

  validate( control : AbstractControl ) : Promise<{[key : string] : any}>|Observable<{[key : string] : any}> {
    console.log('inside validate **********');
    return this.validateUniqueUsernameObservable(control.value).first();
  }

  validateUniqueUsernamePromise( email : string ) {
    return new Promise(resolve => {
      setTimeout(() => {
        if( email === "alreadyExistsEmail@gmail.com" ) {
          resolve({
            asyncInvalid: true
          })
        } else {
          resolve(null);
        }
      }, 1000);
    })
  }

  validateUniqueUsernameObservable( username : string ) {


    return new Observable(observer => {

      this.model.isUsernameAvailable(username).then((isUnique) => {
        console.log('validate');
        if (isUnique === true) {
          observer.next(null);
        }
        else {
          observer.next({ uniqueUsername: true });
        }
      });
    });
  }

}

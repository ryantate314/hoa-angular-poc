import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { CreditCard } from '@app/models/credit-card.model';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import * as cardValidator from 'card-validator';


function validCreditCardNumber(control: AbstractControl): ValidationErrors | null {
  const cardNumber = control.value;
  if (cardValidator.number(cardNumber).isValid)
    return null;
  return {
    'card-validation': true
  };
}

function validExpirationDate(control: AbstractControl): ValidationErrors | null {
  const expiration = control.value;
  if (cardValidator.expirationDate(expiration).isValid)
    return null;
  return {
    'expiration-date-validation': true
  };
}

@Component({
  selector: 'app-credit-card-input',
  templateUrl: './credit-card-input.component.html',
  styleUrls: ['./credit-card-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi:true,
      useExisting: CreditCardInputComponent
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: CreditCardInputComponent
    }
  ]
})
export class CreditCardInputComponent implements OnInit, ControlValueAccessor, Validator  {

  faCircleCheck = faCircleCheck;

  public form: FormGroup;

  @Output()
  card = new EventEmitter<CreditCard>();

  @Output()
  isValid = new EventEmitter<boolean>();

  private touched: boolean = false;
  private onTouched = () => {};

  private onChange = () => {};

  constructor(private fb: FormBuilder) {
    this.form = fb.group({
      'cardNumber': ['', [
        validCreditCardNumber
      ]],
      'expiration': ['', [
        validExpirationDate
      ]],
      'verificationCode': ['']
    });
  }

  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    if (this.form.valid)
      return null;

    // Combine the errors for all components into one big object
    return Object.keys(this.form.controls)
      .filter(key => !this.form.controls[key].valid)
      .reduce((errors, key) => (
        {
          ...errors,
          [key]: {
            ...this.form.controls[key].errors
          }
        }),
        {}
      );
  }

  writeValue(card: CreditCard | null): void {
    this.cardNumberInput.setValue(card?.number);
    this.form.get('expiration')!.setValue(card?.expiration);
    this.form.get('verificationCode')!.setValue(card?.verificationCode);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe(() => {
      this.onChange();

      if (!this.touched) {
        this.touched = true;
        this.onTouched();
      }
    });
  }

  get cardNumberInput() {
    return this.form.get('cardNumber')!;
  }

}

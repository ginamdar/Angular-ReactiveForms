import { Component, OnInit } from '@angular/core';

import { Customer } from './customer';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';

// function ratingRange(c: AbstractControl): { [key: string]: boolean} | null {
//   if (c.value !== null && (isNaN(c.value) || c.value < 1 || c.value > 5)) {
//     return { range: true };
//   }
//   return null;
// }

function emailMatcher(c: AbstractControl): { [ key: string ]: boolean } | null {
  const emailControl = c.get('email');
  const confirmEmailControl = c.get('confirmEmail');

  if (emailControl.pristine || confirmEmailControl.pristine) {
    return null;
  }

  if (emailControl.value === confirmEmailControl.value) {
    return null;
  }
  return { match: true};
}

function ratingRange(min: number, max: number): ValidatorFn {
  return (c: AbstractControl): { [ key: string ]: boolean} | null => {
    if (c.value !== null && (isNaN(c.value) || c.value < min || c.value > max)) {
      return { range: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customerForm: FormGroup;
  phonePlaceHolder = 'Phone';
  customer = new Customer();

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.customerForm = this.fb.group({
      firstName: ['',  [Validators.required, Validators.minLength(3)]],
      lastName: ['',  [Validators.required, Validators.maxLength(50)]],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        confirmEmail: ['', Validators.required],
      }, { validator: emailMatcher }),
      phone: '',
      // rating: [null, ratingRange],
      rating: [null, ratingRange(1, 5)],
      notification: 'email',
      sendCatalog: true
    });
    // this.customerForm = new FormGroup({
    //   firstName: new FormControl(this.customer.firstName),
    //   lastName: new FormControl(''),
    //   email: new FormControl(''),
    //   sendCatalog: new FormControl(true)
    // });
  }

  get firstName() { // a getter!
    return (this.customerForm.get('firstName'));
  }
  get lastName() { // a getter!
    return (this.customerForm.get('lastName'));
  }
  get email() { // a getter!
    return this.customerForm.get('emailGroup.email');
  }
  get confirmEmail() {
    return this.customerForm.get('emailGroup.confirmEmail');
  }
  get phone() {
    return (this.customerForm.get('phone'));
  }
  get rating() {
    return this.customerForm.get('rating');
  }

  populateTestData() {
    // this.customerForm.setValue({
    //   firstName: 'Guru',
    //   lastName: 'Inamdar',
    //   email: 'test@test.com',
    //   sendCatalog: false
    // });

    this.customerForm.patchValue({
      firstName: 'Guru',
      lastName: 'Inamdar',
    });
  }

  save() {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }

  setNotification(notifyVia: string) {
    if (notifyVia === 'text') {
      this.customerForm.get('phone').setValidators(Validators.required);
      this.phonePlaceHolder = 'Phone (required)';
    } else {
      this.customerForm.get('phone').setValidators([Validators.required, Validators.email]);
      this.customerForm.get('phone').clearValidators();
      this.phonePlaceHolder = 'Phone';
    }
    this.customerForm.get('phone').updateValueAndValidity();
  }
}

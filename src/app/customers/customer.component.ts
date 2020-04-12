import { Component, OnInit } from '@angular/core';

import { Customer } from './customer';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

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
      email: ['', [Validators.required, Validators.email]],
      phone: '',
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
    return (this.customerForm.get('email'));
  }
  get phone() {
    return (this.customerForm.get('phone'));
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

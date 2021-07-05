import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  signupForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      emailAddress: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', Validators.required],
      passwordConfirmation: ['', Validators.required],
      username: ['', Validators.required],
    }, { validator: this.passwordComparisonValidator});
  }

  passwordComparisonValidator: ValidatorFn = (fg: FormGroup) => {
    const password = fg.controls.password;
    const passwordConfirmation = fg.controls.passwordConfirmation;

    return password && passwordConfirmation && password.value === passwordConfirmation.value ? null : { requireMatch: true };
  }

  onSubmit(){
    this.submitted = true;

    // stop here if form is invalid
    if (this.signupForm.invalid) {
      console.log('invalid', this.signupForm);
      return;
    }
   }

}

import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { first } from 'rxjs/operators'
import { AccountServices } from 'src/app/Providers/account/account.services'
import { ModalController } from '@ionic/angular'
import { User } from 'src/app/Providers/user-controller/model/users-model'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup
  loading = false
  submitted = false
  loginType='';

  constructor(
    private formBuilder: FormBuilder,
    private accountServices: AccountServices,
    private router: Router,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  handleLogin() {
    this.submitted = true

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return
    }

    this.loading = true
    this.accountServices.login(this.loginForm.controls.email.value, this.loginForm.controls.password.value)
      .pipe(first())
      .subscribe(
        (data: User) => {
          if (this.loginType === 'ROLE_TEACHER' && data.roles.includes('ROLE_TEACHER')) {
            this.router.navigate(['../teacher'], { replaceUrl: true })
          } else if (this.loginType === 'ROLE_STUDENT' && data.roles.includes('ROLE_STUDENT')) {
            this.router.navigate(['../student'], { replaceUrl: true })
          } else {
            this.router.navigate(['/home'])
            this.loginType=''
          }
          this.modalCtrl.dismiss()
        },
        error => {
          console.log('error', error)
          this.loading = false
        })
  }

  dismiss() {
    this.modalCtrl.dismiss()
  }
}

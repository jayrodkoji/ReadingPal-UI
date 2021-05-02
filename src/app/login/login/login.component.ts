import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AccountServices } from 'src/app/Providers/account/account.services';
import { ModalController } from "@ionic/angular";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private accountServices: AccountServices,
    private router: Router,
    private modalCtrl: ModalController) { }
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  handleLogin(){
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    
    this.loading= true;
    this.accountServices.login(this.loginForm.controls.username.value, this.loginForm.controls.password.value)
    .pipe(first())
    .subscribe(
      data => {
        console.log(data)

        localStorage.setItem('logedInUsername', data.username);
        localStorage.setItem('logedInRole', data.role);

        if (data.role === 'ROLE_TEACHER') {
          this.router.navigate(['../teacher'], { replaceUrl: true });
        } else if (data.role === 'ROLE_STUDENT') {
          this.router.navigate(['../student'], { replaceUrl: true });
        } else if (data.role === 'ROLE_ADMIN') {
          this.router.navigate(['../admin'], { replaceUrl: true });
        } else {
          this.router.navigate(['/home']);
        }
        this.modalCtrl.dismiss();
      },
      error => {
        console.log("error",error);
        this.loading = false;
      });
  }
}

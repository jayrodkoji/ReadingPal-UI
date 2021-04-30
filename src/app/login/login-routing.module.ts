import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

import { LoginPage } from './login.page';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';

const routes: Routes = [
  {
    path: '',
    component: LoginPage,
    children: [
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent
      },
      {
        path: 'signup',
        component: SignUpComponent
      },
      {
        path: '',
        component: LoginComponent
      },
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPageRoutingModule {}

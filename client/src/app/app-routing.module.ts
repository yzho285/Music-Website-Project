import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExampleComponent } from './example/example.component'
import { LoginComponent } from './login/login.component'
import { RegisterComponent } from './register/register.component'
import { UnauthenticatedUserComponent } from './unauthenticated-user/unauthenticated-user.component';
import { UserInfoComponent } from './user-info/user-info.component'
import { AdminManageComponent } from './admin-manage/admin-manage.component'
import { AuthUserComponent } from './auth-user/auth-user.component';
import { RevMnComponent } from './rev-mn/rev-mn.component'


const routes: Routes = [
  // default page
  {
    path: '',
    redirectTo: 'homepage', 
    pathMatch: 'full'
  },
  //login page
  {
    path: 'login',
    component: LoginComponent
  },
  //register page
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'example',
    component: ExampleComponent
  },
  {
    path: 'adminManage',
    component: AdminManageComponent
  },
  {
    path: 'userInfo',
    component: UserInfoComponent
  },
  {
    path: 'homepage',
    component: UnauthenticatedUserComponent
  },
  {
    path: 'auth-user',
    component: AuthUserComponent
  },
  {
    path: 'rev-mn',
    component: RevMnComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

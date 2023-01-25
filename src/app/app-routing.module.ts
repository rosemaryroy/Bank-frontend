import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { MinistatementComponent } from './ministatement/ministatement.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  // login
  {
    path:'',component:LoginComponent
  },
  // register
  {
    path:'register',component:RegisterComponent
  },
  // dashboard
  {
    path:'dashboard',component:DashboardComponent
  },
  // mini statement
  {
    path:'ministatement',component:MinistatementComponent
  },
  // page-not=found
  {
    path:'**',component:PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

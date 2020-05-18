import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserComponent } from './user.component';
import { UserLoginComponent } from './login/UserLogin.component';

const routes: Routes = [
	{
		path: '',
		component: UserComponent,
		pathMatch: 'full',
  },
  {
    path: 'login',
    component: UserLoginComponent
  }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class UserRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
	{ path: 'pages', loadChildren: () => import('./pages/pages.module').then((m) => m.PagesModule) },
	{ path: '', redirectTo: 'pages', pathMatch: 'full' },
	{ path: '**', redirectTo: 'pages' },
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true })],
	exports: [RouterModule],
})
export class AppRoutingModule {}

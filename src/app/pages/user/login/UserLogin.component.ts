import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersFlow } from 'src/app/@dataflow/extra';
import { CurrentUserService } from '../../current-user.service';

@Component({
	template: ``,
	styles: [],
})
export class UserLoginComponent implements OnInit {
	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private currUserService: CurrentUserService
	) {}

	ngOnInit() {
		const user = UsersFlow.get(this.route.snapshot.queryParams['name']);
		if (user) {
			this.currUserService.switchUser(user.name);
		}
		this.router.navigate(['/dashboard']);
	}
}

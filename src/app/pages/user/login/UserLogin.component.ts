import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/pages/users.service';
import { UsersFlow } from 'src/app/@dataflow/extra';

@Component({
	template: ``,
	styles: [],
})
export class UserLoginComponent implements OnInit {
	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private userService: UsersService
	) {}

	ngOnInit() {
    const user = UsersFlow.get(this.route.snapshot.queryParams['name']);
		if (user) {
			UsersFlow.setLogin(user);
    }
		this.userService.usersTrigger.next(1);
		this.router.navigate(['/dashboard'])
	}
}

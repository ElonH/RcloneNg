import { Component, OnInit } from '@angular/core';
import { overlayConfigFactory } from 'ngx-modialog-7';
// tslint:disable-next-line: no-submodule-imports
import { Modal, VEXModalContext } from 'ngx-modialog-7/plugins/vex';
import { IUser, UsersFlow } from '../../@dataflow/extra';
import { LayoutService, SidebarStatus } from '../layout.service';
import { UsersService } from '../users.service';
import { UserDeleteDialogComponent } from './del/delete.dialog';

@Component({
	selector: 'app-user',
	template: `
		<nb-card>
			<nb-card-header>
				<nb-icon icon="grid-outline" style="margin-right: 0.5rem;" status="basic"> </nb-icon>
				Users Manager
				<nb-actions class="push-to-right" size="small">
					<nb-action
						[icon]="{ icon: 'person-add', status: 'primary' }"
						title="New User"
						link="./add"
					>
					</nb-action>
				</nb-actions>
			</nb-card-header>
			<nb-card-body>
				<div class="container-fluid" style="padding: 0;">
					<div class="row">
						<div class="col-12" *ngFor="let usr of users">
							<table class="grid-container">
								<tr>
									<td rowspan="2" style="padding-right: 1rem;">
										<nb-icon icon="person-outline"></nb-icon>
									</td>
									<td rowspan="1" class="name">{{ usr.name }}</td>
									<td rowspan="2">
										<nb-actions size="small">
											<!-- <nb-action
												[icon]="{ icon: 'edit-outline', status: 'info' }"
												title="Edit user"
											>
											</nb-action> -->
											<nb-action
												[icon]="{ icon: 'trash-outline', status: 'danger' }"
												title="Delete user"
												(click)="deleteUser(usr)"
											>
											</nb-action>
										</nb-actions>
									</td>
								</tr>
								<tr>
									<td
										rowspan="1"
										class="url"
										[ngClass]="{
											'url-sidebar': mainSidebar,
											'url-non-sidebar': !mainSidebar,
											url: true
										}"
									>
										{{ usr.url }}
									</td>
								</tr>
							</table>
						</div>
					</div>
				</div>
			</nb-card-body>
		</nb-card>
	`,
	styles: [
		`
			.operation {
				margin-left: 3rem;
				margin-bottom: 1rem;
			}

			nb-card-header {
				display: flex;
				align-items: center;
			}
			.push-to-right {
				margin-left: auto;
			}
			nb-action {
				padding: 0 0.5rem !important;
			}
			.row > div {
				border-radius: 0.25rem;
				margin: 0.25rem 0;
				box-shadow: 0.5rem 0.125rem 0.5rem 0 rgba(44, 51, 73, 0.1);
			}
			.name {
				padding-top: 0.25rem;
				width: 100%;
				font-size: 1.25rem;
			}
			.url {
				width: 100%;
				color: #8f9bb3;
				padding-bottom: 0.25rem;
				overflow-x: auto;
        display: flex;
      }
      .url-sidebar {
				width: calc(100vw - 10rem - 16rem);
      }
      .url-non-sidebar {
				width: calc(100vw - 10rem);
      }
			.url::-webkit-scrollbar {
				height: 0.315rem;
			}
			.url::-webkit-scrollbar-track {
				border-radius: 10px;
			}
			.url::-webkit-scrollbar-thumb {
				background: #e4e9f2;
				border-radius: 10px;
			}
			.url::-webkit-scrollbar-thumb:hover {
				background: #8f9bb3;
			}
			}
		`,
	],
})
export class UserComponent implements OnInit {
	public users: IUser[] = [];

	public mainSidebar = false;

	constructor(
		private usersService: UsersService,
		private layoutService: LayoutService,
		public modal: Modal
	) {}

	ngOnInit(): void {
		this.usersService.usersFlow$.getOutput().subscribe(node => {
			if (node[1].length !== 0) return;
			this.users = node[0].users;
		});
		this.layoutService.mainSidebar$.getOutput().subscribe(node => {
			if (node[1].length !== 0) return;
			this.mainSidebar = node[0] !== SidebarStatus.None;
		});
	}

	deleteUser(usr: IUser) {
		this.modal
			.open(
				UserDeleteDialogComponent,
				overlayConfigFactory({ isBlocking: false, content: usr }, VEXModalContext)
			)
			.result.then(
				x => {
					if (x) {
						UsersFlow.del(usr.name);
						this.usersService.update();
					}
				},
				() => {}
			);
	}
}

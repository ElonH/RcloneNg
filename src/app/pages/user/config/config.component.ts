import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
	selector: 'user-config',
	template: `
		<nb-card>
			<nb-card-body>
				<span>Name:</span>
				<nb-form-field>
					<nb-icon nbPrefix icon="pricetags-outline"></nb-icon>
					<input type="text" nbInput fullWidth placeholder="Enter Name" />
					<nb-icon nbSuffix icon="checkmark-outline" status="success"></nb-icon>
					<nb-icon nbSuffix icon="close-outline" status="danger"></nb-icon>
				</nb-form-field>
				<span style="color: grey;">wrong message</span>
				<br /><br />
				<span>Server Url:</span>
				<nb-form-field>
					<nb-icon nbPrefix icon="monitor-outline"></nb-icon>
					<input
						type="text"
						nbInput
						fullWidth
						placeholder="http://localhost:5572"
						value="http://localhost:5572"
					/>
				</nb-form-field>
				<br />
				<span>User:</span>
				<nb-form-field>
					<nb-icon nbPrefix icon="person-outline"></nb-icon>
					<input type="text" nbInput fullWidth placeholder="Enter Rclone User" />
				</nb-form-field>
				<br />
				<span>Password:</span>
				<nb-form-field>
					<nb-icon nbPrefix icon="lock-outline"></nb-icon>
					<input type="text" nbInput fullWidth placeholder="Enter Rclone Password" />
				</nb-form-field>
			</nb-card-body>
			<nb-card-footer>
				<nb-actions>
				<nb-action>
					<button nbButton outline status="danger">Cancel</button>
				</nb-action>
				<nb-action>
					<button nbButton outline status="info">
						Connect
						<nb-icon icon="refresh" status="info"></nb-icon>
					</button>
				</nb-action>
				<nb-action>
					<button nbButton outline status="primary">save</button>
				</nb-action>
				</nb-actions>
			</nb-card-footer>
		</nb-card>
	`,
	styles: [
		`
			nb-card {
				max-width: 480px;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigComponent implements OnInit {
	constructor() {}

	ngOnInit(): void {}
}

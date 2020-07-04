/**
 * if modify any thing in `IBrowserSetting`, include name, type, or common description,
 * please run `npm run build:schemas:browser` to update schema.json file
 */

import { Observable, of } from 'rxjs';
import { BareFlow, CombErr } from '../core';

/**
 * @description
 */
export interface IBrowserSetting {
	/**
	 * 请求间隔, 需要定时从rclone服务器中获取数据的时间间隔.
	 *
	 * 单位: 毫秒(ms)
	 *
	 * 影响范围:
	 *  - 响应时间的刷新频率(位于主侧栏左上角)
	 *  - Dashboard 和 Job Manager 的更新间隔
	 *
	 * 建议:
	 *  - 如果与 rclone 服务器响应时间小于 100ms(通常在局域网下), 可以适当调低数值
	 */
	'rng.request-interval': number;
}

export const brwoserSettingDefault: IBrowserSetting = {
	'rng.request-interval': 3000,
};

export type NestedPartial<T> = {
	[K in keyof T]?: T[K] extends Array<infer R> ? Array<NestedPartial<R>> : NestedPartial<T[K]>;
};

/**
 * @description override partical browser config from input port,
 * and output full browser configuration
 */
export abstract class BrowserSettingFlow extends BareFlow<
	NestedPartial<IBrowserSetting>,
	IBrowserSetting
> {
	public abstract prerequest$: Observable<CombErr<NestedPartial<IBrowserSetting>>>;
	protected data: IBrowserSetting;
	constructor() {
		super();
		let strg = localStorage.getItem('browserConfig');
		if (!strg) {
			strg = JSON.stringify(brwoserSettingDefault);
			localStorage.setItem('browserConfig', strg);
		}
		this.data = JSON.parse(strg);
	}
	protected request(
		pre: CombErr<NestedPartial<IBrowserSetting>>
	): Observable<CombErr<IBrowserSetting>> {
		this.data = { ...this.data, ...pre[0] };
		localStorage.setItem('browserConfig', JSON.stringify(this.data));
		return of([this.data, []]);
	}
}

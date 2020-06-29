import { HumanizeDuration, HumanizeDurationLanguage } from 'humanize-duration-ts';

export const langService = new HumanizeDurationLanguage();
langService.addLanguage('shortEn', {
	y: () => 'y',
	mo: () => 'mo',
	w: () => 'w',
	d: () => 'd',
	h: () => 'h',
	m: () => 'm',
	s: () => 's',
	ms: () => 'ms',
	decimal: '',
});
export const ForamtDuration = new HumanizeDuration(langService);
ForamtDuration.setOptions({
	language: 'shortEn',
	round: true,
	units: ['y', 'mo', 'd', 'h', 'm', 's'],
	largest: 6,
});

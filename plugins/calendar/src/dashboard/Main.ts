import { registerPage, registerShortcut, Icon } from 'dashboard';

import CalendarPage from './CalendarPage';

registerPage({
	identifier: 'calendar:calendar',
	title: 'Calendar',
	path: '/calendar',
	component: CalendarPage,
});

registerShortcut({
	identifier: 'calendar:edit_calendar',
	icon: Icon.calendar,
	title: 'Edit Calendar',
	description: 'Edit calendar events.',
	action: ({ navigate }: any) => navigate('/calendar/'),
});

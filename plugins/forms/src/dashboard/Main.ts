
import { Icon, registerPage, registerSettings, registerShortcut } from 'dashboard';
import FormSubmissionsSettings from './FormSubmissionsSettings';
import FormSubmissionsPage from './FormSubmissionsPage';

registerPage({
	component: FormSubmissionsPage,
	identifier: 'forms:form_submissions',
	path: 'forms',
	title: 'Form Submissions'
});

registerShortcut({
	identifier: 'forms:view_form_submissions',
	icon: Icon.inbox,
	title: 'View Form Submissions',
	aliases: ['go form submissions', 'forms'],
	description: 'View and edit form submissions.',
	action: ({ navigate }: any) => navigate('/forms/'),
});


registerSettings({
	identifier: 'tax_calculator:form_submissions',
	title: 'Form Submissions',
	path: 'submissions',
	icon: Icon.inbox,
	component: FormSubmissionsSettings,
});

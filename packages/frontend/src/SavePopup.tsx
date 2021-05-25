import * as Preact from 'preact';

import './SavePopup.sass';

interface Props {
	active: boolean;

	onReset: () => void;
	onSave: () => void;
}

export default function SavePopup(props: Props) {
	return (
		<div class={'SavePopup' + (props.active ? ' Active' : '')}>
			<div class='SavePopup-Box'>
				<img src="/admin/asset/icon/save-dark.svg" />
				<p>You have unsaved changes.</p>
				<div class='SavePopup-Spacer' />
				<button type='button' class='SavePopup-ResetButton' onClick={props.onReset}>Reset</button>
				<button type='submit' class='SavePopup-SaveButton' onClick={props.onSave}>Save</button>
			</div>
		</div>
	);
}

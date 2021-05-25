"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./SavePopup.sass");
function SavePopup(props) {
    return (<div class={'SavePopup' + (props.active ? ' Active' : '')}>
			<div class='SavePopup-Box'>
				<img src="/admin/asset/icon/save-dark.svg"/>
				<p>You have unsaved changes.</p>
				<div class='SavePopup-Spacer'/>
				<button type='button' class='SavePopup-ResetButton' onClick={props.onReset}>Reset</button>
				<button type='submit' class='SavePopup-SaveButton' onClick={props.onSave}>Save</button>
			</div>
		</div>);
}
exports.default = SavePopup;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const js_cookie_1 = tslib_1.__importDefault(require("js-cookie"));
const hooks_1 = require("preact/hooks");
require("./LoginPage.sass");
const Title_1 = tslib_1.__importDefault(require("../Title"));
function LoginPage({ onLogin }) {
    const userInputRef = hooks_1.useRef();
    const [username, setUsername] = hooks_1.useState('');
    const [password, setPassword] = hooks_1.useState('');
    const [state, setState] = hooks_1.useState('INPUT');
    const [warning, setWarning] = hooks_1.useState('');
    const handleSubmit = (e) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        try {
            if (state === 'PENDING')
                throw 'Attempt to send request while already logging in.';
            setState('PENDING');
            setWarning('');
            const r = yield fetch('/admin/auth', {
                method: 'POST', cache: 'no-cache',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user: username,
                    pass: password
                })
            });
            const res = yield r.text();
            if (r.status !== 200)
                throw res;
            js_cookie_1.default.set('tkn', res, { sameSite: 'Lax' });
            setState('AUTH');
            setTimeout(() => onLogin(), 550);
        }
        catch (err) {
            setState('INPUT');
            setWarning(err);
            setUsername('');
            setPassword('');
            window.requestAnimationFrame(() => userInputRef.current.select());
        }
        return false;
    });
    return (<div class='LoginPage'>
			<Title_1.default>Login</Title_1.default>
			<div class='LoginPage-Wrap'>
				<form class={'LoginPage-Card ' + state} onSubmit={handleSubmit}>
					<div class='LoginPage-ProfilePlaceholder' role='heading' aria-level='1' aria-label='Log In'>
						<img class='card' src='/admin/asset/icon/account-light.svg' alt=''/>
						<img class='success' src='/admin/asset/icon/serve-light.svg' alt=''/>
					</div>
					<div class='LoginPage-FormContents'>

						<input type='text' autoComplete='username' ref={userInputRef} autoFocus required minLength={3} maxLength={32} aria-label='Username' placeholder='Username' value={username} onInput={(evt) => setUsername(evt.target.value)} onChange={(evt) => setUsername(evt.target.value)} disabled={state === 'PENDING'}/>

						<input type='password' autoComplete={'current-password'} required minLength={8} aria-label='Password' placeholder='Password' value={password} onInput={(evt) => setPassword(evt.target.value)} onChange={(evt) => setPassword(evt.target.value)} disabled={state === 'PENDING'}/>

						<button disabled={state === 'PENDING'}>Log In</button>
					</div>
				</form>

				<p class='LoginPage-Warning'>{warning}</p>
			</div>
		</div>);
}
exports.default = LoginPage;

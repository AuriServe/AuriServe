type ClickCB = (e: MouseEvent) => void;

export interface ClickHandlerCallbacks {
	onClick?: ClickCB;
	onFirstClick?: ClickCB;
	onSingleClick?: ClickCB;
	onDoubleClick?: ClickCB;
}

export default class ClickHandler {
	private callbacks: ClickHandlerCallbacks = {};

	private _lastClick = 0;
	private _timeout: any = undefined;

	setCallbacks(callbacks: ClickHandlerCallbacks) {
		this.callbacks = callbacks;
	}

	handleMouseUp = (e: MouseEvent) => {
		const timeout = 250;

		e.preventDefault();

		if (this.callbacks.onClick) this.callbacks.onClick(e);

		if (Date.now() - this._lastClick < timeout) {
			this._lastClick = 0;
			clearTimeout(this._timeout);

			if (this.callbacks.onDoubleClick) this.callbacks.onDoubleClick(e);
		} else {
			this._lastClick = Date.now();

			if (this.callbacks.onFirstClick) this.callbacks.onFirstClick(e);
			this._timeout = setTimeout(() => {
				if (this.callbacks.onSingleClick) this.callbacks.onSingleClick(e);
			}, timeout);
		}
	};
}

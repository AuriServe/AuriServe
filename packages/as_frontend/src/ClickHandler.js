"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ClickHandler {
    constructor() {
        this.callbacks = {};
        this._lastClick = 0;
        this._timeout = undefined;
        this.handleMouseUp = (e) => {
            const timeout = 250;
            e.preventDefault();
            if (this.callbacks.onClick)
                this.callbacks.onClick(e);
            if (Date.now() - this._lastClick < timeout) {
                this._lastClick = 0;
                clearTimeout(this._timeout);
                if (this.callbacks.onDoubleClick)
                    this.callbacks.onDoubleClick(e);
            }
            else {
                this._lastClick = Date.now();
                if (this.callbacks.onFirstClick)
                    this.callbacks.onFirstClick(e);
                this._timeout = setTimeout(() => {
                    if (this.callbacks.onSingleClick)
                        this.callbacks.onSingleClick(e);
                }, timeout);
            }
        };
    }
    setCallbacks(callbacks) {
        this.callbacks = callbacks;
    }
}
exports.default = ClickHandler;

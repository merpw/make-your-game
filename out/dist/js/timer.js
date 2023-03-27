/** {@link setTimeout} and {@link setInterval} that can be paused. */
export default class Timer {
    pause() {
        if (this.timer) {
            this.isPaused = true;
            this.isInterval ? clearInterval(this.timer) : clearTimeout(this.timer);
            this.timer = null;
            const timePassed = Date.now() - this.startTime;
            this.timeout = this.isInterval
                ? this.timeout - (timePassed % this.timeout)
                : this.timeout - timePassed;
        }
    }
    resume() {
        if (this.isPaused && this.timeout > 0) {
            this.startTime = Date.now();
            this.timer = setTimeout(this._callback, this.timeout);
            this.isPaused = false;
        }
    }
    stop() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timeout = 0;
            this.timer = null;
        }
    }
    /**
     * @param callback - function to be called after timeout/interval
     * @param timeout - timeout in milliseconds
     * @param isInterval - if true, timer will be interval, by default it will be timeout
     */
    constructor(callback, timeout, isInterval = false) {
        this.isInterval = isInterval;
        this.timer = null;
        this.isPaused = false;
        this._callback = () => {
            callback();
            if (isInterval) {
                if (this.timeout !== timeout) {
                    // interval was paused, and replaced with setTimeout for one iteration
                    // we should create interval once again
                    this.timeout = timeout;
                    this.timer = setInterval(this._callback, timeout);
                }
            }
            else {
                this.timer = null;
            }
        };
        this.timeout = timeout;
        this.startTime = Date.now();
        this.isPaused = true;
        isInterval
            ? (this.timer = setInterval(this._callback, timeout))
            : (this.timer = setTimeout(this._callback, timeout));
    }
}
//# sourceMappingURL=timer.js.map
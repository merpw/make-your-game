/** {@link setTimeout} and {@link setInterval} that can be paused. */
export default class Timer {
  private timer: number | null = null
  private readonly _callback: () => void
  private startTime: number
  private timeout: number
  private isPaused = false

  public pause() {
    if (this.timer) {
      this.isPaused = true
      this.isInterval ? clearInterval(this.timer) : clearTimeout(this.timer)
      this.timer = null

      const timePassed = Date.now() - this.startTime
      this.timeout = this.isInterval
        ? this.timeout - (timePassed % this.timeout)
        : this.timeout - timePassed
    }
  }

  public resume() {
    if (this.isPaused && this.timeout > 0) {
      this.startTime = Date.now()
      this.timer = setTimeout(this._callback, this.timeout)
      this.isPaused = false
    }
  }

  public stop() {
    if (this.timer) {
      this.isInterval ? clearInterval(this.timer) : clearTimeout(this.timer)
      this.timeout = 0
      this.timer = null
    }
  }

  /**
   * @param callback - function to be called after timeout/interval
   * @param timeout - timeout in milliseconds
   * @param isInterval - if true, timer will be interval, by default it will be timeout
   */
  constructor(
    callback: () => void,
    timeout: number,
    private isInterval = false
  ) {
    this._callback = () => {
      callback()

      if (isInterval) {
        if (this.timeout > 0 && this.timeout !== timeout) {
          // interval was paused, and replaced with setTimeout for one iteration
          // we should create interval once again
          this.timeout = timeout
          this.timer = setInterval(this._callback, timeout)
        }
      } else {
        this.timer = null
      }
    }
    this.timeout = timeout
    this.startTime = Date.now()

    isInterval
      ? (this.timer = setInterval(this._callback, timeout))
      : (this.timer = setTimeout(this._callback, timeout))
  }
}

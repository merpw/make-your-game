/** A timer that can be paused, resumed, and stopped. */
export default class Timer {
  private timer: number | null
  private readonly _callback: () => void
  private startTime: number
  private timeout: number
  private isPaused = false

  public pause() {
    if (this.timer) {
      this.isPaused = true
      clearTimeout(this.timer)
      this.timer = null
      this.timeout = this.timeout - (Date.now() - this.startTime)
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
      clearTimeout(this.timer)
      this.timer = null
    }
  }

  constructor(callback: () => void, timeout: number) {
    this._callback = callback
    this.timeout = timeout
    this.startTime = Date.now()

    this.timer = setTimeout(() => {
      this._callback()
      this.timer = null
    }, this.timeout)
  }
}

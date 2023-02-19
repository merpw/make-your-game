import Timer from "./timer.js"

/** A class for non-static objects that can be animated and paused */
export class Animated {
  private timer: Timer | null = null
  public addTimer(callback: () => void, timeout: number) {
    this.timer?.stop()
    this.timer = new Timer(callback, timeout)
  }
  public pause() {
    this.timer?.pause()
  }
  public resume() {
    this.timer?.resume()
  }
  // TODO: implement animations here
}

/** A class for all moving creatures */
export default class Creature extends Animated {
  // TODO: move element, x and y here
}

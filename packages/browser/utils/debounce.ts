export class Debounce {
  private _immediate: boolean;
  private readonly _delay: number;
  private readonly _cooldownReset: number;
  private _timer: ReturnType<typeof setTimeout> | undefined;
  private _cooldownTimer: ReturnType<typeof setTimeout> | undefined;

  /**
   * Creates a new Debounce instance.
   * @param delay - Duration in milliseconds to wait before executing the function after the last call.
   * @param cooldownReset - Duration in milliseconds before allowing another immediate execution.
   *                        Defaults to the same value as delay. Unlike delay, cooldownReset controls
   *                        how soon a subsequent call can bypass the delay and execute immediately.
   */
  constructor(delay: number, cooldownReset: number = delay) {
    this._delay = delay;
    this._cooldownReset = cooldownReset;
    this._immediate = true;
  }

  private _shouldExecuteImmediately(): boolean {
    // If a cooldown is active, delay it again.
    // Otherwise, activate it.
    clearTimeout(this._cooldownTimer);
    this._cooldownTimer = setTimeout(() => {
      this._cooldownTimer = undefined;
      // Allow immediate execution again for a single call.
      this._immediate = true;
    }, this._cooldownReset);

    // We allow the current call and only this one to ignore the delay, while the cooldown is active.
    if (this._immediate) {
      this._immediate = false;
      return true;
    }

    return false;
  }

  /**
   * Cancels any pending delayed execution and resets the immediate execution state.
   * This will clear any active timers, preventing the debounced function from being called
   * if it was scheduled but not yet executed.
   */
  cancel() {
    clearTimeout(this._timer);
    clearTimeout(this._cooldownTimer);
    this._cooldownTimer = undefined;
    this._immediate = true;
  }

  call(fn: () => void) {
    clearTimeout(this._timer);
    // To prevent initial delay, the first call after some time is immediately executed and activates the cooldown
    // timer.
    if (this._shouldExecuteImmediately()) {
      fn();
      return;
    }

    this._timer = setTimeout(fn, this._delay);
  }
}

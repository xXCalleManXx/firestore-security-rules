export class Callable {

  protected caller: string;

  constructor(caller: string|Callable) {
    if (caller instanceof Callable) {
      this.caller = caller.toString();
    } else {
      this.caller = caller;
    }
  }

  public toString() {
    return this.caller;
  }

}

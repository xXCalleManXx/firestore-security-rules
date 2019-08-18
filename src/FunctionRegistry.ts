import {SecurityFunction} from "./types/SecurityFunction";
import {Callable} from "./types/Callable";
import {Static} from "./types/Static";

export class FunctionRegistry {

  private static instance: FunctionRegistry;

  private static get(): FunctionRegistry {

    if (this.instance === undefined) {
      this.instance = new this;
    }

    return this.instance;
  }

  private functions: {[name: string]: SecurityFunction} = {};

  public static registerFunction<T extends Callable>(fnt: SecurityFunction<T>, args: (string|Callable)[] = []): T {
    const self = FunctionRegistry.get();

    if (fnt.args === undefined) {
      fnt.args = [];
    }

    if (self.functions[fnt.name] === undefined) {
      self.functions[fnt.name] = fnt;
    }

    const caller = this.getCaller(fnt.name, args);

    try {
      const returnType = fnt.returnType as Static<T>;
      return new returnType(caller);
    } catch (e) {
      const returnType = fnt.returnType as Function;
      return returnType(caller);
    }

  }

  private static getCaller(name, _args: (string|Callable)[]): string {
    const args: string[] = [];

    for (const arg of _args) {
      if (typeof arg === 'string') {
        args.push(`'${arg}'`);
      } else {
        args.push(arg.toString());
      }
    }

    return `${name}(${args.join(', ')})`;
  }

  public static getFunctions(): SecurityFunction[] {
    return Object.values(this.get().functions);
  }

}

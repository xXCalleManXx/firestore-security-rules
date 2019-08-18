import {Callable} from "./Callable";
import {Static} from "./Static";

export interface SecurityFunction<T extends Callable = Callable> {

  args?: string[];
  returnStmnt: string|Callable|(() => Callable);
  name: string;
  returnType: ((caller: string) => T) | Static<T>,
  parent?: Static<any>

}

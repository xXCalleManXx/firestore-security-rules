import {Static} from "./Static";
import {Callable} from "./Callable";
import {Map} from "./Map";

export class Resource<T = Map> extends Callable {

  private _data: Static<T>;

  constructor(caller: string|Callable, data: Static<T>) {
    super(caller);
    this._data = data;
  }

  get data(): T {
    return new this._data(`${this}.data`);
  }

  public static data<T = Map>(type?: Static<T>): T {
    if (!type) {
      return new Map('resource.data') as any;
    }

    return new type('resource.data');
  }

}

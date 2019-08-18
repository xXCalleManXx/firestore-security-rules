import {Callable} from "./Callable";
import {Resource} from "./Resource";
import {Static} from "./Static";
import {Field} from "./Field";
import {Path} from "./fields/Path";

export class Map extends Callable {

  public static get<T>(this: Static<T>, path: string|Path|Callable): Resource<T> {

    if (path instanceof Path) {
      return new Resource<T>(`get(${path})`, this);
    }

    let _path = path;

    if (path instanceof Callable) {
      _path = `/$(${path})`;
    }

    const caller = `get(/databases/$(database)/documents${_path})`;

    return new Resource<T>(caller, this);
  }

  field(name: string): Field {
    return new Field(this, name);
  }

}

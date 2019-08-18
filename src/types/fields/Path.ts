import {Field} from "../Field";
import {Index} from "./Index";
import {Static} from "../Static";
import {Map} from '../Map';
import {Resource} from "../Resource";

export class Path extends Field<Path> {

  index(i: number): Index {
    return new Index(this, `[${i}]`);
  }

  static full(path: string): Path {
    return new Path(`/databases/$(database)/documents${path}`);
  }

  get<K extends Map>(map: Static<K>): Resource<K> {
    return new Resource(this, map);
  }

}

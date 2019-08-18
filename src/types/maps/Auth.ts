import {Map} from "../Map";
import {Field} from "../Field";
import {Path} from "../fields/Path";

export class Auth extends Map {

  get uid() {
    return new Field(this, 'uid');
  }

  get token() {
    return new Map(`${this}.token`);
  }

}

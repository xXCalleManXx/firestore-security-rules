import {Map} from "../Map";
import {Field} from "../Field";

export class Query extends Map {

  get limit() {
    return new Field(this, 'limit');
  }

  get offset() {
    return new Field(this, 'offset');
  }

  get orderBy() {
    return new Field(this, 'orderBy');
  }

}

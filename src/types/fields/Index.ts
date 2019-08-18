import {Field} from "../Field";

export class Index extends Field {

  toString(): string {
    return `${this.caller}${this.fieldName}`
  }

}

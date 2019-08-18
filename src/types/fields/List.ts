import {Field} from "../Field";

export class List extends Field {

  toString(): string {
    if (!this.fieldName) {
      return this.caller;
    }

    return `${this.caller}.${this.fieldName}`;
  }

  index(i: number): Field {
    return new Field(this, `[${i}]`);
  }

  contain(val: any): string {
    return `${val} in ${this}`;
  }

}

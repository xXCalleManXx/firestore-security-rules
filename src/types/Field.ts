import {Callable} from "./Callable";
import {Static} from "./Static";
import {DataType} from "./DataType";
import {Primitive} from "./Primitive";

export class Field<T = any> extends Callable {

  protected fieldName: string;

  constructor(caller: string|Callable, fieldName?: string) {
    super(caller);
    if (fieldName) {
      this.fieldName = fieldName;
    }
  }

  greaterOrEqual(value: any) {
    return new Primitive(`${this} >= ${value}`);
  }

  equal(value: T): Primitive {

    if (typeof value === "string") {
      return new Primitive(`${this} == "${value}"`);
    }


    return new Primitive(`${this} == ${value}`);
  }

  toString(): string {
    if (!this.fieldName) {
      return super.toString();
    }

    return `${super.toString()}.${this.fieldName}`;
  }

  is(type: DataType|DataType[]): string {

    if (typeof type === 'string') {
      return `${this} is ${type}`;
    }

    const typeChecks: string[] = [];

    for (const t of type) {
      typeChecks.push(`${this.toString()} is ${t}`);
    }

    return `(${typeChecks.join(' || ')})`;
  }

  public static var<K extends Field = Field>(this: Static<K>, name: string) {
    return new this(name);
  }

}

import {Callable} from "../types/Callable";
import {Request} from "../types/Request";
import {initCanWrite} from "./initializers";

function isGreaterOrEqual(amount: number) {
  return (target: Object, propertyKey: string) => {
    initCanWrite(target, Request.data().field(propertyKey).greaterOrEqual(amount))
  }
}

function isEqual(val: string | Callable) {
  return (target: Object, propertyKey: string) => {
    initCanWrite(target, Request.data().field(propertyKey).equal(val))
  }
}

export {
  isGreaterOrEqual,
  isEqual,
}

export * from './is-data-type';
export * from './read-only';
export * from './model';
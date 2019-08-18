import {Static} from "../types/Static";
import {Callable} from "../types/Callable";
import {getHostmanRegistry, initCanWrite, initModel} from "./initializers";

function parent(parent: Static<any>) {
  return (target: any) => {
    const className = target.prototype.constructor.name;

    initModel(className);

    getHostmanRegistry()[className]['parent'] = parent;

  }
}

function match(match: string) {
  return (target: any) => {
    const className = target.prototype.constructor.name;

    initModel(className);

    getHostmanRegistry()[className]['match'] = match;

  }
}

function canRead(canRead: string | Callable) {
  return (target: any) => {
    const className = target.prototype.constructor.name;

    initModel(className);

    getHostmanRegistry()[className]['canRead'] = canRead.toString();

  }
}

function canList(canList: string | Callable) {
  return (target: any) => {
    const className = target.prototype.constructor.name;

    initModel(className);

    getHostmanRegistry()[className]['canList'] = canList.toString();
  }

}

function canDelete(canDelete: string) {
  return (target: any) => {
    const className = target.prototype.constructor.name;

    initModel(className);

    getHostmanRegistry()[className]['canDelete'] = canDelete;

  }
}

function canWrite(rule: string | Callable) {
  return (target: Object, propertyKey?: string) => {
    initCanWrite(target, rule, propertyKey)
  }
}

export {
  canList,
  canDelete,
  canRead,
  canWrite,
  parent,
  match
}
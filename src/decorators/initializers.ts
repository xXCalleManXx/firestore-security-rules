import {Callable} from "../types/Callable";
import {DataType} from "../types/DataType";
import {Request} from "../types/Request";

function initHostman() {
  if ((global as any)['hostman'] == undefined) {
    (global as any)['hostman'] = {};
  }
}

function getHostmanRegistry() {
  return (global as any)['hostman'];
}

function initModel(className: string) {
  initHostman();

  if (getHostmanRegistry()[className] == undefined) {
    getHostmanRegistry()[className] = {
      match: '',
      parent: null,
      canRead: '',
      canDelete: '',
      canList: '',
      canWrite: []
    }
  }
}

function initCanWrite(target: Object | Function, canWrite?: string | Callable, propertyKey?: string) {
  let className = '';

  if (typeof target == "function") {
    className = target.prototype.constructor.name;
  } else {
    className = target.constructor.name;
  }

  initModel(className);

  const rules: string[] = [];

  if (canWrite) {
    rules.push(canWrite.toString());
  }

  if (propertyKey) {
    rules.push(`request.resource.data.${propertyKey} == resource.data.${propertyKey}`);
  }

  let rule = rules.join(' || ');

  getHostmanRegistry()[className]['canWrite'].push(`(${rule})`);
}

function initIsType(target: Object, propertyKey: string, type: DataType) {
  initCanWrite(target, Request.data().field(propertyKey).is(type))
}


export {
  initCanWrite,
  initIsType,
  initModel,
  getHostmanRegistry
}
import {initIsType} from "./initializers";

function isString() {
  return (target: Object, propertyKey: string) => {
    initIsType(target, propertyKey, 'string')
  }
}

function isFloat() {
  return (target: Object, propertyKey: string) => {
    initIsType(target, propertyKey, 'float')
  }
}

function isInt() {
  return (target: Object, propertyKey: string) => {
    initIsType(target, propertyKey, 'int')
  }
}

function isPath() {
  return (target: Object, propertyKey: string) => {
    initIsType(target, propertyKey, 'path')
  }
}

function isDate() {
  return (target: Object, propertyKey: string) => {
    initIsType(target, propertyKey, 'timestamp')
  }
}

function isBool() {
  return (target: Object, propertyKey: string) => {
    initIsType(target, propertyKey, 'bool')
  }
}


export {
  isString,
  isFloat,
  isInt,
  isPath,
  isDate,
  isBool,
}
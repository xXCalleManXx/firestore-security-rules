import {initCanWrite} from "./initializers";

function readOnly() {
  return (target: Object, propertyKey: string) => {
    initCanWrite(target, undefined, propertyKey)
  }
}
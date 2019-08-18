import {initCanWrite} from "../../src/decorators/initializers";
import {Functions} from "../functions";

export function isAdmin() {
  return (target: Object, propertyKey?: string) => {
    initCanWrite(target, Functions.isAdmin(), propertyKey)
  }
}
import {canRead, canWrite, isPath, isString, match} from "../../src/decorators";
import {Field} from "../../src/types/Field";
import {Request} from "../../src/types/Request";
import {User} from "./user";
import {Map} from "../../src/types/Map";
import {Functions} from "../functions";

@match('/user-role/{roleId}')
@canRead(`
  ${Functions.currentUserRole().equal(Request.path())}
`)
@canWrite(Functions.isAdmin())
export class UserRole extends Map {

  @isString()
  name = new Field<'admin'|'customer'>(this, 'name');

}
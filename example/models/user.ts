import {canRead, isPath, isString, match} from "../../src/decorators";
import {Field} from "../../src/types/Field";
import {Request} from "../../src/types/Request";
import {Map} from "../../src/types/Map";
import {Path} from "../../src/types/fields/Path";
import {isAdmin} from "../decorators";

@match('/users/{userId}')
@canRead(`
  ${Field.var('userId').equal(Request.auth().uid)}
`)
export class User extends Map {

  @isString()
  email = new Field(this, 'email');

  @isPath()
  @isAdmin()
  role = new Path(this, 'role');

}
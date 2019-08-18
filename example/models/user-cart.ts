import {canRead, match, parent} from "../../src/decorators";
import {User} from "./user";
import {Field} from "../../src/types/Field";
import {Request} from "../../src/types/Request";

@parent(User)
@match('/cart/{cartId}')
@canRead(`
  ${Field.var('userId').equal(Request.auth().uid)}
`)
export class UserCart {

}
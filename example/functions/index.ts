import {Request} from "../../src/types/Request";
import {FunctionRegistry} from "../../src/FunctionRegistry";
import {Field} from "../../src/types/Field";
import {User, UserRole} from "../models";
import {Resource} from "../../src/types/Resource";
import {Path} from "../../src/types/fields/Path";
import {Primitive} from "../../src/types/Primitive";

export class Functions {

  public static isLoggedIn() {
    return `${Request.auth().uid} != null`
  }

  public static currentUser(): Resource<User> {
    const userPath = Path.full(`/users/${Request.authId()}`);
    return FunctionRegistry.registerFunction({
      returnStmnt: User.get(userPath),
      name: 'currentUser',
      returnType: caller => {
        return new Resource(caller, User);
      }
    })
  }

  public static currentUserRole(): Path {
    return FunctionRegistry.registerFunction({
      returnStmnt: this.currentUser().data.role,
      name: 'userRoleId',
      returnType: Path
    })
  }

  public static isAdmin() {
    return FunctionRegistry.registerFunction({
      returnStmnt: () => {
        return this.currentUserRole().get(UserRole).data.name.equal('admin')
      },
      name: 'isAdmin',
      returnType: Primitive
    })
  }

}
import {Field} from "./Field";
import {Map} from "./Map";
import {Path} from "./fields/Path";
import {Query} from "./maps/Query";
import {Callable} from "./Callable";
import {Auth} from "./maps/Auth";

export class Request extends Callable {

  constructor() {
    super('request')
  }

  private static get request() {
    return new this();
  }


  public static authId() {
    return new Field(`${this.request}.auth`, 'uid')
  }

  public static userId() {
    return new Path(`path(${this.auth().uid})`).index(3);
  }

  public static auth() {
    return new Auth(`${this.request}.auth`);
  }

  public static data() {
    return new Map(`${this.request}.resource.data`);
  }

  public static method() {
    return new Field<'get'|'list'|'create'|'update'|'delete'>(this.request, 'method');
  }

  public static path(): Path {
    return new Path(this.request, 'path');
  }

  public static query() {
    return new Query(`${this.request}.query`);
  }

  /**
   * Time of the server when the request is received
   */
  public static time() {
    return new Field(this.request, 'time')
  }

}

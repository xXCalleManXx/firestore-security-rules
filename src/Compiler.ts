import {SecurityFunction} from "./types/SecurityFunction";
import {Static} from "./types/Static";
import * as lodash from 'lodash';
import {getHostmanRegistry} from "./decorators/initializers";
import {Callable} from "./types/Callable";
import {FunctionRegistry} from "./FunctionRegistry";

const fs = require('fs');

type Model = {
  match: string,
  canRead: string,
  canDelete: string,
  canList: string,
  canWrite: string[],
  parent: Static<any>,
  functions: SecurityFunction[]
};

type ModelTree = {[className: string]: ModelTree};

export class Compiler {

  private functions: SecurityFunction[] = [];

  public registerModels(classes: Object) {
    const modelNames: string[] = Object.keys(classes);

    for (const modelName of modelNames) {
      const clazz = classes[modelName];
      new clazz();
    }
  }

  private registerFunctions(fnts: SecurityFunction[]) {

    // Only register functions without parent as top-level function
    const fnts_ = fnts.filter(value => {

      const parent = value.parent;

      if (parent === undefined) {
        return true;
      }

      const parentName = parent.prototype.constructor.name;

      const model: Model = this.getModel(parentName);

      if (!model) {
        return true;
      }

      if (model.functions === undefined) {
        model.functions = [];
      }

      model.functions.push(value);

      return false;
    });

    this.functions = [...this.functions, ...fnts_];
  }

  /**
   * Compile all functions without parent
   */
  private compileFunctions(): string {

    const functions: string[] = [];

    for (const {args, returnStmnt, name} of this.functions) {
      functions.push(this.compileFunction(returnStmnt, name, args))
    }

    return functions.join('');
  }

  /**
   * Compile a specific function and return as string
   *
   * @param args
   * @param returnStmnt
   * @param name
   * @param tabs
   */
  private compileFunction(returnStmnt: string|Callable|(() => Callable), name: string, args: string[] = [], tabs = '') {

    let _returnStmnt = returnStmnt;
    if (typeof _returnStmnt === 'function') {
      _returnStmnt = _returnStmnt();
    }

    return `
    ${tabs}function ${name}(${args.join(', ')}) {
    ${tabs}\treturn ${_returnStmnt.toString().trim()};
    ${tabs}}
    `
  }

  /**
   * Compile all registered models
   */
  public compileModels(): string {

    const modelTree = this.modelTree();

    const compiledModels: string[] = [];

    for (const className in modelTree) {
      const model = this.getModel(className);
      const childTree = modelTree[className];

      compiledModels.push(this.compileMatch(model, childTree))
    }

    return compiledModels.join('\n\n\n');
  }

  private getModel(className: string): Model {
    const models = getHostmanRegistry();

    return models[className];
  }

  /**
   * Create tree of models sorted by parents
   */
  private modelTree(): ModelTree {

    const models = getHostmanRegistry();

    let mainTree: ModelTree = {};

    const createTree = (className: string, tree: ModelTree): ModelTree => {
      const model = models[className];
      const parent: Static<any>|null = model['parent'];

      // if company
      if (!parent) {
        const childTree = {};
        childTree[className] = tree;

        return childTree;
      }

      const parentName = parent.prototype.constructor.name;

      const childTree = {};

      childTree[className] = tree;

      return createTree(parentName, childTree);
    };

    for (const className in models) {
      const tree = createTree(className, {});

      mainTree =  lodash.merge(mainTree, tree);

    }

    return mainTree;
  }

  /**
   * Compile af top-level model and it's children
   *
   * @param model
   * @param modelTree
   * @param level
   */
  private compileMatch(model: Model, modelTree: ModelTree, level = 0): string {

    const childrenParts: string[] = [''];

    const childLevel = level+1;
    for (const childName in modelTree) {
      const childTree = modelTree[childName];
      childrenParts.push(this.compileMatch(this.getModel(childName), childTree, childLevel))
    }

    const tabs = this.getTabs(level);

    const separator = '\n\n';

    let children = '';

    if (childrenParts.length > 0) {
      children = childrenParts.join(separator);
    }

    const functions = this.compileModelFunctions(model, tabs, separator);
    const canWrite = this.compileModelCanWrite(model, tabs);
    const canRead = this.compileModelCanRead(model, tabs);
    const canDelete = this.compileModelCanDelete(model, tabs);
    const canList = this.compileModelCanList(model, tabs);

    return `
    ${tabs}match ${model.match} {${functions}${canList}${canRead}${canWrite}${canDelete}${children}
    ${tabs}}`;
  }

  private getTabs(level: number) {
    let tabs = '';

    for (let i = 0; i < level; i++) {
      tabs += '\t'
    }

    return tabs;
  }

  private compileModelChildren(modelTree: ModelTree, level: number) {
    const childrenParts: string[] = [];

    const childLevel = level+1;
    for (const childName in modelTree) {
      const childTree = modelTree[childName];
      childrenParts.push(this.compileMatch(this.getModel(childName), childTree, childLevel))
    }

    if (childrenParts.length === 0) {
      return [''];
    }

    return childrenParts;
  }

  private compileModelFunctions(model: Model, tabs: string, separator: string) {
    let functions = '';

    if (model.functions !== undefined) {
      let functionParts: string[] = [];

      for (const {args, returnStmnt, name} of model.functions) {
        functionParts.push(this.compileFunction(returnStmnt, name, args, tabs + '\t'))
      }

      functions = tabs + functionParts.join(separator) + separator;
    }

    return functions;
  }

  private compileModelCanWrite(model: Model, tabs: string) {
    let canWrite = '';

    if (model.canWrite.length != 0) {
      canWrite = model.canWrite.join(` &&\n${tabs}\t\t\t\t\t\t`);
    } else {
      canWrite = 'false';
    }
    return `\n${tabs}\t\tallow write: if ${canWrite};`;
  }

  private compileModelCanRead(model: Model, tabs: string) {
    return `\n${tabs}\t\tallow get: if ${model.canRead.trim()};`;
  }

  private compileModelCanDelete(model: Model, tabs: string) {
    let canDelete = '';

    if (model.canDelete) {
      canDelete = `\n${tabs}\t\tallow delete: if ${model.canDelete};`;
    }

    return canDelete;
  }

  private compileModelCanList(model: Model, tabs: string) {
    let canList = '';

    if (model.canList) {
      canList = `\n${tabs}\t\tallow list: if ${model.canList};`;
    }

    return canList;
  }

  /**
   * Compile the final file for deploy to firestore
   *
   * @param fileName
   */
  public compile(fileName: string) {

    this.registerFunctions(FunctionRegistry.getFunctions());

    const functions = this.compileFunctions();
    const models = this.compileModels();

    let template = this.rulesTemplate();

    template = template.replace('{% rules %}', functions + '\n' + models);

    fs.writeFileSync(fileName, template);
  }

  private rulesTemplate() {
    return `
service cloud.firestore {
  match /databases/{database}/documents {
    {% rules %}
  }
}
    `.trim();
  }


}

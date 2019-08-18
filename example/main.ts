import {Compiler} from "../src/Compiler";
import * as models from './models';

const compiler = new Compiler();
compiler.registerModels(models);

compiler.compile(__dirname + '/firestore.rules');
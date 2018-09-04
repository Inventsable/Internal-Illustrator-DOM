const resolve = require('path').resolve;
// const TJS = require('*')
import * as TJS from "typescript-json-schema";

console.log('Schema is online');

// optionally pass argument to schema generator
const settings: TJS.PartialArgs = {
    required: true
};

// optionally pass ts compiler options
const compilerOptions: TJS.CompilerOptions = {
    strictNullChecks: true
}

// optionally pass a base path
const basePath = "../node_modules/types-for-adobe/Illustrator/2015.3";
const program = TJS.getProgramFromFiles([resolve("index.d.ts")], compilerOptions, basePath);

// We can either get the schema for one file and one type...
const schema = TJS.generateSchema(program, "MyType", settings);

// ... or a generator that lets us incrementally get more schemas
const generator = TJS.buildGenerator(program, settings);

// all symbols
const symbols = generator.getUserSymbols();

console.log(basePath);
console.log(schema);
console.log(symbols);

// Get symbols for different types from generator.
// generator.getSchemaForSymbol("MyType");
// generator.getSchemaForSymbol("AnotherType");

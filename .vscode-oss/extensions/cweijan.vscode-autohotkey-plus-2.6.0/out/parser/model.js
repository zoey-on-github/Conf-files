"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Method = exports.Block = exports.Ref = exports.Label = void 0;
class Label {
    constructor(name, document, line, character) {
        this.name = name;
        this.document = document;
        this.line = line;
        this.character = character;
    }
}
exports.Label = Label;
class Ref {
    constructor(name, document, line, character) {
        this.name = name;
        this.document = document;
        this.line = line;
        this.character = character;
    }
}
exports.Ref = Ref;
class Block {
    constructor(name, document, line, character) {
        this.name = name;
        this.document = document;
        this.line = line;
        this.character = character;
    }
}
exports.Block = Block;
class Method {
    constructor(origin, name, document, line, character, withQuote, comment) {
        this.origin = origin;
        this.name = name;
        this.document = document;
        this.line = line;
        this.character = character;
        this.withQuote = withQuote;
        this.comment = comment;
        this.buildParams();
        this.variables = [];
    }
    buildParams() {
        const refPattern = /\s*\((.+?)\)\s*$/;
        if (this.origin != this.name) {
            const paramsMatch = this.origin.match(refPattern);
            if (paramsMatch) {
                this.params = paramsMatch[1].split(",").filter(param => param.trim() != "").map(param => {
                    const paramMatch = param.match(/[^:=* \t]+/);
                    return paramMatch != null ? paramMatch[0] : param;
                });
                this.full = this.origin.replace(paramsMatch[1], this.params.join(","));
            }
            else {
                this.params = [];
                this.full = this.origin;
            }
        }
    }
    pushVariable(variables) {
        if (!Array.isArray(variables)) {
            variables = [variables];
        }
        loop: for (const variable of variables) {
            for (const curVariable of this.variables) {
                if (curVariable.name == variable.name)
                    continue loop;
            }
            for (const paramStr of this.params) {
                if (paramStr == variable.name)
                    continue loop;
            }
            this.variables.push(variable);
        }
    }
}
exports.Method = Method;
//# sourceMappingURL=model.js.map
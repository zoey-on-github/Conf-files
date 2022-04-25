"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariableHandler = void 0;
const vscode_debugadapter_1 = require("vscode-debugadapter");
const scope_1 = require("../struct/scope");
const util_1 = require("../util/util");
class VariableHandler {
    constructor() {
        this.variableHandles = new vscode_debugadapter_1.Handles();
        this.variableMap = new Map();
    }
    getScopeByRef(ref) {
        const scopeOrVar = this.variableHandles.get(ref);
        if ((typeof scopeOrVar) == "string") {
            return scopeOrVar == 'Local' ? scope_1.VarScope.LOCAL : scope_1.VarScope.GLOBAL;
        }
        return scopeOrVar.scope;
    }
    getVarByRef(ref) {
        return this.variableHandles.get(ref);
    }
    getVarByName(name) {
        return this.variableMap.get(name);
    }
    obtainValue(value) {
        let type;
        let isVariable = false;
        const match = value.match(/^(?:()|\"(.*)\"|(true|false)|([+-]?\d+)|([+-]?\d+\.[+-]?\d+)|([\w\d]+))$/si);
        if (!match) {
            return Promise.reject(new Error(`"${value}" is invalid value.`));
        }
        const [, blank, str, bool, int, float, varName] = match;
        if (blank !== undefined) {
            type = 'string';
            value = '';
        }
        else if (str !== undefined) {
            type = 'string';
            value = str;
        }
        else if (bool !== undefined) {
            type = 'string';
            value = bool.match(/true/i) ? '1' : '0';
        }
        else if (int !== undefined) {
            type = 'integer';
            value = int;
        }
        else if (float !== undefined) {
            type = 'float';
            value = float;
        }
        else {
            isVariable = true;
            value = varName;
        }
        return Promise.resolve({ type, value, isVariable });
    }
    getArrayValue(ref, start, count) {
        const ahkVar = this.getVarByRef(ref);
        if (!Array.isArray(ahkVar === null || ahkVar === void 0 ? void 0 : ahkVar.value))
            return [];
        return ahkVar.value.slice(start, start + count).map((value, index) => {
            return new vscode_debugadapter_1.Variable(`[${start + index + 1}]`, value);
        });
    }
    scopes(frameId) {
        this.frameId = frameId;
        return [new vscode_debugadapter_1.Scope("Local", this.variableHandles.create("Local"), false), new vscode_debugadapter_1.Scope("Global", this.variableHandles.create("Global"), false)];
    }
    getFrameId() {
        return this.frameId;
    }
    parsePropertyget(response, scope) {
        return this.parse(response.property.content ? response : response.property, scope);
    }
    parse(response, scope) {
        return util_1.Util.toArray(response.property)
            .map((property) => {
            try {
                const { attr } = property;
                let indexedVariables, namedVariables;
                if (this.likeArray(property)) {
                    const length = this.getLikeArrayLength(property);
                    indexedVariables = 100 < length ? length : undefined;
                    namedVariables = 100 < length ? 1 : undefined;
                }
                const ahkVar = { scope, frameId: scope == scope_1.VarScope.GLOBAL ? -1 : this.frameId, name: property.attr.fullname, value: this.buildVariableValue(property) };
                this.variableMap.set(attr.name, ahkVar);
                return {
                    type: attr.type, name: attr.name, value: this.formatPropertyValue(property),
                    indexedVariables, namedVariables, variablesReference: attr.type != "object" ? 0 : this.variableHandles.create(ahkVar),
                };
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    buildVariableValue(property) {
        const { attr, content = '' } = property;
        if (['string', 'integer', 'float'].includes(attr.type) === true) {
            const primitive = util_1.Util.atob(content);
            if (attr.type === 'integer' || attr.type === 'float') {
                return primitive;
            }
            return `"${primitive}"`;
        }
        else if (attr.type === 'object') {
            const childs = util_1.Util.toArray(property.property);
            if (this.likeArray(property) == true && attr.classname === 'Object') {
                return childs.map((p) => {
                    return util_1.Util.atob(p.content);
                });
            }
            else {
                return childs.reduce((value, child) => {
                    value[child.attr.fullname] = util_1.Util.atob(child.content);
                    return value;
                }, {});
            }
        }
        return `${attr.classname}`;
    }
    /** formats a dbgp property value for VS Code */
    formatPropertyValue(property) {
        const { attr, content = '' } = property;
        if (['string', 'integer', 'float'].includes(attr.type) === true) {
            const primitive = Buffer.from(content, attr.encoding).toString();
            if (attr.type === 'integer' || attr.type === 'float') {
                return primitive;
            }
            return `"${primitive}"`;
        }
        else if (attr.type === 'object') {
            if (this.likeArray(property) == true) {
                const classname = attr.classname === 'Object' ? 'Array' : attr.classname;
                const length = this.getLikeArrayLength(property);
                return `${classname}(${length})`;
            }
        }
        return `${attr.classname}`;
    }
    getLikeArrayLength(property) {
        const properties = util_1.Util.toArray(property.property);
        if (properties.length == 0) {
            return 0;
        }
        for (let i = properties.length - 1; i > 0; i--) {
            const match = properties[i].attr.name.match(/\[([0-9]+)\]/);
            if (match) {
                return parseInt(match[1]);
            }
        }
        return 0;
    }
    likeArray(property) {
        return util_1.Util.toArray(property.property)
            .some((childProperty) => childProperty.attr.name.match(/\[[0-9]+\]/));
    }
}
exports.VariableHandler = VariableHandler;
//# sourceMappingURL=variableHandler.js.map
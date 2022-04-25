"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const fs = require("fs");
const vscode = require("vscode");
const codeUtil_1 = require("../common/codeUtil");
const out_1 = require("../common/out");
const model_1 = require("./model");
class Parser {
    /**
     * load method list by path
     * @param buildPath
     */
    static buildByPath(buildPath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!buildPath)
                return;
            if (fs.statSync(buildPath).isDirectory()) {
                fs.readdir(buildPath, (err, files) => {
                    if (err) {
                        out_1.Out.log(err);
                        return;
                    }
                    for (const file of files) {
                        if (file.match(/(^\.|out|target|node_modules)/)) {
                            continue;
                        }
                        this.buildByPath(buildPath + "/" + file);
                    }
                });
            }
            else if (buildPath.match(/\b(ahk|ext)$/i)) {
                const document = yield vscode.workspace.openTextDocument(vscode.Uri.file(buildPath));
                this.buildScript(document);
            }
        });
    }
    /**
     * detect method list by document
     * @param document
     */
    static buildScript(document, usingCache = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (usingCache && null != this.documentCache.get(document.uri.path)) {
                return this.documentCache.get(document.uri.path);
            }
            const methods = [];
            let refs = [];
            const labels = [];
            const variables = [];
            const blocks = [];
            let currentMethod;
            let deep = 0;
            const lineCount = Math.min(document.lineCount, 10000);
            let blockComment = false;
            for (let line = 0; line < lineCount; line++) {
                const lineText = document.lineAt(line).text;
                if (lineText.match(/ *\/\*/)) {
                    blockComment = true;
                }
                if (lineText.match(/ *\*\//)) {
                    blockComment = false;
                }
                if (blockComment) {
                    continue;
                }
                const methodOrRef = Parser.detechMethodByLine(document, line);
                if (methodOrRef) {
                    if (methodOrRef instanceof model_1.Method) {
                        methods.push(methodOrRef);
                        refs.push(new model_1.Ref(methodOrRef.name, document, line, methodOrRef.character));
                        currentMethod = methodOrRef;
                        if (methodOrRef.withQuote)
                            deep++;
                        continue;
                    }
                    else {
                        codeUtil_1.CodeUtil.join(refs, methodOrRef);
                    }
                }
                const label = Parser.getLabelByLine(document, line);
                if (label) {
                    labels.push(label);
                    continue;
                }
                const block = Parser.getBlockByLine(document, line);
                if (block) {
                    blocks.push(block);
                }
                if (lineText.indexOf("{") != -1) {
                    deep++;
                }
                if (lineText.indexOf("}") != -1) {
                    deep--;
                    if (currentMethod != null) {
                        currentMethod.endLine = line;
                    }
                }
                const variable = Parser.detechVariableByLine(document, line);
                if (variable) {
                    if (deep == 0 || !currentMethod) {
                        this.joinVars(variables, variable);
                    }
                    else {
                        currentMethod.pushVariable(variable);
                    }
                }
            }
            const script = { methods, labels, refs, variables, blocks };
            this.documentCache.set(document.uri.path, script);
            return script;
        });
    }
    static getMethodByName(document, name) {
        return __awaiter(this, void 0, void 0, function* () {
            name = name.toLowerCase();
            for (const method of this.documentCache.get(document.uri.path).methods) {
                if (method.name.toLowerCase() == name) {
                    return method;
                }
            }
            for (const filePath of this.documentCache.keys()) {
                for (const method of this.documentCache.get(filePath).methods) {
                    if (method.name.toLowerCase() == name) {
                        return method;
                    }
                }
            }
        });
    }
    static getAllMethod() {
        return __awaiter(this, void 0, void 0, function* () {
            const methods = [];
            for (const filePath of this.documentCache.keys()) {
                for (const method of this.documentCache.get(filePath).methods) {
                    methods.push(method);
                }
            }
            return methods;
        });
    }
    static getLabelByName(document, name) {
        return __awaiter(this, void 0, void 0, function* () {
            name = name.toLowerCase();
            for (const label of this.documentCache.get(document.uri.path).labels) {
                if (label.name.toLowerCase() == name) {
                    return label;
                }
            }
            for (const filePath of this.documentCache.keys()) {
                for (const label of this.documentCache.get(filePath).labels) {
                    if (label.name.toLowerCase() == name) {
                        return label;
                    }
                }
            }
        });
    }
    static getAllRefByName(name) {
        const refs = [];
        name = name.toLowerCase();
        for (const filePath of this.documentCache.keys()) {
            const document = this.documentCache.get(filePath);
            for (const ref of document.refs) {
                if (ref.name.toLowerCase() == name) {
                    refs.push(ref);
                }
            }
        }
        return refs;
    }
    static getBlockByLine(document, line) {
        const { text } = document.lineAt(line);
        const blockMatch = text.match(/;;(.+)/);
        if (blockMatch) {
            return { document, line, name: blockMatch[1], character: text.indexOf(blockMatch[1]) };
        }
    }
    static getLabelByLine(document, line) {
        const text = codeUtil_1.CodeUtil.purity(document.lineAt(line).text);
        const label = /^ *([\u4e00-\u9fa5_a-zA-Z0-9]+) *:{1}(?!(:|=))/.exec(text);
        if (label) {
            const labelName = label[1];
            if (labelName.toLowerCase() == "case" || labelName.toLowerCase() == "default")
                return;
            return new model_1.Label(label[1], document, line, text.indexOf(labelName));
        }
    }
    static detechVariableByLine(document, line) {
        const lineText = codeUtil_1.CodeUtil.purity(document.lineAt(line).text);
        const defMatch = lineText.match(Parser.varDefPattern);
        if (defMatch) {
            const varName = defMatch[1];
            return {
                line, document, isGlobal: true, method: null, name: varName, character: lineText.indexOf(varName)
            };
        }
        else {
            let vars = [];
            const commandMatchAll = codeUtil_1.CodeUtil.matchAll(Parser.varCommandPattern, lineText.replace(/\(.+?\)/g, ""));
            for (let index = 0; index < commandMatchAll.length; index++) {
                if (index == 0)
                    continue;
                const varName = commandMatchAll[index][1];
                if (this.keywords.includes(varName.toLowerCase())) {
                    continue;
                }
                vars.push({
                    line, document, isGlobal: true, method: null, name: varName, character: lineText.indexOf(commandMatchAll[index][0])
                });
            }
            return vars;
        }
        return null;
    }
    /**
     * detect method by line
     * @param document
     * @param line
     */
    static detechMethodByLine(document, line, origin) {
        origin = origin != undefined ? origin : document.lineAt(line).text;
        const text = codeUtil_1.CodeUtil.purity(origin);
        const refPattern = /\s*(([\u4e00-\u9fa5_a-zA-Z0-9]+)(?<!if|while)\(.*?\))\s*(\{)?\s*/i;
        const methodMatch = text.match(refPattern);
        if (!methodMatch) {
            return;
        }
        const methodName = methodMatch[2];
        const character = origin.indexOf(methodName);
        if (text.length != methodMatch[0].length) {
            let refs = [new model_1.Ref(methodName, document, line, character)];
            const newRef = this.detechMethodByLine(document, line, origin.replace(new RegExp(methodName + "\\s*\\("), ""));
            codeUtil_1.CodeUtil.join(refs, newRef);
            return refs;
        }
        const methodFullName = methodMatch[1];
        const isMethod = methodMatch[3];
        if (isMethod) {
            return new model_1.Method(methodFullName, methodName, document, line, character, true, Parser.getRemarkByLine(document, line - 1));
        }
        for (let i = line + 1; i < document.lineCount; i++) {
            const nextLineText = codeUtil_1.CodeUtil.purity(document.lineAt(i).text);
            if (!nextLineText.trim()) {
                continue;
            }
            if (nextLineText.match(/^\s*{/)) {
                return new model_1.Method(methodFullName, methodName, document, line, character, false, Parser.getRemarkByLine(document, line - 1));
            }
            else {
                return new model_1.Ref(methodName, document, line, character);
            }
        }
    }
    /**
     * detech remark, remark format: ;any
     * @param document
     * @param line
     */
    static getRemarkByLine(document, line) {
        if (line >= 0) {
            const { text } = document.lineAt(line);
            const markMatch = text.match(/^\s*;(.+)/);
            if (markMatch) {
                return markMatch[1];
            }
        }
        return null;
    }
    static joinVars(variables, items) {
        if (variables == undefined || items == undefined) {
            return;
        }
        if (!Array.isArray(items)) {
            items = [items];
        }
        loop: for (const item of items) {
            for (const variable of variables) {
                if (variable.name == item.name) {
                    continue loop;
                }
            }
            variables.push(item);
        }
    }
}
exports.Parser = Parser;
Parser.documentCache = new Map();
Parser.varDefPattern = /[ \t]*(\w+?)\s*([+\-*/.:])?(?<![=!])=(?![=!]).+/;
Parser.varCommandPattern = /(\w+)[ \t,]+/g;
Parser.keywords = ['and', 'or', 'new', 'extends', 'if', 'loop'];
//# sourceMappingURL=parser.js.map
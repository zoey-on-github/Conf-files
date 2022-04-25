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
exports.DefProvider = void 0;
const vscode = require("vscode");
const parser_1 = require("../parser/parser");
const fs_1 = require("fs");
class DefProvider {
    provideDefinition(document, position, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileLink = yield this.tryGetFileLink(document, position);
            if (fileLink) {
                return fileLink;
            }
            const word = document.getText(document.getWordRangeAtPosition(position));
            // get method
            if (new RegExp(word + "\\s*\\(.*?\\)").test(document.lineAt(position.line).text)) {
                const method = yield parser_1.Parser.getMethodByName(document, word);
                if (method) {
                    const methodDoc = method.document;
                    return new vscode.Location(methodDoc.uri, new vscode.Position(method.line, method.character));
                }
            }
            // getlabel
            const label = yield parser_1.Parser.getLabelByName(document, word);
            if (label) {
                const tempDocument = label.document;
                return new vscode.Location(tempDocument.uri, new vscode.Position(label.line, label.character));
            }
            const script = (yield parser_1.Parser.buildScript(document, true));
            for (const method of script.methods) {
                if (position.line >= method.line && position.line <= method.endLine) {
                    for (const variable of method.variables) {
                        if (variable.name == word) {
                            return new vscode.Location(document.uri, new vscode.Position(variable.line, variable.character));
                        }
                    }
                    for (const param of method.params) {
                        if (param == word) {
                            // TODO cannot find param character
                            return new vscode.Location(document.uri, new vscode.Position(method.line, method.character + method.origin.indexOf(param)));
                        }
                    }
                }
            }
            for (const variable of script.variables) {
                if (variable.name == word) {
                    return new vscode.Location(document.uri, new vscode.Position(variable.line, variable.character));
                }
            }
            return null;
        });
    }
    tryGetFileLink(document, position, workFolder) {
        return __awaiter(this, void 0, void 0, function* () {
            const { text } = document.lineAt(position.line);
            const includeMatch = text.match(/(?<=#include).+?\.(ahk|ext)\b/i);
            if (includeMatch) {
                const parent = workFolder ? workFolder : document.uri.path.substr(0, document.uri.path.lastIndexOf("/"));
                const targetPath = vscode.Uri.file(includeMatch[0].trim()
                    .replace(/(%A_ScriptDir%|%A_WorkingDir%)/, parent)
                    .replace(/(%A_LineFile%)/, document.uri.path));
                if (fs_1.existsSync(targetPath.fsPath)) {
                    return new vscode.Location(targetPath, new vscode.Position(0, 0));
                }
                else if (workFolder) {
                    return this.tryGetFileLink(document, position, vscode.workspace.rootPath);
                }
                else {
                    return null;
                }
            }
        });
    }
}
exports.DefProvider = DefProvider;
//# sourceMappingURL=defProvider.js.map
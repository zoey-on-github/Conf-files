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
exports.CompletionProvider = void 0;
const vscode = require("vscode");
const parser_1 = require("../parser/parser");
const vscode_1 = require("vscode");
class CompletionProvider {
    constructor() {
        this.keywordList = [];
        this.keywordComplectionItems = [];
        this.initKeywordComplectionItem();
    }
    provideCompletionItems(document, position) {
        return __awaiter(this, void 0, void 0, function* () {
            const prePostion = position.character === 0 ? position : new vscode.Position(position.line, position.character - 1);
            const preChart = position.character === 0 ? null : document.getText(new vscode.Range(prePostion, position));
            if (preChart == ".") {
                return [];
            }
            const result = [];
            (yield parser_1.Parser.getAllMethod()).forEach((method) => {
                const completionItem = new vscode.CompletionItem(method.params.length == 0 ? method.name : method.full, vscode.CompletionItemKind.Method);
                if (method.params.length == 0) {
                    completionItem.insertText = method.name + "()";
                }
                else {
                    completionItem.insertText = new vscode_1.SnippetString(method.name + "($1)");
                }
                completionItem.detail = method.comment;
                result.push(completionItem);
                if (method.document == document && position.line >= method.line && position.line <= method.endLine) {
                    for (const param of method.params) {
                        result.push(new vscode.CompletionItem(param, vscode.CompletionItemKind.Variable));
                    }
                    for (const variable of method.variables) {
                        result.push(new vscode.CompletionItem(variable.name, vscode.CompletionItemKind.Variable));
                    }
                }
            });
            const script = (yield parser_1.Parser.buildScript(document, true));
            script.variables.forEach((variable) => {
                const completionItem = new vscode.CompletionItem(variable.name, vscode.CompletionItemKind.Variable);
                result.push(completionItem);
            });
            return this.keywordComplectionItems.concat(result);
        });
    }
    resolveCompletionItem(item) {
        return item;
    }
    initKeywordComplectionItem() {
        this.keywordList.forEach((keyword) => {
            const keywordComplectionItem = new vscode.CompletionItem(keyword + " ");
            keywordComplectionItem.kind = vscode.CompletionItemKind.Property;
            this.keywordComplectionItems.push(keywordComplectionItem);
        });
    }
}
exports.CompletionProvider = CompletionProvider;
//# sourceMappingURL=completionProvider.js.map
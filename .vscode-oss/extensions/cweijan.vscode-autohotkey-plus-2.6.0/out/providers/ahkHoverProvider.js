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
exports.AhkHoverProvider = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const vscode_1 = require("vscode");
const parser_1 = require("../parser/parser");
class AhkHoverProvider {
    constructor(context) {
        this.initSnippetCache(context);
    }
    provideHover(document, position, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const context = this.buildContext(document, position);
            const snippetHover = this.tryGetSnippetHover(context);
            if (snippetHover) {
                return snippetHover;
            }
            const method = yield parser_1.Parser.getMethodByName(document, context.word);
            if (method) {
                const markdonw = new vscode_1.MarkdownString("", true).appendCodeblock(method.full);
                if (method.comment) {
                    markdonw.appendText(method.comment);
                }
                return new vscode_1.Hover(markdonw);
            }
            return null;
        });
    }
    tryGetSnippetHover(context) {
        let snippetKey = context.word.toLowerCase();
        if (context.nextChart == "(") {
            snippetKey += "()";
        }
        const snippet = this.snippetCache.get(snippetKey);
        if (snippet) {
            const content = new vscode_1.MarkdownString(null, true)
                .appendCodeblock(snippet.body, 'ahk');
            if (snippet.description) {
                content.appendText(snippet.description);
            }
            return new vscode_1.Hover(content);
        }
    }
    buildContext(document, position) {
        const line = position.line;
        const wordRange = document.getWordRangeAtPosition(position);
        let word = document.getText(wordRange);
        if (wordRange.start.character > 0) {
            const preChart = document.getText(new vscode_1.Range(line, wordRange.start.character - 1, line, wordRange.start.character));
            if (preChart == "#") {
                word = "#" + word;
            }
        }
        const nextChart = document.getText(new vscode_1.Range(line, wordRange.end.character, line, wordRange.end.character + 1));
        return { word, nextChart };
    }
    initSnippetCache(context) {
        var _a;
        const ahk = JSON.parse(fs_1.readFileSync(path_1.join(context.extensionPath, "snippets", "ahk.json"), "UTF8"));
        this.snippetCache = new Map();
        // tslint:disable-next-line: forin
        for (const key in ahk) {
            const snip = ahk[key];
            if (typeof snip.body === 'string') {
                snip.body = (_a = snip.body) === null || _a === void 0 ? void 0 : _a.replace(/\d{1}:/g, "");
            }
            this.snippetCache.set(key.toLowerCase(), snip);
        }
    }
}
exports.AhkHoverProvider = AhkHoverProvider;
//# sourceMappingURL=ahkHoverProvider.js.map
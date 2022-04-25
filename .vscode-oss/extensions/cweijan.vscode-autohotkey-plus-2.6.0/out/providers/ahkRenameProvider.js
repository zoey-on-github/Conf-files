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
exports.AhkRenameProvider = void 0;
const vscode = require("vscode");
const parser_1 = require("../parser/parser");
class AhkRenameProvider {
    provideRenameEdits(document, position, newName, token) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const doc of vscode.workspace.textDocuments) {
                parser_1.Parser.buildScript(doc);
            }
            const word = document.getText(document.getWordRangeAtPosition(position));
            const refs = parser_1.Parser.getAllRefByName(word);
            const workEdit = new vscode.WorkspaceEdit();
            for (const ref of refs) {
                if (ref.document.uri.scheme != "file") {
                    continue;
                }
                let uriEdits = [];
                uriEdits.push(new vscode.TextEdit(new vscode.Range(new vscode.Position(ref.line, ref.character), new vscode.Position(ref.line, ref.character + word.length)), newName));
                console.debug(`url:${ref.document.uri},line:${ref.line},character:${ref.character}`);
                workEdit.set(ref.document.uri, uriEdits);
            }
            return workEdit;
        });
    }
    prepareRename(document, position, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const wordRange = document.getWordRangeAtPosition(position);
            const word = document.getText(wordRange);
            const method = yield parser_1.Parser.getMethodByName(document, word);
            if (method != null) {
                return wordRange;
            }
            throw new Error("You cannot rename this element.");
        });
    }
}
exports.AhkRenameProvider = AhkRenameProvider;
//# sourceMappingURL=ahkRenameProvider.js.map
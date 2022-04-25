"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefProvider = void 0;
const vscode = require("vscode");
const parser_1 = require("../parser/parser");
class RefProvider {
    provideReferences(document, position, context, token) {
        const word = document.getText(document.getWordRangeAtPosition(position));
        const vscodeRefs = [];
        const refs = parser_1.Parser.getAllRefByName(word);
        for (const ref of refs) {
            vscodeRefs.push(new vscode.Location(ref.document.uri, new vscode.Position(ref.line, ref.character)));
        }
        return vscodeRefs;
    }
}
exports.RefProvider = RefProvider;
//# sourceMappingURL=refProvider.js.map
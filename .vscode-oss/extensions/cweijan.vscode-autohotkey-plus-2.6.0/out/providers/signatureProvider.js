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
exports.SignatureProvider = void 0;
const vscode = require("vscode");
const parser_1 = require("../parser/parser");
class SignatureProvider {
    provideSignatureHelp(document, position, token, context) {
        return __awaiter(this, void 0, void 0, function* () {
            let methodPosition;
            const lineText = document.lineAt(position.line).text;
            let splitCount = 0;
            for (let index = position.character - 1; index > 0; index--) {
                const char = lineText.charAt(index);
                if (char == "(") {
                    methodPosition = new vscode.Position(position.line, index);
                    break;
                }
                if (char == ",") {
                    splitCount++;
                }
            }
            const word = document.getText(document.getWordRangeAtPosition(methodPosition));
            const method = yield parser_1.Parser.getMethodByName(document, word);
            if (method) {
                return {
                    activeSignature: 0,
                    signatures: [{
                            label: method.origin,
                            parameters: method.params.map(param => { return { label: param }; })
                        }],
                    activeParameter: splitCount,
                };
            }
            return null;
        });
    }
}
exports.SignatureProvider = SignatureProvider;
//# sourceMappingURL=signatureProvider.js.map
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
exports.SymBolProvider = void 0;
const vscode = require("vscode");
const parser_1 = require("../parser/parser");
class SymBolProvider {
    provideDocumentSymbols(document, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = [];
            const script = yield parser_1.Parser.buildScript(document, false);
            for (const method of script.methods) {
                result.push(new vscode.SymbolInformation(method.full, vscode.SymbolKind.Method, method.comment, new vscode.Location(method.document.uri, new vscode.Position(method.line, method.character))));
            }
            for (const label of script.labels) {
                result.push(new vscode.SymbolInformation(label.name, vscode.SymbolKind.Field, null, new vscode.Location(label.document.uri, new vscode.Position(label.line, label.character))));
            }
            for (const block of script.blocks) {
                result.push(new vscode.SymbolInformation(block.name, vscode.SymbolKind.Module, null, new vscode.Location(block.document.uri, new vscode.Position(block.line, block.character))));
            }
            for (const variable of script.variables) {
                result.push(new vscode.SymbolInformation(variable.name, vscode.SymbolKind.Variable, null, new vscode.Location(variable.document.uri, new vscode.Position(variable.line, variable.character))));
            }
            return result;
        });
    }
}
exports.SymBolProvider = SymBolProvider;
//# sourceMappingURL=SymbolProvider.js.map
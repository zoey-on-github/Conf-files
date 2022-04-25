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
exports.activate = void 0;
const vscode = require("vscode");
const parser_1 = require("./parser/parser");
const runnerService_1 = require("./service/runnerService");
const debugSession_1 = require("./debugger/debugSession");
const defProvider_1 = require("./providers/defProvider");
const templateService_1 = require("./service/templateService");
const formattingProvider_1 = require("./providers/formattingProvider");
const SymbolProvider_1 = require("./providers/SymbolProvider");
const fileManager_1 = require("./common/fileManager");
const ahkHoverProvider_1 = require("./providers/ahkHoverProvider");
const refProvider_1 = require("./providers/refProvider");
const global_1 = require("./common/global");
const ahkRenameProvider_1 = require("./providers/ahkRenameProvider");
const signatureProvider_1 = require("./providers/signatureProvider");
const completionProvider_1 = require("./providers/completionProvider");
const documentService_1 = require("./service/documentService");
function activate(context) {
    (() => __awaiter(this, void 0, void 0, function* () {
        global_1.Global.updateStatusBarItems("Indexing Autohotkey Workspace...");
        yield parser_1.Parser.buildByPath(vscode.workspace.rootPath);
        global_1.Global.updateStatusBarItems("Index Workspace Success!");
        global_1.Global.hide();
    }))();
    const language = { language: "ahk" };
    fileManager_1.FileManager.init(context);
    context.subscriptions.push(vscode.languages.registerHoverProvider(language, new ahkHoverProvider_1.AhkHoverProvider(context)), vscode.languages.registerDefinitionProvider(language, new defProvider_1.DefProvider()), vscode.languages.registerRenameProvider(language, new ahkRenameProvider_1.AhkRenameProvider()), vscode.languages.registerSignatureHelpProvider(language, new signatureProvider_1.SignatureProvider(), "(", ","), vscode.languages.registerDocumentSymbolProvider(language, new SymbolProvider_1.SymBolProvider()), vscode.languages.registerDocumentFormattingEditProvider(language, new formattingProvider_1.FormatProvider()), vscode.languages.registerReferenceProvider(language, new refProvider_1.RefProvider()), vscode.debug.registerDebugAdapterDescriptorFactory('ahk', new InlineDebugAdapterFactory()), templateService_1.TemplateService.createEditorListenr(), vscode.commands.registerCommand("run.ahk", () => runnerService_1.RunnerService.run()), vscode.commands.registerCommand("run.selection.ahk", () => runnerService_1.RunnerService.runSelection()), vscode.commands.registerCommand("document.open", () => documentService_1.DocumentService.open()), vscode.commands.registerCommand("debug.ahk", () => runnerService_1.RunnerService.startDebugger()), vscode.commands.registerCommand("compile.ahk", () => runnerService_1.RunnerService.compile()));
    if (global_1.Global.getConfig(global_1.ConfigKey.enableIntelliSense)) {
        context.subscriptions.push(vscode.languages.registerCompletionItemProvider(language, new completionProvider_1.CompletionProvider(), " ", "."));
    }
}
exports.activate = activate;
class InlineDebugAdapterFactory {
    createDebugAdapterDescriptor(_session) {
        return new vscode.DebugAdapterInlineImplementation(new debugSession_1.DebugSession());
    }
}
//# sourceMappingURL=extension.js.map
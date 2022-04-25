"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateService = void 0;
const vscode = require("vscode");
class TemplateService {
    static createEditorListenr() {
        return vscode.window.onDidChangeActiveTextEditor((e) => {
            if (e && e.document.languageId === "ahk" && e.document.getText() === "") {
                vscode.commands.executeCommand("editor.action.insertSnippet", { name: "AhkTemplate" });
            }
        });
    }
}
exports.TemplateService = TemplateService;
//# sourceMappingURL=templateService.js.map
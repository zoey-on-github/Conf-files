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
exports.RunnerService = void 0;
const path_1 = require("path");
const vscode = require("vscode");
const fileManager_1 = require("../common/fileManager");
const global_1 = require("../common/global");
const processWrapper_1 = require("../common/processWrapper");
class RunnerService {
    static runSelection() {
        return __awaiter(this, void 0, void 0, function* () {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage("Not active editor found!");
                return;
            }
            var selection = editor.selection;
            var text = editor.document.getText(selection);
            this.run(yield this.createTemplate(text));
        });
    }
    /**
     * start debuggin session
     */
    static startDebugger(script) {
        return __awaiter(this, void 0, void 0, function* () {
            const cwd = script ? vscode.Uri.file(script) : vscode.window.activeTextEditor.document.uri;
            script = script ? script : yield this.getPathByActive();
            const debugPlusExists = vscode.extensions.getExtension("zero-plusplus.vscode-autohotkey-debug") != undefined;
            vscode.debug.startDebugging(vscode.workspace.getWorkspaceFolder(cwd), {
                type: debugPlusExists ? "autohotkey" : "ahk",
                request: "launch",
                name: "Autohotkey Debugger",
                runtime: global_1.Global.getConfig(global_1.ConfigKey.executePath),
                program: script
            });
        });
    }
    /**
     * run script
     * @param path execute script path
     */
    static run(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const executePath = global_1.Global.getConfig(global_1.ConfigKey.executePath);
            this.checkAndSaveActive();
            if (!path) {
                path = yield this.getPathByActive();
            }
            processWrapper_1.Process.exec(`\"${executePath}\" \"${path}\"`, { cwd: `${path_1.resolve(path, '..')}` });
        });
    }
    /**
     * compile current script
     */
    static compile() {
        return __awaiter(this, void 0, void 0, function* () {
            const currentPath = vscode.window.activeTextEditor.document.uri.fsPath;
            if (!currentPath) {
                vscode.window.showErrorMessage("Unsupport compile template scripts.");
                return;
            }
            this.checkAndSaveActive();
            const pos = currentPath.lastIndexOf(".");
            const compilePath = currentPath.substr(0, pos < 0 ? currentPath.length : pos) + ".exe";
            if (yield processWrapper_1.Process.exec(`"${global_1.Global.getConfig(global_1.ConfigKey.compilePath)}" /in "${currentPath}" /out "${compilePath}"`, { cwd: `${path_1.resolve(currentPath, '..')}` })) {
                vscode.window.showInformationMessage("compile success!");
            }
        });
    }
    static getPathByActive() {
        return __awaiter(this, void 0, void 0, function* () {
            const document = vscode.window.activeTextEditor.document;
            if (document.isUntitled) {
                return yield this.createTemplate(document.getText());
            }
            return document.fileName;
        });
    }
    static createTemplate(content) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = `temp-${this.getNowDate()}.ahk`;
            return yield fileManager_1.FileManager.record(path, content, fileManager_1.FileModel.WRITE);
        });
    }
    static checkAndSaveActive() {
        if (!vscode.window.activeTextEditor.document.isUntitled) {
            vscode.commands.executeCommand('workbench.action.files.save');
        }
    }
    static getNowDate() {
        const date = new Date();
        let month = date.getMonth() + 1;
        let strDate = date.getDate();
        if (month <= 9) {
            month = "0" + month;
        }
        if (strDate <= 9) {
            strDate = "0" + strDate;
        }
        return date.getFullYear() + "-" + month + "-" + strDate + "-" + this.pad(date.getHours(), 2) + "-" + this.pad(date.getMinutes(), 2) + "-" + this.pad(date.getSeconds(), 2);
    }
    static pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }
}
exports.RunnerService = RunnerService;
//# sourceMappingURL=runnerService.js.map
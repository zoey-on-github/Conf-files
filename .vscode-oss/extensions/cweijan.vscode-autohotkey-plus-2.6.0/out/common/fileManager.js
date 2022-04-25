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
exports.FileModel = exports.FileManager = void 0;
const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
const parser_1 = require("../parser/parser");
class FileManager {
    static init(context) {
        this.storagePath = context.globalStoragePath;
        vscode.workspace.onDidSaveTextDocument(e => {
            parser_1.Parser.buildScript(e);
        });
    }
    static check(path) {
        if (!fs.existsSync(path))
            fs.mkdirSync(path);
    }
    static show(fileName) {
        if (!this.storagePath) {
            vscode.window.showErrorMessage("FileManager is not init!");
        }
        if (!fileName) {
            return;
        }
        const recordPath = `${this.storagePath}/${fileName}`;
        this.check(this.storagePath);
        this.check(path.resolve(recordPath, '..'));
        const openPath = vscode.Uri.file(recordPath);
        return new Promise((resolve) => {
            vscode.workspace.openTextDocument(openPath).then((doc) => __awaiter(this, void 0, void 0, function* () {
                resolve(yield vscode.window.showTextDocument(doc));
            }));
        });
    }
    /**
     *
     * @param return actually file name
     */
    static record(fileName, content, model) {
        if (!this.storagePath) {
            vscode.window.showErrorMessage("FileManager is not init!");
        }
        if (!fileName) {
            return;
        }
        return new Promise((resolve, reject) => {
            const recordPath = `${this.storagePath}/${fileName}`;
            this.check(this.storagePath);
            this.check(path.resolve(recordPath, '..'));
            if (model == FileModel.WRITE) {
                fs.writeFileSync(recordPath, `${content}`, { encoding: 'utf8' });
            }
            else {
                fs.appendFileSync(recordPath, `${content}`, { encoding: 'utf8' });
            }
            resolve(recordPath);
        });
    }
}
exports.FileManager = FileManager;
var FileModel;
(function (FileModel) {
    FileModel[FileModel["WRITE"] = 0] = "WRITE";
    FileModel[FileModel["APPEND"] = 1] = "APPEND";
})(FileModel = exports.FileModel || (exports.FileModel = {}));
//# sourceMappingURL=fileManager.js.map
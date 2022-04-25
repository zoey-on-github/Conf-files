"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigKey = exports.Global = void 0;
const vscode = require("vscode");
class Global {
    /**
     * get configuration from vscode setting.
     * @param key config key
     */
    static getConfig(key) {
        return vscode.workspace.getConfiguration(this.CONFIG_PREFIX).get(key);
    }
    static updateStatusBarItems(text) {
        if (!this.statusBarItem) {
            this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
        }
        this.statusBarItem.text = text;
        this.statusBarItem.show();
    }
    static hide() {
        this.statusBarItem.hide();
    }
}
exports.Global = Global;
Global.CONFIG_PREFIX = "vscode-ahk-plus";
var ConfigKey;
(function (ConfigKey) {
    ConfigKey["compilePath"] = "compilePath";
    ConfigKey["executePath"] = "executePath";
    ConfigKey["enableIntelliSense"] = "enableIntelliSense";
    ConfigKey["documentPath"] = "documentPath";
})(ConfigKey = exports.ConfigKey || (exports.ConfigKey = {}));
//# sourceMappingURL=global.js.map
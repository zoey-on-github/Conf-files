"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StackHandler = void 0;
const vscode_debugadapter_1 = require("vscode-debugadapter");
const path_1 = require("path");
class StackHandler {
    handle(args, response) {
        if (response) {
            const stackList = Array.isArray(response.stack) ? response.stack : Array.of(response.stack);
            return stackList.map((stack, index) => {
                return new vscode_debugadapter_1.StackFrame(index, stack.attr.where, new vscode_debugadapter_1.Source(path_1.basename(stack.attr.filename), stack.attr.filename), parseInt(stack.attr.lineno));
            });
        }
        else {
            return [];
        }
    }
}
exports.StackHandler = StackHandler;
//# sourceMappingURL=StackHandler.js.map
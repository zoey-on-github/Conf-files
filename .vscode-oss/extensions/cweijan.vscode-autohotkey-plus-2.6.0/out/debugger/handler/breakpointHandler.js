"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BreakPointHandler = void 0;
const path_1 = require("path");
const vscode_debugadapter_1 = require("vscode-debugadapter");
const fs_1 = require("fs");
class BreakPointHandler {
    constructor() {
        this._breakPoints = new Map();
    }
    /**
     * set breakpoint to the script actual.
     */
    loopPoints(callback) {
        for (const key of this._breakPoints.keys()) {
            for (const bp of this._breakPoints.get(key)) {
                callback(bp);
            }
        }
    }
    get(path) {
        return this._breakPoints.get(path);
    }
    buildBreakPoint(path, sourceBreakpoints, callback) {
        if (!fs_1.existsSync(path)) {
            return [];
        }
        const sourceLines = fs_1.readFileSync(path).toString().split('\n');
        const bps = sourceBreakpoints.map((sourceBreakpoint) => {
            const breakPoint = new vscode_debugadapter_1.Breakpoint(false, sourceBreakpoint.line, sourceBreakpoint.column, new vscode_debugadapter_1.Source(path_1.basename(path), path));
            const lineText = sourceLines[sourceBreakpoint.line];
            if (lineText && lineText.trim().charAt(0) != ';') {
                breakPoint.verified = true;
            }
            callback(breakPoint);
            return breakPoint;
        });
        this._breakPoints.set(path, bps);
        return bps;
    }
}
exports.BreakPointHandler = BreakPointHandler;
//# sourceMappingURL=breakpointHandler.js.map
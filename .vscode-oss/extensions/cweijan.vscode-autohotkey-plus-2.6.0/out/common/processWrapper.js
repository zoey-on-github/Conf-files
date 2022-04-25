"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Process = void 0;
const child_process = require("child_process");
const out_1 = require("./out");
class Process {
    static exec(command, opt = {}) {
        return new Promise((resolve, reject) => {
            child_process.exec(command, opt, (error) => {
                if (error) {
                    out_1.Out.log(error.message);
                    reject(error);
                    return;
                }
                resolve(true);
            });
        });
    }
}
exports.Process = Process;
//# sourceMappingURL=processWrapper.js.map
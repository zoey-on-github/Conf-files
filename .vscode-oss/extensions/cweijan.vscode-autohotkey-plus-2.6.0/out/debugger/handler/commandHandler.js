"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandHandler = void 0;
class CommandHandler {
    constructor(debugServer) {
        this.debugServer = debugServer;
        this.transId = 1;
        this.commandCallback = {};
    }
    /**
     * send command to the ahk debug proxy.
     * @param command
     */
    sendComand(command, data) {
        if (!this.debugServer) {
            return;
        }
        this.transId++;
        command += ` -i ${this.transId}`;
        if (typeof data === 'string') {
            command += ` -- ${Buffer.from(data).toString('base64')}`;
        }
        command += '\x00';
        this.debugServer.write(`${command}`);
        return new Promise((resolve) => {
            this.commandCallback["" + this.transId] = (response) => {
                resolve(response);
            };
        });
    }
    callback(transId, response) {
        const fun = this.commandCallback[transId];
        if (fun)
            fun(response);
        this.commandCallback[transId] = null;
    }
}
exports.CommandHandler = CommandHandler;
//# sourceMappingURL=commandHandler.js.map
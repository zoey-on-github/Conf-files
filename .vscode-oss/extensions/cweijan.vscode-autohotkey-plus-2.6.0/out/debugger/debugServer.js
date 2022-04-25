"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugServer = void 0;
const events_1 = require("events");
const Net = require("net");
const xml2js = require("xml2js");
const out_1 = require("../common/out");
/**
 * Exchange dbgp protocol with ahk debug proxy.
 */
class DebugServer extends events_1.EventEmitter {
    constructor(port) {
        super();
        this.port = port;
        this.header = `<?xml version="1.0" encoding="UTF-8"?>`;
        this.parser = new xml2js.Parser({
            attrkey: 'attr',
            charsAsChildren: false,
            charkey: 'content',
            explicitCharkey: true,
            explicitArray: false,
        });
    }
    start() {
        const END = 0;
        let tempData;
        this.proxyServer = new Net.Server().listen(this.port).on('connection', (socket) => {
            this.proxyConnection = socket;
            socket.on('data', (chunk) => {
                tempData = tempData ? Buffer.concat([tempData, chunk]) : chunk;
                if (tempData[tempData.length - 1] == END) {
                    this.process(tempData.toString());
                    tempData = null;
                }
            });
        }).on("error", (err) => {
            out_1.Out.log(err.message);
            throw err;
        });
        return this;
    }
    shutdown() {
        if (this.proxyConnection) {
            this.proxyConnection.end();
        }
        if (this.proxyServer) {
            this.proxyServer.close();
        }
    }
    write(data) {
        if (this.proxyConnection) {
            this.proxyConnection.write(data);
        }
    }
    process(data) {
        data = data.substr(data.indexOf('<?xml'));
        if (data.indexOf(this.header) == -1) {
            data = this.header + data;
        }
        for (const part of data.split(this.header)) {
            if (null == part || part.trim() == "") {
                continue;
            }
            const xmlString = this.header + part;
            this.parser.parseStringPromise(xmlString)
                .then((res) => {
                for (const key in res) {
                    if (res.hasOwnProperty(key)) {
                        this.emit(key, res[key]);
                    }
                }
            })
                .catch((err) => {
                out_1.Out.log(err);
            });
        }
    }
}
exports.DebugServer = DebugServer;
//# sourceMappingURL=debugServer.js.map
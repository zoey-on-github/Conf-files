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
exports.DebugDispather = void 0;
const events_1 = require("events");
const runnerService_1 = require("../service/runnerService");
const debugServer_1 = require("./debugServer");
const breakpointHandler_1 = require("./handler/breakpointHandler");
const commandHandler_1 = require("./handler/commandHandler");
const StackHandler_1 = require("./handler/StackHandler");
const variableHandler_1 = require("./handler/variableHandler");
const scope_1 = require("./struct/scope");
const getPort = require("get-port");
const child_process_1 = require("child_process");
const path_1 = require("path");
const fs_1 = require("fs");
const out_1 = require("../common/out");
const global_1 = require("../common/global");
/**
 * A Ahk runtime debugger.
 * refrence: https://xdebug.org/docs/dbgp
 */
class DebugDispather extends events_1.EventEmitter {
    constructor() {
        super();
    }
    /**
     * Start executing the given program.
     */
    start(args) {
        return __awaiter(this, void 0, void 0, function* () {
            let { runtime, dbgpSettings = {} } = args;
            const { max_children, max_data } = Object.assign({ max_children: 300, max_data: 131072 }, dbgpSettings);
            if (!runtime) {
                runtime = global_1.Global.getConfig(global_1.ConfigKey.executePath);
            }
            this.breakPointHandler = new breakpointHandler_1.BreakPointHandler();
            this.stackHandler = new StackHandler_1.StackHandler();
            this.variableHandler = new variableHandler_1.VariableHandler();
            this.startArgs = args;
            const port = yield getPort({ port: getPort.makeRange(9000, 9100) });
            this.debugServer = new debugServer_1.DebugServer(port);
            this.commandHandler = new commandHandler_1.CommandHandler(this.debugServer);
            this.debugServer.start()
                .on("init", () => {
                this.breakPointHandler.loopPoints((bp) => { this.setBreakPonit(bp); });
                this.sendComand(`feature_set -n max_children -v ${max_children}`);
                this.sendComand(`feature_set -n max_data -v ${max_data}`);
                this.sendComand(`feature_set -n max_depth -v 2`); // Get properties recursively. Therefore fixed at 2
                this.sendComand('stdout -c 1');
                this.sendComand('stderr -c 1');
                this.sendComand('run');
            })
                .on("stream", (stream) => {
                this.emit('output', Buffer.from(stream.content, 'base64').toString());
            })
                .on("response", (response) => {
                if (response.attr.command) {
                    this.commandHandler.callback(response.attr.transaction_id, response);
                    switch (response.attr.command) {
                        case 'run':
                        case 'step_into':
                        case 'step_over':
                        case 'step_out':
                            this.processRunResponse(response);
                            break;
                        case 'stop':
                            this.end();
                            break;
                    }
                }
            });
            if (!args.program) {
                args.program = yield runnerService_1.RunnerService.getPathByActive();
            }
            if (!fs_1.existsSync(runtime)) {
                out_1.Out.log(`Autohotkey Execute Bin Not Found : ${runtime}`);
                this.end();
                return;
            }
            const ahkProcess = child_process_1.spawn(runtime, ["/ErrorStdOut", `/debug=localhost:${port}`, args.program], { cwd: `${path_1.resolve(args.program, '..')}` });
            ahkProcess.stderr.on("data", err => {
                this.emit('output', err.toString("utf8"));
                this.end();
            });
        });
    }
    restart() {
        return __awaiter(this, void 0, void 0, function* () {
            this.sendComand('stop');
            this.end();
            runnerService_1.RunnerService.startDebugger(this.startArgs.program);
        });
    }
    /**
     * send command to the ahk debug proxy.
     * @param command
     */
    sendComand(command, data) {
        if (this.commandHandler) {
            return this.commandHandler.sendComand(command, data);
        }
        return null;
    }
    /**
     * receive stop request from vscode, send command to notice the script stop.
     */
    stop() {
        this.sendComand('stop');
        this.debugServer.shutdown();
    }
    /**
     * receive end message from script, send event to stop the debug session.
     */
    end() {
        this.emit('end');
        this.debugServer.shutdown();
    }
    scopes(frameId) {
        return this.variableHandler.scopes(frameId);
    }
    /**
     * List all variable or get refrence variable property detail.
     * @param scopeId 0(Local) and 1(Global)
     * @param args
     */
    listVariables(args) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (args.filter === 'named') {
                return [];
            }
            if (args.filter === 'indexed') {
                return this.variableHandler.getArrayValue(args.variablesReference, args.start, args.count);
            }
            const scope = this.variableHandler.getScopeByRef(args.variablesReference);
            const frameId = this.variableHandler.getFrameId();
            const propertyName = (_a = this.variableHandler.getVarByRef(args.variablesReference)) === null || _a === void 0 ? void 0 : _a.name;
            if (propertyName) {
                return this.getVariable(frameId, scope, propertyName);
            }
            const response = yield this.sendComand(`context_get -d ${frameId} -c ${scope}`);
            return this.variableHandler.parse(response, scope);
        });
    }
    getVariableByEval(variableName) {
        return __awaiter(this, void 0, void 0, function* () {
            const frameId = this.variableHandler.getFrameId();
            const variables = yield this.getVariable(frameId, scope_1.VarScope.LOCAL, variableName);
            if (variables.length == 0) {
                return null;
            }
            else if (variables.length == 1) {
                return variables[0].value;
            }
            else {
                const ahkVar = this.variableHandler.getVarByName(variableName);
                return JSON.stringify(ahkVar.value);
            }
        });
    }
    getVariable(frameId, scope, variableName) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.sendComand(`property_get -d ${frameId} -c ${scope} -n ${variableName}`);
            return this.variableHandler.parsePropertyget(response, scope);
        });
    }
    setVariable(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.variableHandler.obtainValue(args.value).then(({ type, value, isVariable }) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const frameId = this.variableHandler.getFrameId();
                const scope = this.variableHandler.getScopeByRef(args.variablesReference);
                if (isVariable) {
                    const ahkVar = (yield this.getVariable(frameId, scope, value))[0];
                    if (!ahkVar) {
                        throw new Error(`variable ${args.value} not found!`);
                    }
                    value = ahkVar.value;
                    if (value.match(/^"|"$/g)) {
                        type = "string";
                        value = value.replace(/^"|"$/g, "");
                    }
                }
                const parentFullName = (_a = this.variableHandler.getVarByRef(args.variablesReference)) === null || _a === void 0 ? void 0 : _a.name;
                let fullname = args.name;
                if (parentFullName) {
                    const isIndex = fullname.includes('[') && fullname.includes(']');
                    fullname = isIndex === true ? `${parentFullName}${fullname}` : `${parentFullName}.${fullname}`;
                }
                const response = yield this.sendComand(`property_set -d ${frameId} -c ${scope} -n ${fullname} -t ${type}`, value);
                const success = !!parseInt(response.attr.success);
                if (success === false) {
                    throw new Error(`"${fullname}" cannot be written. Probably read-only.`);
                }
                const displayValue = type === 'string' ? `"${value}"` : value;
                const PRIMITIVE = 0;
                return {
                    name: args.name,
                    value: displayValue,
                    type, variablesReference: PRIMITIVE,
                };
            }));
        });
    }
    /**
     * send get stack command and return stack result promise
     * @param startFrame stack frame limit start
     * @param endFrame  stack frame limit end
     */
    stack(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.sendComand(`stack_get`);
            return this.stackHandler.handle(args, response);
        });
    }
    setBreakPonit(bp) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.debugServer && bp.verified) {
                const res = yield this.sendComand(`breakpoint_set -t line -f ${bp.source.path} -n ${bp.line}`);
                bp.id = res.attr.id;
            }
        });
    }
    buildBreakPoint(path, sourceBreakpoints) {
        this.clearBreakpoints(path);
        return this.breakPointHandler.buildBreakPoint(path, sourceBreakpoints, (bp) => { this.setBreakPonit(bp); });
    }
    /**
     * Clear all breakpoints for file.
     * @param path file path
     */
    clearBreakpoints(path) {
        let bps;
        if (this.debugServer && (bps = this.breakPointHandler.get(path))) {
            for (const bp of bps) {
                this.sendComand(`breakpoint_remove -d ${bp.id}`);
            }
        }
    }
    processRunResponse(response) {
        switch (response.attr.status) {
            case 'break':
                this.emit('break', response.attr.command);
                break;
            case 'stopping':
            case 'stopped':
                this.end();
                break;
        }
    }
}
exports.DebugDispather = DebugDispather;
//# sourceMappingURL=debugDispather.js.map
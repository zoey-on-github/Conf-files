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
exports.DebugSession = void 0;
const vscode_1 = require("vscode");
const vscode_debugadapter_1 = require("vscode-debugadapter");
const debugDispather_1 = require("./debugDispather");
const command_1 = require("./struct/command");
const scope_1 = require("./struct/scope");
/**
 * debug session for vscode.
 */
class DebugSession extends vscode_debugadapter_1.LoggingDebugSession {
    constructor() {
        super("ahk-debug.txt");
        // this debugger uses zero-based lines and columns
        this.setDebuggerLinesStartAt1(false);
        this.setDebuggerColumnsStartAt1(false);
        this.dispather = new debugDispather_1.DebugDispather();
        this.dispather.on('break', (reason) => {
            this.sendEvent(new vscode_debugadapter_1.StoppedEvent(reason, DebugSession.THREAD_ID));
        }).on('breakpointValidated', (bp) => {
            this.sendEvent(new vscode_debugadapter_1.BreakpointEvent('changed', { verified: bp.verified, id: bp.id }));
        }).on('output', (text) => {
            this.sendEvent(new vscode_debugadapter_1.OutputEvent(`${text}\n`));
            vscode_1.commands.executeCommand('workbench.debug.action.focusRepl');
        }).on('end', () => {
            this.sendEvent(new vscode_debugadapter_1.TerminatedEvent());
        });
    }
    initializeRequest(response, args) {
        response.body = Object.assign(Object.assign({}, response.body), { completionTriggerCharacters: [".", "["], supportsConfigurationDoneRequest: false, supportsEvaluateForHovers: true, supportsStepBack: false, supportsDataBreakpoints: false, supportsCompletionsRequest: true, supportsCancelRequest: true, supportsRestartRequest: true, supportsBreakpointLocationsRequest: false, supportsSetVariable: true });
        this.sendResponse(response);
        this.sendEvent(new vscode_debugadapter_1.InitializedEvent());
    }
    restartRequest(response, args, request) {
        this.dispather.restart();
        this.sendResponse(response);
    }
    launchRequest(response, args) {
        return __awaiter(this, void 0, void 0, function* () {
            this.dispather.start(args);
            this.sendResponse(response);
        });
    }
    disconnectRequest(response, args, request) {
        this.dispather.stop();
        this.sendResponse(response);
    }
    setBreakPointsRequest(response, args) {
        return __awaiter(this, void 0, void 0, function* () {
            response.body = { breakpoints: this.dispather.buildBreakPoint(args.source.path, args.breakpoints), };
            this.sendResponse(response);
        });
    }
    stackTraceRequest(response, args) {
        return __awaiter(this, void 0, void 0, function* () {
            response.body = { stackFrames: yield this.dispather.stack(args) };
            this.sendResponse(response);
        });
    }
    scopesRequest(response, args) {
        response.body = { scopes: this.dispather.scopes(args.frameId) };
        this.sendResponse(response);
    }
    variablesRequest(response, args, request) {
        return __awaiter(this, void 0, void 0, function* () {
            response.body = { variables: yield this.dispather.listVariables(args) };
            this.sendResponse(response);
        });
    }
    setVariableRequest(response, args, request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                response.body = yield this.dispather.setVariable(args);
                this.sendResponse(response);
            }
            catch (error) {
                this.sendErrorResponse(response, {
                    id: args.variablesReference,
                    format: error.message,
                });
            }
        });
    }
    pauseRequest(response, args, request) {
        this.dispather.sendComand(command_1.Continue.BREAK);
        this.sendResponse(response);
    }
    continueRequest(response, args) {
        this.dispather.sendComand(command_1.Continue.RUN);
        this.sendResponse(response);
    }
    nextRequest(response, args) {
        this.dispather.sendComand(command_1.Continue.STEP_OVER);
        this.sendResponse(response);
    }
    stepInRequest(response, args, request) {
        this.dispather.sendComand(command_1.Continue.STEP_INTO);
        this.sendResponse(response);
    }
    stepOutRequest(response, args, request) {
        this.dispather.sendComand(command_1.Continue.STEP_OUT);
        this.sendResponse(response);
    }
    threadsRequest(response) {
        response.body = { threads: [new vscode_debugadapter_1.Thread(DebugSession.THREAD_ID, "main thread")] };
        this.sendResponse(response);
    }
    completionsRequest(response, args) {
        return __awaiter(this, void 0, void 0, function* () {
            response.body = {
                targets: [...(yield this.dispather.listVariables({ variablesReference: scope_1.VscodeScope.LOCAL })),
                    ...(yield this.dispather.listVariables({ variablesReference: scope_1.VscodeScope.GLOBAL }))]
                    .map((variable) => {
                    return {
                        type: "variable",
                        label: variable.name,
                        sortText: variable.name
                    };
                })
            };
            this.sendResponse(response);
        });
    }
    evaluateRequest(response, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const exp = args.expression.split("=");
            let reply;
            if (exp.length == 1) {
                reply = yield this.dispather.getVariableByEval(args.expression);
            }
            else {
                this.dispather.setVariable({ name: exp[0], value: exp[1], variablesReference: scope_1.VscodeScope.LOCAL });
                reply = `execute: ${args.expression}`;
            }
            response.body = {
                result: reply ? reply : `null`,
                variablesReference: 0
            };
            this.sendResponse(response);
        });
    }
}
exports.DebugSession = DebugSession;
DebugSession.THREAD_ID = 1;
//# sourceMappingURL=debugSession.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VscodeScope = exports.VarScope = void 0;
var VarScope;
(function (VarScope) {
    VarScope[VarScope["LOCAL"] = 0] = "LOCAL";
    VarScope[VarScope["GLOBAL"] = 1] = "GLOBAL";
})(VarScope = exports.VarScope || (exports.VarScope = {}));
var VscodeScope;
(function (VscodeScope) {
    VscodeScope[VscodeScope["LOCAL"] = 1000] = "LOCAL";
    VscodeScope[VscodeScope["GLOBAL"] = 1001] = "GLOBAL";
})(VscodeScope = exports.VscodeScope || (exports.VscodeScope = {}));
//# sourceMappingURL=scope.js.map
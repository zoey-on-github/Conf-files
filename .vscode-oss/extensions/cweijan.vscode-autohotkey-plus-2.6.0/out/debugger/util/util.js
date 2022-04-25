"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Util = void 0;
class Util {
    static toArray(obj) {
        if (!obj)
            return [];
        return Array.isArray(obj) ? obj : [obj];
    }
    /**
     * base64 to string
     */
    static atob(base64) {
        if (!base64)
            return null;
        return Buffer.from(base64, 'base64').toString();
    }
    /**
     * string to base64
     */
    static btoa(data) {
        if (!data)
            return null;
        return Buffer.from(data).toString('base64');
    }
}
exports.Util = Util;
//# sourceMappingURL=util.js.map
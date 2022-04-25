"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeUtil = void 0;
class CodeUtil {
    /**
     * trim unfoucs code.
     * @param origin any string
     */
    static purity(origin) {
        if (!origin)
            return "";
        // TODO: untest 
        return origin.replace(/;.+/, "")
            .replace(/".*?"/g, "")
            .replace(/\{.*?\}/g, "")
            .replace(/ +/g, " ")
            .replace(/\bgui\b.*/ig, "")
            .replace(/\b(msgbox)\b.+?%/ig, "$1");
    }
    static join(array, items) {
        if (array == undefined || items == undefined) {
            return;
        }
        if (Array.isArray(items)) {
            for (const item of items) {
                array.push(item);
            }
        }
        else {
            array.push(items);
        }
    }
    static matchAll(regex, text) {
        if (!regex.global) {
            throw new Error("Only support global regex!");
        }
        let regs = [];
        let temp;
        while ((temp = regex.exec(text)) != null) {
            regs.push(temp);
        }
        return regs;
    }
}
exports.CodeUtil = CodeUtil;
//# sourceMappingURL=codeUtil.js.map
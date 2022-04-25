"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentService = void 0;
const global_1 = require("../common/global");
const processWrapper_1 = require("../common/processWrapper");
class DocumentService {
    static open() {
        const documentPath = global_1.Global.getConfig(global_1.ConfigKey.documentPath);
        processWrapper_1.Process.exec(`C:/Windows/hh.exe ${documentPath}`);
    }
}
exports.DocumentService = DocumentService;
//# sourceMappingURL=documentService.js.map
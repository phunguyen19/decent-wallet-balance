"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dcorejs_sdk_1 = require("dcorejs-sdk");
exports.getAccountByIds = (api, ids) => __awaiter(this, void 0, void 0, function* () {
    const acccounts = yield api.accountApi
        .getAll(ids.map(val => dcorejs_sdk_1.ChainObject.parse(val)))
        .toPromise();
    return yield Promise.all(acccounts.map((account, index) => __awaiter(this, void 0, void 0, function* () {
        return ({
            id: ids[index],
            registrar: account
                ? yield api.accountApi.get(account.registrar).toPromise()
                : null,
            data: account ? account.name : null,
        });
    })));
});
//# sourceMappingURL=getAccountByIds.js.map
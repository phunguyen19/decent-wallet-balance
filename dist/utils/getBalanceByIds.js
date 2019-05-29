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
const getAccountByIds_1 = require("./getAccountByIds");
exports.getBalanceByIds = (api, ids, assetSymbol) => __awaiter(this, void 0, void 0, function* () {
    const accounts = yield getAccountByIds_1.getAccountByIds(api, ids);
    const getBalancePromises = accounts.map(account => account.data !== null
        ? api.balanceApi.getWithAsset(account.id, assetSymbol).toPromise()
        : Promise.resolve(null));
    const results = yield Promise.all(getBalancePromises);
    return results.map((asset, index) => ({
        id: accounts[index].id,
        name: accounts[index].data,
        registrar: accounts[index].registrar
            ? accounts[index].registrar.name
            : null,
        balance: {
            amount: asset !== null
                ? asset[1].amount.toNumber() / Math.pow(10, asset[0].precision)
                : null,
            precision: asset !== null ? asset[0].precision : null,
        },
    }));
});
//# sourceMappingURL=getBalanceByIds.js.map
#!/usr/bin/env node
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
require("reflect-metadata");
const columnify = require("columnify");
const program = require("commander");
const dcorejs_sdk_1 = require("dcorejs-sdk");
const decimal_js_1 = require("decimal.js");
const fs = require("fs");
const path_1 = require("path");
const WebSocket = require("ws");
const getBalanceByIds_1 = require("./utils/getBalanceByIds");
const logger_1 = require("./utils/logger");
program
    .option('--output <path>', '(required) Output csv file name. E.g result.csv')
    .option('--asset [symbol]', '(required) Asset symbol to get the balance. E.g: ALX')
    .option('--limit-output [number]', '(optional) Limit the number account to output. E.g: 20', -1)
    .option('--order [order]', '(optional) DESC | ASC', 'DESC')
    .option('--concurrent [number]', '(optional) Number of max concurrent requests to blockchain. E.g: 500', 1000)
    .option('--websocket [uri]', '(optional) Websocket uri to blockchain.', 'wss://socket.decentgo.com:8090')
    .version('0.1.2', '-v, --version')
    .parse(process.argv);
let isError = false;
if (!program.output) {
    logger_1.logger.error('--output is required');
    isError = true;
}
if (!program.output) {
    logger_1.logger.error('--asset is required');
    isError = true;
}
if (isError) {
    program.help();
}
const config = {
    assetSymbol: String(program.asset).toUpperCase(),
    order: program.order,
    limitOutput: +program.limitOutput,
    blockchainSocketUrl: program.websocket,
    csvOutputFile: path_1.resolve(program.output),
    concurrent: +program.concurrent,
};
const niceCliNotice = columnify(config, {
    columns: ['Config', 'Value'],
});
logger_1.logger.info(`Starting with config: \n\n${niceCliNotice}\n`);
const api = dcorejs_sdk_1.DCoreSdk.createForWebSocket(() => new WebSocket(config.blockchainSocketUrl));
const loopGetAccounts = () => __awaiter(this, void 0, void 0, function* () {
    const totalAccount = (yield api.accountApi.countAll().toPromise()).toNumber();
    logger_1.logger.info(`Start analyzing ${totalAccount} accounts ...`);
    let totalList = [];
    let ids;
    let i;
    while (totalList.length < totalAccount) {
        ids = [];
        for (i = totalList.length; i < config.concurrent + totalList.length; ++i) {
            ids.push(`1.2.${i}`);
        }
        const accounts = yield getBalanceByIds_1.getBalanceByIds(api, ids, config.assetSymbol);
        totalList = totalList.concat(accounts.filter(account => account.name !== null && account.balance !== null));
        logger_1.logger.info(`Analyzed ${totalList.length} accounts`);
    }
    if (!fs.existsSync(path_1.dirname(config.csvOutputFile))) {
        fs.mkdirSync(path_1.dirname(config.csvOutputFile));
    }
    fs.writeFileSync(config.csvOutputFile, 'id,name,registrar,balance,asset');
    totalList
        .sort((prevEl, nextEl) => config.order === 'DESC'
        ? nextEl.balance.amount - prevEl.balance.amount
        : prevEl.balance.amount - nextEl.balance.amount)
        .some((account, index) => {
        if (config.limitOutput > 0 && index + 1 > config.limitOutput) {
            return true;
        }
        const balance = new decimal_js_1.default(account.balance.amount).toFixed(account.balance.precision);
        const row = [
            account.id,
            account.name,
            account.registrar,
            balance,
            config.assetSymbol,
        ].join(',');
        fs.appendFileSync(config.csvOutputFile, `\n${row}`);
    });
    logger_1.logger.info(`Done. Output file: ${config.csvOutputFile}`);
    process.exit(0);
});
loopGetAccounts();
//# sourceMappingURL=index.js.map
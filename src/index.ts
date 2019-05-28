#!/usr/bin/env node

import 'reflect-metadata';

import * as columnify from 'columnify';
import * as program from 'commander';
import { DCoreSdk } from 'dcorejs-sdk';
import Decimal from 'decimal.js';
import * as fs from 'fs';
import { dirname, resolve } from 'path';
import * as WebSocket from 'ws';

import { AccountInfo, getBalanceByIds } from './utils/getBalanceByIds';
import { logger } from './utils/logger';

program
  .version('0.1.0', '-v, --version')
  .option('-o, --output <output>', 'Output csv file name')
  .option(
    '-c, --concurrent [concurrent]',
    'Number of max concurrent requests to blockchain',
    1000,
  )
  .option('-a, --asset [asset]', 'Asset symbol to get the balance', 'ALX')
  .option(
    '-w, --websocket [websocket]',
    'Websocket uri to blockchain. Default: wss://socket.decentgo.com:8090',
    'wss://socket.decentgo.com:8090',
  )
  .parse(process.argv);

if (!program.output) {
  logger.error('No output file provided. Please use --help to see how to use.');
  process.exit(1);
}

const config = {
  assetSymbol: String(program.asset).toUpperCase(),
  blockchainSocketUrl: program.websocket,
  csvOutputFile: resolve(program.output),
  concurrent: +program.concurrent,
};

const niceCliNotice = columnify(config, {
  columns: ['Config', 'Value'],
});
logger.info(`Starting with config: \n\n${niceCliNotice}\n`);

const api = DCoreSdk.createForWebSocket(
  () => new WebSocket(config.blockchainSocketUrl),
);

const loopGetAccounts = async () => {
  const totalAccount = (await api.accountApi.countAll().toPromise()).toNumber();

  logger.info(`Total accounts ${totalAccount}`);

  let totalList: AccountInfo[] = [];
  let ids: string[];
  let i: number;
  while (totalList.length < totalAccount) {
    ids = [];
    for (i = totalList.length; i < config.concurrent + totalList.length; ++i) {
      ids.push(`1.2.${i}`);
    }

    const accounts = await getBalanceByIds(api, ids, config.assetSymbol);

    totalList = totalList.concat(
      accounts.filter(account => account.balance !== null),
    );

    logger.info(`Got ${totalList.length} accounts`);
  }

  if (!fs.existsSync(dirname(config.csvOutputFile))) {
    fs.mkdirSync(dirname(config.csvOutputFile));
  }

  fs.writeFileSync(config.csvOutputFile, 'id,name,registrar,balance,asset');

  totalList
    .sort((prevEl, nextEl) => nextEl.balance - prevEl.balance)
    .map((account, index) => {
      const balance = new Decimal(account.balance).toFixed(8);
      const row = [
        account.id,
        account.name,
        account.registrar,
        balance,
        config.assetSymbol,
      ].join(',');
      fs.appendFileSync(config.csvOutputFile, `\n${row}`);
    });

  process.exit(0);
};

loopGetAccounts();

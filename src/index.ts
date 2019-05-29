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
  .option('--output <path>', '(required) Output csv file name. E.g result.csv')
  .option(
    '--asset [symbol]',
    '(required) Asset symbol to get the balance. E.g: ALX',
  )
  .option(
    '--limit-output [number]',
    '(optional) Limit the number account to output. E.g: 20',
    -1,
  )
  .option('--order [order]', '(optional) DESC | ASC', 'DESC')
  .option(
    '--concurrent [number]',
    '(optional) Number of max concurrent requests to blockchain. E.g: 500',
    1000,
  )
  .option(
    '--websocket [uri]',
    '(optional) Websocket uri to blockchain. Default: wss://socket.decentgo.com:8090',
    'wss://socket.decentgo.com:8090',
  )
  .version('0.1.0', '-v, --version')
  .parse(process.argv);

let isError = false;

if (!program.output) {
  logger.error('--output is required');
  isError = true;
}

if (!program.output) {
  logger.error('--asset is required');
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

  logger.info(`Start analyzing ${totalAccount} accounts ...`);

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
      accounts.filter(
        account => account.name !== null && account.balance !== null,
      ),
    );

    logger.info(`Analyzed ${totalList.length} accounts`);
  }

  if (!fs.existsSync(dirname(config.csvOutputFile))) {
    fs.mkdirSync(dirname(config.csvOutputFile));
  }

  fs.writeFileSync(config.csvOutputFile, 'id,name,registrar,balance,asset');

  totalList
    .sort((prevEl, nextEl) =>
      config.order === 'DESC'
        ? nextEl.balance.amount - prevEl.balance.amount
        : prevEl.balance.amount - nextEl.balance.amount,
    )
    .some((account, index) => {
      if (config.limitOutput > 0 && index + 1 > config.limitOutput) {
        return true;
      }

      const balance = new Decimal(account.balance.amount).toFixed(
        account.balance.precision,
      );

      const row = [
        account.id,
        account.name,
        account.registrar,
        balance,
        config.assetSymbol,
      ].join(',');

      fs.appendFileSync(config.csvOutputFile, `\n${row}`);
    });

  logger.info(`Done. Output file: ${config.csvOutputFile}`);

  process.exit(0);
};

loopGetAccounts();

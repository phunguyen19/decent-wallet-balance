import 'reflect-metadata';

import { DCoreSdk } from 'dcorejs-sdk';
import Decimal from 'decimal.js';

import * as fs from 'fs';
import { dirname } from 'path';
import * as WebSocket from 'ws';

import { config } from './config/config';
import {
  CustomAccountInfo,
  getBalanceByAccountIds,
} from './utils/getBalanceByAccountIds';
import { logger } from './utils/logger';

const api = DCoreSdk.createForWebSocket(
  () => new WebSocket(config.blockchainSocketUrl),
);

const loopGetAccounts = async () => {
  const totalAccount = (await api.accountApi.countAll().toPromise()).toNumber();

  logger.info(`Total accounts ${totalAccount}`);

  let totalList: CustomAccountInfo[] = [];
  let ids: string[];
  let i: number;
  while (totalList.length < totalAccount) {
    ids = [];
    for (i = totalList.length; i < config.concurrent + totalList.length; ++i) {
      ids.push(`1.2.${i}`);
    }

    const accounts = await getBalanceByAccountIds(api, ids, config.assetSymbol);

    totalList = totalList.concat(
      accounts.filter(account => account.balance !== null),
    );

    logger.info(`Finish get ${totalList.length}`);
  }

  if (!fs.existsSync(dirname(config.csvOutputFile))) {
    fs.mkdirSync(dirname(config.csvOutputFile));
  }

  fs.writeFileSync(config.csvOutputFile, 'id,name,registrar,balance');

  totalList
    .sort((prevEl, nextEl) => nextEl.balance - prevEl.balance)
    .map((account, index) => {
      const balance = new Decimal(account.balance).toFixed(8);
      fs.appendFileSync(
        config.csvOutputFile,
        `\n${account.id},${account.name},${account.registrar},${balance}`,
      );
    });

  process.exit(0);
};

loopGetAccounts();

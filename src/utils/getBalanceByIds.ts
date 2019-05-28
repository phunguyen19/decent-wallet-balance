import { getAccountByIds } from './getAccountByIds';
import { DCoreApi } from 'dcorejs-sdk';

export interface AccountInfo {
  id: string;
  name: string;
  registrar: string;
  balance: {
    amount: number;
    precision: number;
  };
}

export const getBalanceByIds = async (
  api: DCoreApi,
  ids: string[],
  assetSymbol: string,
): Promise<AccountInfo[]> => {
  const accounts = await getAccountByIds(api, ids);

  const getBalancePromises = accounts.map(account =>
    account.data !== null
      ? api.balanceApi.getWithAsset(account.id, assetSymbol).toPromise()
      : Promise.resolve(null),
  );

  const results = await Promise.all(getBalancePromises);

  return results.map((asset, index) => ({
    id: accounts[index].id,
    name: accounts[index].data,
    registrar: accounts[index].registrar
      ? accounts[index].registrar.name
      : null,
    balance: {
      amount:
        asset !== null
          ? asset[1].amount.toNumber() / 10 ** asset[0].precision
          : null,
      precision: asset !== null ? asset[0].precision : null,
    },
  }));
};

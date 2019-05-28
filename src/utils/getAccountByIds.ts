import { ChainObject, DCoreApi } from 'dcorejs-sdk';

export const getAccountByIds = async (api: DCoreApi, ids: string[]) => {
  const acccounts = await api.accountApi
    .getAll(ids.map(val => ChainObject.parse(val)))
    .toPromise();

  return await Promise.all(
    acccounts.map(async (account, index) => ({
      id: ids[index],
      registrar: account
        ? await api.accountApi.get(account.registrar).toPromise()
        : null,
      data: account ? account.name : null,
    })),
  );
};

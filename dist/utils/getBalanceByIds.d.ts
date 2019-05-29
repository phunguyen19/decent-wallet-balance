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
export declare const getBalanceByIds: (api: DCoreApi, ids: string[], assetSymbol: string) => Promise<AccountInfo[]>;

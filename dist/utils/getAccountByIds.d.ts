import { DCoreApi } from 'dcorejs-sdk';
export declare const getAccountByIds: (api: DCoreApi, ids: string[]) => Promise<{
    id: string;
    registrar: import("dcorejs-sdk").Account;
    data: string;
}[]>;

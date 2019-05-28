import { join } from 'path';

export const config = {
  assetSymbol: 'ALX',
  blockchainSocketUrl: 'wss://socket.decentgo.com:8090',
  csvOutputFile: join(
    __dirname,
    '..',
    'results/result-' + +new Date() + '.csv',
  ),
  concurrent: 1000,
};

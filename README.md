# Decent Wallet Balance

Simple command line program for getting the list of wallet balance filter by an asset and sort by balance descending.

## Installation

### From npm

```
npm install decent-wallet-balance -g
```

### Build from source

```
npm install
npm run build
npm link
```

## Usage

```
decent-wallet-balance --output result.csv --asset ALX
```

Full options and help `decent-wallet-balance --help`

```
Usage: src [options]

Options:
  --output <path>          (required) Output csv file name. E.g result.csv
  --asset [symbol]         (required) Asset symbol to get the balance. E.g: ALX
  --limit-output [number]  (optional) Top list of accounts. E.g: 20 (default: -1)
  --order [order]          (optional) DESC | ASC (default: "DESC")
  --concurrent [number]    (optional) Number of max concurrent requests to blockchain. E.g: 500 (default: 1000)
  --websocket [uri]        (optional) Websocket uri to blockchain. Default: wss://socket.decentgo.com:8090 (default: "wss://socket.decentgo.com:8090")
  -v, --version            output the version number
  -h, --help               output usage information
```

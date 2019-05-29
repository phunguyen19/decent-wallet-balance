# Decent Wallet Balance

Simple command line program for getting the list of wallet balance filter by an asset and sort by balance descending.

## Installation

### From npm

```
npm install -g decent-wallet-balance
```

### From git

```
npm install -g https://github.com/phunguyen19/decent-wallet-balance.git
```

### Build from source

```
git clone https://github.com/phunguyen19/decent-wallet-balance.git
cd decent-wallet-balance
npm install
npm run build
npm link
```

## Usage

```
decent-wallet-balance --output result.csv --asset ALX
```

Full options from `decent-wallet-balance --help`

```
Usage: decent-wallet-balance [options]

Options:
  --output <path>          (required) Output csv file name. E.g result.csv
  --asset [symbol]         (required) Asset symbol to get the balance. E.g: ALX
  --limit-output [number]  (optional) Limit the number account to output. E.g: 20 (default: -1)
  --order [order]          (optional) DESC | ASC (default: "DESC")
  --concurrent [number]    (optional) Number of max concurrent requests to blockchain. E.g: 500 (default: 1000)
  --websocket [uri]        (optional) Websocket uri to blockchain. (default: "wss://socket.decentgo.com:8090")
  -v, --version            output the version number
  -h, --help               output usage information
```

# BlockPaperScissors
Decentralized App + smart contracts implementing the game Rock Paper Scissors on ethereum.
A running instance of this dapp should be reachable at [block-paper-scissors.com](https://block-paper-scissors.com).

# Disclaimer
Both dapp and contracts are a work in progress, feel free to open issues if you find areas for improvement.
The contracts have not been audited and were started as a learning project to improve / develop web3 development skills.
Use at your own risk!
The dapp has only been tested with the [Metamask](https://metamask.io) smart wallet, so it is recommended to use metamask when interacting
with the dapp.


# Local Development

## Requirments
- NPM (7.5.3)
- Truffle (5.3.6)

## Dapp

### Run
1. Change directory in to `vapp` directory
2. Install dependencies: `npm install`
3. Start development version of the dapp on `localhost:8080` : `npm run serve`


## Contracts
### Setup
1. Change directory to top level directory
2. Install dependencies: `npm install`

## Test Contracts
1. Start a development ethereum instance listening on port `9545`: for example using `truffle develop`
2. Run tests: `npm run test`

## Compile Deploy Contracts
1. Start a development ethereum instance listening on port `9545`: for example using `truffle develop`
2. Recompile / deploy contracts on loacal chain: `truffle migrate --rest`




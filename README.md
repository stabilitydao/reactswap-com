# ReactSwap

Repo contains [reactswap.com](https://reactswap.com) dApp source code.

[StabilityDAO](https://stabilitydao.org) Unit.


## Roadmap

### Networks
* [live] Polygon
* [proposed] BSC


### MVP-1: Swap at the best price

Decentralized swap at the best price protocol. The best route and rate is calculated from the most sources of liquidity in a blockchain using the best liquidity aggregators. Transactions are executed through the Stability [MetaRouter](https://github.com/stabilitydao/core/blob/develop/contracts/swap/MetaRouter.sol).

#### Aggregator integrations

* **1inch** [api docs](https://docs.1inch.io/docs/aggregation-protocol/introduction)
* **0x** [api docs](https://docs.0x.org/0x-api-swap/introduction)
* **OpenOcean** [api docs](https://docs.openocean.finance/api/openocean-dex-api-3.0)

Status: [**live**](https://reactswap.com)


### MVP-2: Crypto trading

Decentralized crypto trading and analytics

#### Features
* :heavy_check_mark: Price charts
* Account
* Analytics
* Trading gauges

#### DeFi data providers
* **DexScreener** [api docs](https://docs.dexscreener.com/)

Status: [**v0 live**](https://reactswap.com)


### MVP-3: Cross-chain swap

Cross-chain swap service.

#### Proposed integrations
* Connext [api docs](https://docs.connext.network)

Status: waiting for second network support


### MVP-4: Limit orders

Status: exploring orderbook protocols


### MVP-5: AMM

Next-gen AMM DeX.

#### Factories

* S-pool factory. Solidly volatile (x*y) and stable (x3y+y3x) pools.
* U-pool factory. Uniswap volatile (x*y) pools with price ranges.
* B-pool factory. Balancer pools: 2-16 tokens, constant average formula/value function, different pool weight.

#### Incentives

Cronje's ve-3,3: lock REACT for veREACT and vote for gauge, reward voters by bribes.

#### Proposed features

* U-pool: remove liquidity on out of range
* private pools
* liquidity lock gauge

Status: idea


## Start coding

```bash
yarn dev
```

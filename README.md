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

Dev budget: 50k PROFIT [executed proposal](https://www.tally.xyz/governance/eip155:137:0x6214Ba4Ce85C0A6F6025b0d63be7d65214463226/proposal/66682422927270058524602136602710037138274409785058239023318639830806613899674)


### MVP-2: Crypto trading

Decentralized crypto trading and analytic service.

#### Features

* price chart for any pair
* technical analysis gauges
* top traders, competitions
* tokens and DeXs analytics

Status: research

### MVP-3: Cross-chain swap

Cross-chain swap service.

Status: waiting for second network support

###  MVP-4: Limit orders

Status: exploring orderbook protocols

###  MVP-5: AMM

Next-gen AMM DeX.

#### Proposed features

* various AMM liquidity pool types support
  * [V0 testnet] R-pool: 2 tokens, Uniswap invariant (constant-product formula) (its AMM-V1 RLP was implemented in ReactSwap V0)
  * U-pool: 2 tokens, Uniswap invariant (constant product formula), price ranges, 5 types of pool fee
  * B-pool: 2-16 tokens, constant average formula/value function, different pool weight,
  * C-pools: 2-8 tokens, Stableswap invariant (hybrid formula)
* liquidity incentive platform
  * [V0 testnet] classic Farms and Pools (its ReactFarm and React Pools implemented in ReactSwap V0) 
  * User liquidity farms
  * User rewarding pools
* liquidity lock / provider and token certification
* leverage lending & trading

Status: idea


## Start coding

```bash
yarn dev
```

# ReactSwap

Repo contains [reactswap.com](https://reactswap.com) dApp source code.

[StabilityDAO](https://stabilitydao.org) Unit.


## Roadmap

### Networks
* Polygon
* [proposed] BSC


### :heavy_check_mark: MVP-1: Swap at the best price

Decentralized swap at the best price protocol. The best route and rate is calculated from the most sources of liquidity in a blockchain using the best liquidity aggregators. Transactions are executed through the Stability [MetaRouter](https://github.com/stabilitydao/core/blob/develop/contracts/swap/MetaRouter.sol).

#### Aggregator integrations

* [x] **1inch** [api docs](https://docs.1inch.io/docs/aggregation-protocol/introduction)
* [x] **0x** [api docs](https://docs.0x.org/0x-api-swap/introduction)
* [x] **OpenOcean** [api docs](https://docs.openocean.finance/api/openocean-dex-api-3.0)
* [ ] **ParaSwap** [api docs](https://developers.paraswap.network/api/master)

### MVP-2: Crypto trading

Decentralized crypto trading and analytics

#### ToDo
* [x] price charts by **DexScreener** [api docs](https://docs.dexscreener.com/)
* [ ] technical analysis gauges
* [ ] ReactSwap tokens API [0.25 WETH]
* Analytics (SEO/SSR, autoupdate)
  * [ ] Tokens page [0.125 WETH]
  * [ ] Token page [0.125 WETH]
* Account
  * [ ] Tokens value ($)
  * [ ] 24h change
  * [ ] portfolio tracker (SEO/SSR)

Status: development


### MVP-3: Cross-chain swap

Cross-chain swap service.

#### Proposed integrations
* Connext [api docs](https://docs.connext.network)

Status: waiting for second network support


### MVP-4: Limit orders

Status: exploring orderbook protocols


### MVP-5: AMM

Next-gen AMM DeX. Inspired by Solidly, UniswapV3 and Balancer.

#### Pools

* **Stable** (2 tokens, x3y+y3x, ft lp)
* **Volatile** (2 tokens, [price range x*y](https://docs.uniswap.org/protocol/concepts/V3-overview/concentrated-liquidity), nft lp)
* **Weighted** (2-8 tokens, [weighted x∗y](https://dev.balancer.fi/resources/pool-math/weighted-math))

#### Liquidity incentives

Vote/vest escrow tokenomics. Lock REACT for veREACT and vote for gauge, reward voters by bribes.

#### Proposed features

* cheap/free token whitelist for gauge/farm creation
* volatile pool: remove liquidity on out of range
* private pools
* liquidity lock
* multichain token and voting

Status: idea, research


## Start coding

```bash
yarn dev
```

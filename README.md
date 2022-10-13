# ReactSwap

Repo contains [reactswap.com](https://reactswap.com) dApp source code.

[StabilityDAO](https://stabilitydao.org) Unit.


## Roadmap

### Networks
* Polygon
* [proposed] BSC

<details>
  <summary>MVP-1: Swap at the best price [live]</summary>

### :heavy_check_mark: Swap at the best price

Decentralized swap at the best price protocol. The best route and rate is calculated from the most sources of liquidity in a blockchain using the best liquidity aggregators. Transactions are executed through the Stability [MetaRouter](https://github.com/stabilitydao/core/blob/develop/contracts/swap/MetaRouter.sol).

#### Aggregator integrations

* [x] **1inch** [api docs](https://docs.1inch.io/docs/aggregation-protocol/introduction)
* [x] **0x** [api docs](https://docs.0x.org/0x-api-swap/introduction)
* [x] **OpenOcean** [api docs](https://docs.openocean.finance/api/openocean-dex-api-3.0)
* [ ] **ParaSwap** [api docs](https://developers.paraswap.network/api/master)

</details>

<details>
  <summary>MVP-2: Crypto trading [backlog]</summary>

### Crypto trading

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

Status: on hold

</details>


<details>
  <summary>MVP-3: Cross-chain swap [backlog]</summary>

### Cross-chain swap

Cross-chain swap service.

#### Proposed integrations
* Connext [api docs](https://docs.connext.network)

Status: waiting for second network support

</details>

<details>
  <summary>MVP-4: Limit orders [backlog]</summary>

### MVP-4: Limit orders

Last status: exploring orderbook protocols

</details>

<details>
  <summary>MVP-5: DeX Factory [research]</summary>

### MVP-5: ve DeX Factory

Permissionless DeX builder. The user can create his own decentralized exchange with a customized mechanism for liquidity incentivesation, along with his token, using vesting escrow tokenomics through veNFT and DAO voting to manage and distribute coinage, as well with ability of bribing voters by liquidity providers and whitelisting tokens.

In short, everyone can create their own [Solidly-type](https://defillama.com/forks/Solidly) DeX like [Dystopia](https://www.dystopia.exchange/), [Cone](https://www.cone.exchange/), [Velodrome](https://app.velodrome.finance/) etc by this dApp without wasting resources on coding and operating.

Swap of tokens by platform occurs through the single UI and API entry point, with the help of smart order router, created on the basis of [Balancer version](https://github.com/balancer-labs/balancer-sor), along with a swap through aggregators used in MVP-1.


Status: research, budget estimate

</details>


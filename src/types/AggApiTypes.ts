export type OneInchLiquiditySource = {
  id:string,
  title: string,
  img: string,
  img_color: string,
}

export type OneInchLuqidityPoolRoute = {
  name:string,
  fromTokenAddress:string,
  toTokenAddress: string,
  part: string,
}

export type OpenOceanSubRoute = {
  from: string,
  to: string,
  dexes: {
    dex: string,
  }[],
  parts: number,
}
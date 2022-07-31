import React from 'react'
import styled from 'styled-components'

const ContentWrapper = styled.div`
  width: 100%;
  flex: 1 1;
  position: relative;
  min-height: 300px;
  max-width: 1200px;

  @media (max-width: 1760px) {
    max-width: 1000px;
  }

  @media (max-width: 1560px) {
    max-width: 1000px;
  }

  @media (max-width: 1280px) {
    max-width: 1200px;
  }
`

function DexScreenerChart({pairAddress}: {pairAddress: string}) {
  console.log('chart render', pairAddress)

  return (
    <ContentWrapper>
      <div dangerouslySetInnerHTML={{__html:
          `<style>#dexscreener-embed{position:relative;width:100%;padding-bottom:100%;}@media(min-width:1000px){#dexscreener-embed{padding-bottom:65%;}}#dexscreener-embed iframe{position:absolute;width:100%;height:100%;top:0;left:0;border:0;}</style><div id="dexscreener-embed"><iframe src="https://dexscreener.com/polygon/${pairAddress}?embed=1&theme=dark&info=0&trades=0"></iframe></div>`
      }}></div>
    </ContentWrapper>
  )
}

export default React.memo(DexScreenerChart)

import { Currency } from '@uniswap/sdk-core'
import CurrencyLogo from './CurrencyLogo'
import { bases } from '@/src/constants/currencies'
import { useTokenInfoFromActiveList } from '@/src/hooks/useTokenInfoFromActiveList'
import styled from 'styled-components'
import { ChainId } from '@/src/enums/ChainId'


const BaseWrapper = styled.div<{ disable?: boolean }>`
  border: 2px solid transparent;
  border-radius: 10px;
  display: flex;
  padding: 10px;

  align-items: center;
  :hover {
    cursor: ${({ disable }) => !disable && 'pointer'};
    background-color: ${({ theme, disable }) => !disable && theme.bg2};
  }

  color: ${({ theme, disable }) => disable && theme.text3};
  background-color: ${({ theme, disable }) => disable && theme.bg3};
  filter: ${({ disable }) => disable && 'grayscale(1)'};
`

export default function CommonBases({
  chainId,
  onSelect,
  selectedCurrency,
}: {
  chainId: ChainId
  selectedCurrency?: Currency | null
  onSelect: (currency: Currency) => void
}) {

  return bases[chainId].length > 0 ? (
    <div className="flex flex-wrap">
      {bases[chainId].map((currency: Currency) => {
        const isSelected = selectedCurrency?.equals(currency)
        return (
          <BaseWrapper
            onClick={() => !isSelected && onSelect(currency)}
            disable={isSelected}
            key={currency.symbol}
          >
            <CurrencyLogoFromList currency={currency} />
            <div className="text-sm">
              {currency.symbol}
            </div>
          </BaseWrapper>
        )
      })}
    </div>
  ) : null
}

/** helper component to retrieve a base currency from the active token lists */
function CurrencyLogoFromList({ currency }: { currency: Currency }) {
  const token = useTokenInfoFromActiveList(currency)

  return <CurrencyLogo currency={token} style={{width: 24, height: 24,}} />
}

import { useCallback, useState } from 'react'
import { Currency } from '@uniswap/sdk-core'
import useActiveWeb3React from '@/src/hooks/useActiveWeb3React'
import useCurrencyBalance from '@/src/hooks/useCurrencyBalance'
import { ChevronDownIcon } from '@heroicons/react/outline'
import CurrencySearchModal from '@/components/CurrencySearchModal'
import CurrencyLogo from '@/components/CurrencyLogo'
import { Field } from '@/src/state/swap/actions'
import { formatCurrencyAmount } from '@/src/utils/formatCurrencyAmount'

interface CurrencyInputPanelProps {
  field: Field
  value: string
  onUserInput?: (value: string) => void
  onMax?: () => void
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency
  otherCurrency?: Currency
  loading?: boolean
}


export default function CurrencyInputPanel({
                                             field,
                                             value,
                                             onUserInput,
                                             onMax,
                                             onCurrencySelect,
                                             currency,
                                             otherCurrency,
                                             loading = false,
                                             ...rest
                                           }: CurrencyInputPanelProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const { account } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)

  const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group
  function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
  }
  const enforcer = (nextUserInput: string) => {
    if (onUserInput && ( nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput)))) {
      onUserInput(nextUserInput)
    }
  }
  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])



  return (
    <div {...rest} className="flex max-w-lg w-full">

      <div
        className="flex-1 cursor-pointer"
        onClick={() => {
          if (onCurrencySelect) {
            setModalOpen(true)
          }
        }}
      >
        <div className="flex p-2 h-10 font-bold">{currency ? currency.name : ''}</div>
        <div className="flex p-2 items-center w-48">
          <CurrencyLogo currency={currency} />
          <div className="text-2xl">{currency ? currency.symbol : <span className="text-sm">Select a token</span>}</div>
          <ChevronDownIcon width={24} height={24} className="ml-2 stroke-current" />
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="w-1 h-10"> </div>
        {field === Field.INPUT ? (
          <input
            className="w-48 h-12 text-2xl mt-0.5 text-right p-3"
            value={value}
            onChange={(event) => {
              enforcer(event.target.value.replace(/,/g, '.'))
            }}
            inputMode="decimal"
            autoComplete="off"
            autoCorrect="off"
            // text-specific options
            type="text"
            pattern="^[0-9]*[.,]?[0-9]*$"
            placeholder={'' || '0.0'}
            minLength={1}
            maxLength={79}
            spellCheck="false"
          />
        ) : (
          <div className="mt-1 flex justify-end items-center border-2 dark:border-gray-500 w-48 h-12  text-2xl  text-right p-3">{value && parseFloat(value) > 0 && currency ? value : null}</div>
        )}
        {account ? (
          <div style={{ height: '17px' }} className="text-right pr-3">
            <div
              onClick={field === Field.INPUT ? onMax : ()=>null}
              style={{ display: 'inline', cursor: field === Field.INPUT ? 'pointer' : 'default' }}
            >
              {currency && selectedCurrencyBalance ? (
                <span>Balance: {formatCurrencyAmount(selectedCurrencyBalance, 4)}</span>
              ) : null}
            </div>
          </div>
        ) : (
          <span />
        )}
      </div>

      {onCurrencySelect && (
        <CurrencySearchModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency}
          otherSelectedCurrency={otherCurrency}
          showCommonBases={true}
          showCurrencyAmount={true}
          disableNonToken={false}
        />
      )}
    </div>
  )
}


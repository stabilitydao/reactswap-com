import { getAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'
import { Token } from '@uniswap/sdk-core'
import { ChainTokenMap } from '../hooks/useTokenList'

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address)
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

export function isNativeAddress(address: string): boolean {
  return toChecksumAddress(address) === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
    || toChecksumAddress(address) === '0x0000000000000000000000000000000000001010'
}

export function getNativeLogoURI(chainId: ChainId): string {
  return `/img/${chainId}-native.svg`
}

export function getCurrencyLogoURI(currency?: Currency): string {
  if (currency) {
    if ( currency instanceof WrappedTokenInfo && currency.logoURI) {
      return currency.logoURI
    }
    if (currency.isNative) {
      return getNativeLogoURI(currency.chainId);
    }
    if (currency.isToken && currency.address === wrappedNative[currency.chainId].address) {
      return getNativeLogoURI(currency.chainId);
    }
  }

  return '/img/no-logo.png'
}

// account is not optional
function getSigner(library: JsonRpcProvider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

// account is optional
function getProviderOrSigner(library: JsonRpcProvider, account?: string): JsonRpcProvider | JsonRpcSigner {
  return account ? getSigner(library, account) : library
}

// account is optional
export function getContract(address: string, ABI: any, library: JsonRpcProvider, account?: string): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account) as any)
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export function isTokenOnList(chainTokenMap: ChainTokenMap, token?: Token): boolean {
  return Boolean(token?.isToken && chainTokenMap[token.chainId]?.[token.address])
}

import { parseUnits } from '@ethersproject/units'
import { Currency, CurrencyAmount } from '@uniswap/sdk-core'
import JSBI from 'jsbi'
import { toChecksumAddress } from '@walletconnect/utils'
import { WrappedTokenInfo } from '@/src/state/lists/wrappedTokenInfo'
import { wrappedNative } from '@/src/constants/currencies'
import { ChainId } from '@/src/enums/ChainId'
import {fee} from "@/src/constants/fees";

/**
 * Parses a CurrencyAmount from the passed string.
 * Returns the CurrencyAmount, or undefined if parsing fails.
 */
export default function tryParseCurrencyAmount<T extends Currency>(
  value?: string,
  currency?: T
): CurrencyAmount<T> | undefined {
  if (!value || !currency) {
    return undefined
  }
  try {
    const typedValueParsed = parseUnits(value, currency.decimals).toString()
    if (typedValueParsed !== '0') {
      return CurrencyAmount.fromRawAmount(currency, JSBI.BigInt(typedValueParsed))
    }
  } catch (error) {
    // fails if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.debug(`Failed to parse input amount: "${value}"`, error)
  }
  return undefined
}

export function calcOutputExactMin(quote: CurrencyAmount<Currency>, slippage: string) : string {
  const withSLippage = quote.subtract(quote.multiply(JSBI.BigInt(parseFloat(slippage)*1000)).divide(JSBI.BigInt(100000)));
  return withSLippage.subtract(withSLippage.multiply(JSBI.BigInt(parseFloat(fee)*1000)).divide(JSBI.BigInt(100000))).toFixed(quote.currency.decimals >= 8 ? 8 : undefined)
}
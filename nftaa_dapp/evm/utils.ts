import { BigNumber, ethers } from 'ethers'
// @ts-ignore
import Big from 'big.js'
import {
  TransactionRequest,
  TransactionResponse,
} from '@ethersproject/abstract-provider'
import { useWalletStore } from '~~/stores/WalletStore'
import { EVM_NATIVE_DECIMALS } from '~~/evm/constants'

// MATH
/**
 * Convert decimal number to hex. Hex number starts with 0x
 * @param dec
 * @param padWithZeroes If hex number after 0x should be padded with zeroes or not 0x05 vs 0x5
 */
export function decToHex(dec: string | number, padWithZeroes = false): string {
  const hex: string = BigNumber.from(dec).toHexString()
  if (padWithZeroes) {
    return hex
  }

  const hexWithout0x: string = hex.substring(2)
  // using regex to remove leading zeroes
  return `0x${hexWithout0x.replace(/^0+/, '')}`
}

/**
 * Convert hex number to decimal
 * @param hex
 */
export function hexToDec(hex: string): string {
  return BigNumber.from(hex).toString()
}

/**
 * Round amount of token
 * @param amount
 * @param targetDecimals
 */
export function roundTokenAmount(
  amount: string,
  targetDecimals: number
): string {
  Big.NE = -18
  const amountBig: Big = new Big(amount)
  return amountBig.round(targetDecimals).toString()
}

// CONTRACT
/**
 * Convert value from the smallest unit
 * @param value
 * @param decimals
 */
export function fromSmallestUnit(value: string, decimals: number): string {
  Big.NE = -EVM_NATIVE_DECIMALS
  const valueBig: Big = new Big(value)
  const denominator: Big = new Big(10).pow(decimals)

  return valueBig.div(denominator).toString()
}

/**
 * Retrieve signer from store
 */
export function getSigner(): ethers.providers.JsonRpcSigner {
  const store = useWalletStore()
  const provider: ethers.providers.Web3Provider =
    new ethers.providers.Web3Provider(<never>store.provider)
  return provider.getSigner()
}

/**
 * Convert value to smallest unit
 * @param value
 * @param decimals
 */
export function toSmallestUnit(value: string, decimals: number): string {
  Big.PE = 100
  const valueBig: Big = new Big(value)
  const multiplier: Big = new Big(10).pow(decimals)

  return valueBig.mul(multiplier).toString()
}

/**
 * Get address abbreviation so first 5 chars and last 5 chars are returned
 * @param address
 */
export function getAddressAbbr(address: string | null): string {
  if (address === null) {
    return ''
  }

  const firstAndLastCharsNumber = 5
  if (address.length <= firstAndLastCharsNumber * 2 + 3) {
    return address
  }

  return `${address.substring(
    0,
    firstAndLastCharsNumber
  )}...${address.substring(address.length - firstAndLastCharsNumber)}`
}

/**
 * Sign and broadcast transaction over network
 * @param tx
 */
export async function sendTransaction(
  tx: TransactionRequest
): Promise<TransactionResponse> {
  const signer: ethers.providers.JsonRpcSigner = getSigner()
  return signer.sendTransaction(tx)
}

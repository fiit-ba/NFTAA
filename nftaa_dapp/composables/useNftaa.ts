import { BigNumber } from 'ethers'
import { TransactionResponse } from '@ethersproject/abstract-provider'
import { NFTAA } from '~/evm/contracts/NFTAA'
import { FactoryNFTAA } from '~/evm/contracts/FactoryNFTAA'
import {Mock} from "~/evm/contracts/Mock";

export function useNftaa() {
  const nftaaFactory: FactoryNFTAA = new FactoryNFTAA()
  const mock: Mock = new Mock()

  async function mint(description: string): Promise<TransactionResponse> {
    const txResponse = await nftaaFactory.safeMint(description)
    console.log(txResponse)
    return txResponse
  }

  async function transferTo(
    from: string,
    to: string,
    tokenId: number
  ): Promise<TransactionResponse> {
    const txResponse = await nftaaFactory.transferFrom(from, to, tokenId)
    console.log(txResponse)
    return txResponse
  }

  async function getStakedAmount(nftaaAddr: string): Promise<string> {
    const txResponse = await mock.getStakedAmount()
    console.log(txResponse)
    return txResponse.toString()
  }

  async function getStaker(nftaaAddr: string): Promise<string> {
    const txResponse = await mock.getStaker()
    console.log(txResponse)
    return txResponse
  }

  async function stake(value: string, nftaaAddr: string): Promise<string> {
    const nftaa: NFTAA = new NFTAA(nftaaAddr)
    const txResponse = await nftaa.proxy('stake()', BigNumber.from(value))
    console.log(txResponse)
    return txResponse.value.toString()
  }

  async function addToStake(value: string, nftaaAddr: string): Promise<string> {
    const nftaa: NFTAA = new NFTAA(nftaaAddr)
    const txResponse = await nftaa.proxy('addToStake()', BigNumber.from(value))
    console.log(txResponse)
    return txResponse.value.toString()
  }

  async function unStake(nftaaAddr: string): Promise<string> {
    const nftaa: NFTAA = new NFTAA(nftaaAddr)
    const txResponse = await nftaa.proxy('unstake()', BigNumber.from(0))
    console.log(txResponse)
    return txResponse.value.toString()
  }

  return {
    getStakedAmount,
    getStaker,
    stake,
    addToStake,
    unStake,
    mint,
    transferTo,
  }
}

import { BigNumber, ContractInterface, ethers } from 'ethers'
import { TransactionResponse } from '@ethersproject/abstract-provider'
import { BaseContract } from '~/evm/contracts/BaseContract'

export class NFTAA extends BaseContract {
  protected readonly contract: ethers.Contract

  constructor(nftaa_addr: string) {
    super()

    if (useWalletStore().selectedAddress !== null) {
      this.contract = new ethers.Contract(
        nftaa_addr,
        ContractABI,
        this.signer
      )
    } else {
      throw new Error('Chain id can not be null')
    }
  }

  public async proxy(
    call: string,
    value: BigNumber
  ): Promise<TransactionResponse> {
    return this.handleTransaction(
      await this.contract.proxy(call, { value }),
      'Increase stake completed',
      'Increase stake failed'
    )
  }
}

const ContractABI: ContractInterface = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'binded_nft_adders',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'binded_nft_id',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'note',
        type: 'string',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bool',
        name: 'success',
        type: 'bool',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'ProxyResponse',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'call',
        type: 'string',
      },
    ],
    name: 'proxy',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
]

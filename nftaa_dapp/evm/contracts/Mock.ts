import { BigNumber, ContractInterface, ethers } from 'ethers'
import { TransactionResponse } from '@ethersproject/abstract-provider'
import { BaseContract } from './BaseContract'
import { STAKING_MOCK_ADDRESS } from '~~/evm/constants'

export class Mock extends BaseContract {
  protected readonly contract: ethers.Contract

  constructor() {
    super()

    if (useWalletStore().selectedAddress !== null) {
      this.contract = new ethers.Contract(
        STAKING_MOCK_ADDRESS,
        ContractABI,
        this.signer
      )
    } else {
      throw new Error('Chain id can not be null')
    }
  }

  public async getStakedAmount(): Promise<BigNumber> {
    return await this.contract.getStakedAmount()
  }

  public async getStaker(): Promise<string> {
    return await this.contract.getStaker()
  }

  public async getUnlockTime(): Promise<BigNumber> {
    return await this.contract.getUnlockTime()
  }

  public async stake(value: BigNumber): Promise<TransactionResponse> {
    return this.handleTransaction(
      await this.contract.stake({ value }),
      'Stake completed',
      'Stake failed'
    )
  }

  public async addToStake(value: BigNumber): Promise<TransactionResponse> {
    return this.handleTransaction(
      await this.contract.addStake({ value }),
      'Increase stake completed',
      'Increase stake failed'
    )
  }

  public unStake(): Promise<void> {
    return this.contract.unstake()
  }
}

const ContractABI: ContractInterface = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'addStake',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getStakedAmount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getStaker',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getUnlockTime',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'stake',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'unstake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

import { ethers } from 'ethers'
import { TransactionResponse } from '@ethersproject/abstract-provider'
import { TYPE } from 'vue-toastification'
import { getSigner } from '../utils'

export class BaseContract {
  protected signer: ethers.providers.JsonRpcSigner

  constructor() {
    this.signer = getSigner()
  }

  protected async handleTransaction(
    transactionPromise: Promise<TransactionResponse>,
    successText: string,
    errorText: string
  ): Promise<TransactionResponse> {
    let txHash = ''
    let txResponse: TransactionResponse = <TransactionResponse>{}

    try {
      txResponse = await transactionPromise

      txHash = txResponse.hash
      await txResponse.wait()
      console.log(successText, { id: txHash, type: TYPE.SUCCESS })
    } catch (e: unknown) {
      console.log(errorText, { id: txHash, type: TYPE.ERROR })
    }

    return txResponse
  }
}

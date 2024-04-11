/**
 * Chain ID enum with decimal values
 */
export enum SubScaffoldChainId {
  Moonbase = 1287,
}

export interface NativeAsset {
  name: string
  symbol: string
}

export interface ChainData {
  asset: NativeAsset
  explorerLink: string
  logoUrl: string
  name: string
  rpcUrl: string
}

export const CHAIN_INFO: { [chainId: number]: ChainData } = {
  [SubScaffoldChainId.Moonbase]: {
    asset: { name: 'Ethereum', symbol: 'DEV' },
    explorerLink: '',
    logoUrl: '',
    name: 'Moonbase',
    rpcUrl: 'https://rpc.api.moonbase.moonbeam.network',
  },
}

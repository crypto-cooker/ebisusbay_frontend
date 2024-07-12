import {defaultWagmiConfig} from '@web3modal/wagmi/react/config';
import {cookieStorage, createConfig, createStorage, http} from 'wagmi'
import {cronos, cronosTestnet} from 'wagmi/chains'
import {appConfig as applicationConfig, isTestnet} from "@src/Config";
import {walletConnect} from "@wagmi/connectors";
import {CHAINS} from "@src/Config/chains";
import memoize from "lodash/memoize";

export const chains = CHAINS
export const CHAIN_IDS = chains.map((c) => c.id)
export const isChainSupported = memoize((chainId: number) => (CHAIN_IDS as number[]).includes(chainId))

type ChainRpcUrls = {
  http: readonly string[]
  webSocket?: readonly string[] | undefined
}
const appConfig = applicationConfig();

const projectId = process.env.NEXT_PUBLIC_WEB3MODAL_API_KEY;
if (!projectId) throw 'Web3Modal API Key not defined';

const metadata = {
  name: 'Ebisu\'s Bay',
  description: 'A dynamic platform that combines NFT and DEX trading with GameFi, enabling users to battle for market dominance.',
  url: appConfig.urls.app,
  icons: ['https://cdn-prod.ebisusbay.com/img/logo-dark.svg']
}


// const ethersChains = [
//   {
//     rpcUrl: appConfig.rpc.read,
//     explorerUrl: appConfig.urls.explorer,
//     currency: 'CRO',
//     name: 'Cronos Mainnet',
//     chainId: 25,
//   }
// ];

function setupDefaultConfig() {

  const config = defaultWagmiConfig({
    chains,
    projectId: projectId!,
    metadata,
    ssr: true,
    storage: createStorage({
      storage: cookieStorage
    }),
    syncConnectedChain: true,
  })

  return config;
}

// // All this setup just to get the autoConnect parameter...
// function setupCustomConfig() {
//   const config = createConfig({
//     chains: [{...primaryNetwork, rpcUrls}],
//     transports: {
//       [cronos.id]: http(),
//       [cronosTestnet.id]: http()
//     },
//     connectors: [
//       walletConnect({ projectId: projectId!, metadata, showQrModal: false }), // showQrModal must be false.
//       // Other connectors...
//     ],
//     ssr: true,
//     storage: createStorage({
//       storage: cookieStorage
//     })
//   });
//
//   return config;
// }

const defaultConfig = setupDefaultConfig();
// const customConfig = setupCustomConfig();
export const wagmiConfig = defaultConfig;
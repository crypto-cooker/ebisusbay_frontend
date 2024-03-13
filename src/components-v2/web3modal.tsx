"use client";

import {createWeb3Modal} from '@web3modal/wagmi/react'
import {defaultWagmiConfig} from '@web3modal/wagmi/react/config';
// import {configureChains, Connector, createConfig, WagmiConfig} from 'wagmi'
import {cookieStorage, createStorage, State, WagmiConfig, WagmiProvider} from 'wagmi'
import {cronos, cronosTestnet} from 'viem/chains'
import {appConfig as applicationConfig, isTestnet} from "@src/Config";
import ImageService from "@src/core/services/image";
import {ReactNode} from "react";
// import {walletConnectProvider} from "@web3modal/wagmi";
// import {jsonRpcProvider} from "wagmi/providers";
type ChainRpcUrls = {
  http: readonly string[]
  webSocket?: readonly string[] | undefined
}
const appConfig = applicationConfig();

const projectId = process.env.NEXT_PUBLIC_WEB3MODAL_API_KEY;
if (!projectId) throw 'Web3Modal API Key not defined';

const metadata = {
  name: 'Ebisu\'s Bay',
  description: 'The Leading GameFi NFT Marketplace',
  url: appConfig.urls.app,
  icons: ['https://cdn-prod.ebisusbay.com/img/logo-dark.svg']
}

const primaryNetwork = (isTestnet() ? cronosTestnet : cronos);

const rpcUrls: {
  [key: string]: ChainRpcUrls;
  default: ChainRpcUrls;
} = {
  default: {
    http: [appConfig.rpc.read, primaryNetwork.rpcUrls.default.http]
  },
  public: {
    http: [appConfig.rpc.read, primaryNetwork.rpcUrls.default.http]
  }
}

const ethersChains = [
  {
    rpcUrl: appConfig.rpc.read,
    explorerUrl: appConfig.urls.explorer,
    currency: 'CRO',
    name: 'Cronos Mainnet',
    chainId: 25,
  }
];

function setupDefaultConfig() {
  const wagmiChains = [{...primaryNetwork, rpcUrls}];

  const config = defaultWagmiConfig({
    chains: [{...primaryNetwork, rpcUrls}],
    projectId: projectId!,
    metadata,
    ssr: false, // @todo review if any changes to https://github.com/wevm/wagmi/issues/3589
    storage: createStorage({
      storage: cookieStorage
    })
  })

  return config;

  // return { config, chains: wagmiChains };
}

// // All this setup just to get the autoConnect parameter...
// function setupCustomConfig(connectors: Array<Connector>) {
//   const { chains, publicClient } = configureChains(
//     [primaryNetwork],
//     [walletConnectProvider({ projectId: projectId! }), jsonRpcProvider({
//       rpc: (chain) => ({
//         http: appConfig.rpc.read,
//         websocket: 'wss://ws-rpc.ebisusbay.com'
//       })
//     })]
//   )
//
//   const config = createConfig({
//     connectors,
//     autoConnect: true,
//     publicClient,
//   });
//
//   return { config, chains };
// }

const defaultConfig = setupDefaultConfig();
// const customConfig = setupCustomConfig(defaultConfig.config.connectors);
export const wagmiConfig = defaultConfig;

createWeb3Modal({
  // ethersConfig: defaultConfig({ metadata }),
  wagmiConfig: wagmiConfig,
  projectId,
  // chains: wagmiConfig.config.chains,
  tokens: {
    [appConfig.chain.id]: {
      address: appConfig.tokens.frtn.address,
      image: 'token_image_url' //optional
    }
  },
  // featuredWalletIds: [
  //   'f2436c67184f158d1beda5df53298ee84abfc367581e4505134b5bcf5f46697d'
  // ],
  termsConditionsUrl: ImageService.staticAsset('terms-of-service.html').convert(),
  privacyPolicyUrl: ImageService.staticAsset('privacy-policy.html').convert(),

  themeMode: 'dark',
});

// export function Web3Modal({ children }: { children: React.ReactNode }) {
//   return <WagmiConfig config={customConfig.config}>{children}</WagmiConfig>;
// }

export function Web3Modal({children, initialState}: { children: ReactNode, initialState?: State }) {
  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      {children}
    </WagmiProvider>
  )
}
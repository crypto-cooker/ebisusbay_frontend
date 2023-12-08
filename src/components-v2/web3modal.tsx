"use client";

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { defaultConfig } from '@web3modal/ethers5/react'
import { WagmiConfig } from 'wagmi'
import {cronos, cronosTestnet} from 'viem/chains'
import {appConfig, isTestnet} from "@src/Config";
import ImageService from "@src/core/services/image";
import {ethers} from "ethers";

const config = appConfig();

// 1. Get projectId
const projectId = '8002f872986e034df168060193915223'

// 2. Create wagmiConfig
const metadata = {
  name: 'Ebisu\'s Bay',
  description: 'Cronos Numba 1 Market',
  url: config.urls.app,
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const primaryNetwork = (isTestnet() ? cronosTestnet : cronos);

const rpcUrls = {
  default: {
    http: [config.rpc.read, primaryNetwork.rpcUrls.default.http]
  },
  public: {
    http: [config.rpc.read, primaryNetwork.rpcUrls.public.http]
  }
}

const wagmiChains = [
  {
    ...primaryNetwork,
    rpcUrls
  }
];

const ethersChains = [
  {
    rpcUrl: config.rpc.read,
    explorerUrl: config.urls.explorer,
    currency: 'CRO',
    name: 'Cronos Mainnet',
    chainId: 25,
  }
]
const wagmiConfig = defaultWagmiConfig({
  chains: wagmiChains,
  projectId,
  metadata
});


// 3. Create modal
createWeb3Modal({
  // ethersConfig: defaultConfig({ metadata }),
  wagmiConfig,
  projectId,
  chains: wagmiChains,
  defaultChain: wagmiChains[0],
  tokens: {
    [config.chain.id]: {
      address: config.tokens.frtn.address,
      image: 'token_image_url' //optional
    }
  },
  featuredWalletIds: [
    'f2436c67184f158d1beda5df53298ee84abfc367581e4505134b5bcf5f46697d'
  ],
  termsConditionsUrl: ImageService.staticAsset('terms-of-service.html').convert(),
  privacyPolicyUrl: ImageService.staticAsset('privacy-policy.html').convert(),

  themeMode: 'dark'
})

export function Web3Modal({ children }: { children: React.ReactNode }) {
  return <WagmiConfig config={wagmiConfig as any}>{children}</WagmiConfig>;
}
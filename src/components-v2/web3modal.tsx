"use client";

import {createWeb3Modal, defaultWagmiConfig} from '@web3modal/wagmi/react'
import {configureChains, Connector, createConfig, WagmiConfig} from 'wagmi'
import {cronos, cronosTestnet} from 'viem/chains'
import {appConfig as applicationConfig, isTestnet} from "@src/Config";
import ImageService from "@src/core/services/image";
import {walletConnectProvider} from "@web3modal/wagmi";
import {jsonRpcProvider} from "wagmi/providers/jsonRpc";

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

const rpcUrls = {
  default: {
    http: [appConfig.rpc.read, primaryNetwork.rpcUrls.default.http]
  },
  public: {
    http: [appConfig.rpc.read, primaryNetwork.rpcUrls.public.http]
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

  const config =  defaultWagmiConfig({
    chains: wagmiChains,
    projectId: projectId!,
    metadata,
  });

  return { config, chains: wagmiChains };
}

// All this setup just to get the autoConnect parameter...
function setupCustomConfig(connectors: Array<Connector>) {
  const { chains, publicClient } = configureChains(
    [primaryNetwork],
    [walletConnectProvider({ projectId: projectId! }), jsonRpcProvider({
      rpc: (chain) => ({
        http: appConfig.rpc.read,
        websocket: 'wss://ws-rpc.ebisusbay.com'
      })
    })]
  )

  const config = createConfig({
    connectors,
    autoConnect: true,
    publicClient,
  });

  return { config, chains };
}

const defaultConfig = setupDefaultConfig();
const customConfig = setupCustomConfig(defaultConfig.config.connectors);
const selectedConfig = customConfig;

createWeb3Modal({
  // ethersConfig: defaultConfig({ metadata }),
  wagmiConfig: selectedConfig.config,
  projectId,
  chains: selectedConfig.chains,
  tokens: {
    [appConfig.chain.id]: {
      address: appConfig.tokens.frtn.address,
      image: 'token_image_url' //optional
    }
  },
  featuredWalletIds: [
    'f2436c67184f158d1beda5df53298ee84abfc367581e4505134b5bcf5f46697d'
  ],
  termsConditionsUrl: ImageService.staticAsset('terms-of-service.html').convert(),
  privacyPolicyUrl: ImageService.staticAsset('privacy-policy.html').convert(),

  themeMode: 'dark',
});

export function Web3Modal({ children }: { children: React.ReactNode }) {
  return <WagmiConfig config={customConfig.config}>{children}</WagmiConfig>;
}
import {cronos, cronosTestnet} from 'viem/chains'
import {appConfig as applicationConfig, isTestnet} from "@src/Config";
import {defaultWagmiConfig, walletConnectProvider} from "@web3modal/wagmi";
import {configureChains, Connector, createConfig} from "wagmi";
import {jsonRpcProvider} from "wagmi/providers/jsonRpc";

const appConfig = applicationConfig();

const projectId = process.env.NEXT_PUBLIC_WEB3MODAL_API_KEY;
if (!projectId) throw 'Web3Modal API Key not defined';

const metadata = {
  name: 'Ebisu\'s Bay',
  description: 'A dynamic platform that combines NFT and DEX trading with GameFi, enabling users to battle for market dominance.',
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

  const config = defaultWagmiConfig({
    chains: wagmiChains,
    projectId: projectId!,
    metadata
  })

  // return config;

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
export const wagmiConfig = customConfig;
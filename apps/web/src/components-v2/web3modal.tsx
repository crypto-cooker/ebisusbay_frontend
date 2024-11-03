'use client';

import {createAppKit} from "@reown/appkit/react";
import {cronos, cronosTestnet} from '@reown/appkit/networks'
import {State, WagmiProvider} from 'wagmi'
import {appConfig as applicationConfig} from "@src/config";
import {ReactNode} from "react";
import {wagmiAdapter, wagmiConfig} from "@src/wagmi";

const appConfig = applicationConfig();

const projectId = process.env.NEXT_PUBLIC_WEB3MODAL_API_KEY;
if (!projectId) throw 'Web3Modal API Key not defined';

const metadata = {
  name: 'Ebisu\'s Bay',
  description: 'A dynamic platform that combines NFT and DEX trading with GameFi, enabling users to battle for market dominance.',
  url: appConfig.urls.app,
  icons: ['https://cdn-prod.ebisusbay.com/img/logo-dark.svg']
}

const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: wagmiAdapter.wagmiChains,
  defaultNetwork: process.env.NEXT_PUBLIC_ENV === 'testnet' ? cronosTestnet : cronos,
  metadata: metadata,
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  }
})

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
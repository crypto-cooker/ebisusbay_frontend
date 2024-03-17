'use client';

import {createWeb3Modal} from '@web3modal/wagmi/react';
import {appConfig as applicationConfig} from "@src/Config";
import ImageService from "@src/core/services/image";
import {ReactNode} from "react";
import {wagmiConfig} from "@src/wagmi";
import {WagmiConfig} from "wagmi";

const appConfig = applicationConfig();

const projectId = process.env.NEXT_PUBLIC_WEB3MODAL_API_KEY;
if (!projectId) throw 'Web3Modal API Key not defined';


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

export function Web3Modal({children}: { children: ReactNode }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      {children}
    </WagmiConfig>
  )
}
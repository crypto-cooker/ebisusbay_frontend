import { cookieStorage, createStorage } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import {CHAINS} from "@src/config/chains";
import memoize from "lodash/memoize";

export const chains = CHAINS
export const CHAIN_IDS = chains.map((c) => c.id)
export const isChainSupported = memoize((chainId: number) => (CHAIN_IDS as number[]).includes(chainId))


const projectId = process.env.NEXT_PUBLIC_WEB3MODAL_API_KEY;
if (!projectId) throw 'Web3Modal API Key not defined';


function setupDefaultAdapter() {
  return new WagmiAdapter({
    networks: chains,
    projectId: projectId!,
    ssr: true,
    storage: createStorage({
      storage: cookieStorage
    }),
    syncConnectedChain: true
  });
}

const defaultAdapter = setupDefaultAdapter();
export const wagmiConfig = defaultAdapter.wagmiConfig;
export const wagmiAdapter = defaultAdapter;
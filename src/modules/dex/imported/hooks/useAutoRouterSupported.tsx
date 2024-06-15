import { isSupportedChain } from '@dex/imported/constants/chains'
import {useAccount} from "wagmi";

export default function useAutoRouterSupported(): boolean {
  const { chain } = useAccount()
  return isSupportedChain(chain?.id)
}

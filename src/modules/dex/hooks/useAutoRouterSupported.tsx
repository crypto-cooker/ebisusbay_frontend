import { isSupportedChain } from '@dex/constants/chains'
import {useNetwork} from "wagmi";

export default function useAutoRouterSupported(): boolean {
  const { chain } = useNetwork()
  return isSupportedChain(chain?.id)
}

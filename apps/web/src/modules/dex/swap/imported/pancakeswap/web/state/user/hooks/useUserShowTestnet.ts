import { useAtom } from 'jotai'
import atomWithStorageWithErrorCatch from "@eb-pancakeswap-web/utils/atomWithStorageWithErrorCatch";

const USER_SHOW_TESTNET = 'pcs:user-show-testnet'

const userShowTestnetAtom = atomWithStorageWithErrorCatch<boolean>(USER_SHOW_TESTNET, true)

export function useUserShowTestnet() {
  return useAtom(userShowTestnetAtom)
}

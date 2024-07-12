import { Dispatch } from '@reduxjs/toolkit'
import { configureScope } from '@sentry/nextjs'
import {resetUserState, toggleFarmTransactionModal} from "@eb-pancakeswap-web/state/global/actions";
import getLocalStorageItemKeys from "@eb-pancakeswap-web/utils/getLocalStorageItemKeys";

export const clearUserStates = (
  dispatch: Dispatch<any>,
  {
    chainId,
    newChainId,
  }: {
    chainId?: number
    newChainId?: number
  },
) => {
  if (chainId) {
    dispatch(resetUserState({ chainId, newChainId }))
  }
  dispatch(toggleFarmTransactionModal({ showModal: false }))
  configureScope((scope) => scope.setUser(null))
  // const lsOrderKeys = getLocalStorageItemKeys(LS_ORDERS)
  // lsOrderKeys.forEach((lsOrderKey) => window?.localStorage?.removeItem(lsOrderKey))
  // window?.localStorage?.removeItem(PREDICTION_TOOLTIP_DISMISS_KEY)
  // deleteCookie(AFFILIATE_SID, { sameSite: true })
}

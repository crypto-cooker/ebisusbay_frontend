import { useSelector } from 'react-redux'
import {RootState} from "@market/state/redux/store";

// Get Farm Harvest
export function useFarmHarvestTransaction() {
  const state = useSelector<RootState, RootState['pancakeGlobal']>((s) => s.pancakeGlobal)
  return {
    showModal: state.showFarmTransactionModal,
    pickedTx: state.pickedFarmTransactionModalTx,
  }
}

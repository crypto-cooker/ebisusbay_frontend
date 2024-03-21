import {useAtom} from 'jotai';
import {
  BarterNft,
  BarterState,
  barterStateAtom,
  BarterToken, clearTakerDataAtom, clearMakerDataAtom, setDurationAtom, setEndDateAtom, setStartDateAtom,
  setTakerAddressAtom,
  setMakerAddressAtom,
  toggleOfferAERC20Atom,
  toggleOfferANFTAtom,
  toggleTakerERC20Atom,
  toggleTakerNFTAtom,
  updateAmountSelectedAtom,
  updateERC20AmountSelectedAtom,
  updateOfferAmountSelectedAtom,
  updateOfferERC20AmountSelectedAtom
} from "@src/jotai/atoms/swap";

interface UseBarterSwap {
  barterState: BarterState;
  setTakerAddress: (address: string) => void;
  setMakerAddress: (address: string) => void;
  clearTakerData: (address: string) => void;
  clearMakerData: (address: string) => void;
  toggleSelectionNFT: (nft: BarterNft) => void;
  toggleSelectionERC20: (erc20: BarterToken) => void;
  toggleOfferNFT: (nft: BarterNft) => void;
  toggleOfferERC20: (erc20: BarterToken) => void;
  updateAmountSelected: ({ nftAddress, nftId, newAmountSelected }: { nftAddress: string; nftId: string; newAmountSelected: number }) => void;
  updateOfferAmountSelected: ({ nftAddress, nftId, newAmountSelected }: { nftAddress: string; nftId: string; newAmountSelected: number }) => void;
  updateTokenAmountSelected: ({ tokenAddress, newAmountSelected }: { tokenAddress: string; newAmountSelected: number }) => void;
  updateTokenOfferAmountSelected: ({ tokenAddress, newAmountSelected }: { tokenAddress: string; newAmountSelected: number }) => void;
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date) => void;
  setDuration: (duration: number) => void;
}

const useBarterSwap = (): UseBarterSwap => {
  const [barterState] = useAtom(barterStateAtom);

  const [, setTakerAddress] = useAtom(setTakerAddressAtom);
  const [, setMakerAddress] = useAtom(setMakerAddressAtom);
  const [, clearTakerData] = useAtom(clearTakerDataAtom);
  const [, clearMakerData] = useAtom(clearMakerDataAtom);
  const [, toggleSelectionNFT] = useAtom(toggleTakerNFTAtom);
  const [, toggleSelectionERC20] = useAtom(toggleTakerERC20Atom);
  const [, toggleOfferNFT] = useAtom(toggleOfferANFTAtom);
  const [, toggleOfferERC20] = useAtom(toggleOfferAERC20Atom);
  const [, updateAmountSelected] = useAtom(updateAmountSelectedAtom);
  const [, updateOfferAmountSelected] = useAtom(updateOfferAmountSelectedAtom);
  const [, updateTokenAmountSelected] = useAtom(updateERC20AmountSelectedAtom);
  const [, updateTokenOfferAmountSelected] = useAtom(updateOfferERC20AmountSelectedAtom);
  const [, setStartDate] = useAtom(setStartDateAtom);
  const [, setEndDate] = useAtom(setEndDateAtom);
  const [, setDuration] = useAtom(setDurationAtom);

  return {
    barterState,
    setTakerAddress,
    setMakerAddress,
    clearTakerData,
    clearMakerData,
    toggleSelectionNFT,
    toggleSelectionERC20,
    toggleOfferNFT,
    toggleOfferERC20,
    updateAmountSelected,
    updateOfferAmountSelected,
    updateTokenAmountSelected,
    updateTokenOfferAmountSelected,
    setStartDate,
    setEndDate,
    setDuration
  };
};

export default useBarterSwap;

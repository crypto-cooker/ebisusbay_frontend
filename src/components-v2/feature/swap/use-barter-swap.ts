import {useAtom} from 'jotai';
import {
  BarterNft,
  BarterState,
  barterStateAtom,
  BarterToken, clearUserADataAtom, clearUserBDataAtom,
  setUserAAddressAtom,
  setUserBAddressAtom,
  toggleOfferAERC20Atom,
  toggleOfferANFTAtom,
  toggleUserAERC20Atom,
  toggleUserANFTAtom,
  updateAmountSelectedAtom,
  updateERC20AmountSelectedAtom,
  updateOfferAmountSelectedAtom,
  updateOfferERC20AmountSelectedAtom
} from "@src/jotai/atoms/swap";

interface UseBarterSwap {
  barterState: BarterState;
  setUserAAddress: (address: string) => void;
  setUserBAddress: (address: string) => void;
  clearUserAData: (address: string) => void;
  clearUserBData: (address: string) => void;
  toggleSelectionNFT: (nft: BarterNft) => void;
  toggleSelectionERC20: (erc20: BarterToken) => void;
  toggleOfferNFT: (nft: BarterNft) => void;
  toggleOfferERC20: (erc20: BarterToken) => void;
  updateAmountSelected: ({ nftAddress, nftId, newAmountSelected }: { nftAddress: string; nftId: string; newAmountSelected: number }) => void;
  updateOfferAmountSelected: ({ nftAddress, nftId, newAmountSelected }: { nftAddress: string; nftId: string; newAmountSelected: number }) => void;
  updateTokenAmountSelected: ({ tokenAddress, newAmountSelected }: { tokenAddress: string; newAmountSelected: number }) => void;
  updateTokenOfferAmountSelected: ({ tokenAddress, newAmountSelected }: { tokenAddress: string; newAmountSelected: number }) => void;
}

const useBarterSwap = (): UseBarterSwap => {
  const [barterState] = useAtom(barterStateAtom);

  const [, setUserAAddress] = useAtom(setUserAAddressAtom);
  const [, setUserBAddress] = useAtom(setUserBAddressAtom);
  const [, clearUserAData] = useAtom(clearUserADataAtom);
  const [, clearUserBData] = useAtom(clearUserBDataAtom);
  const [, toggleSelectionNFT] = useAtom(toggleUserANFTAtom);
  const [, toggleSelectionERC20] = useAtom(toggleUserAERC20Atom);
  const [, toggleOfferNFT] = useAtom(toggleOfferANFTAtom);
  const [, toggleOfferERC20] = useAtom(toggleOfferAERC20Atom);
  const [, updateAmountSelected] = useAtom(updateAmountSelectedAtom);
  const [, updateOfferAmountSelected] = useAtom(updateOfferAmountSelectedAtom);
  const [, updateTokenAmountSelected] = useAtom(updateERC20AmountSelectedAtom);
  const [, updateTokenOfferAmountSelected] = useAtom(updateOfferERC20AmountSelectedAtom);

  return {
    barterState,
    setUserAAddress,
    setUserBAddress,
    clearUserAData,
    clearUserBData,
    toggleSelectionNFT,
    toggleSelectionERC20,
    toggleOfferNFT,
    toggleOfferERC20,
    updateAmountSelected,
    updateOfferAmountSelected,
    updateTokenAmountSelected,
    updateTokenOfferAmountSelected
  };
};

export default useBarterSwap;

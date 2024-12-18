// store/barterStore.ts
import {atom} from 'jotai';
import {ciEquals} from "@market/helpers/utils";
import {atomWithReset} from "jotai/utils";

export interface BarterNft {
  nftAddress: string;
  nftId: string;
  name: string;
  image: string;
  balance: number;
  chainId: number;
  amountSelected: number;
}

export interface BarterToken {
  address: string;
  symbol: string;
  name: string;
  image?: string;
  amount: number;
  decimals: number;
  chainId: number;
}

export interface BarterState {
  taker: {
    address: string;
    nfts: BarterNft[];
    erc20: BarterToken[];
  };
  maker: {
    address: string;
    nfts: BarterNft[];
    erc20: BarterToken[];
  };
  startDate?: Date;
  endDate?: Date;
  duration?: number;
  parentId?: string;
  chainId: number;
}

export enum CreateDealStep {
  CHOOSE_CHAIN,
  CHOOSE_TAKER,
  CHOOSE_MAKER,
  CHOOSE_EXTRAS,
}

// Initial state for the barter deal
const initialBarterState: BarterState = {
  taker: {
    address: '',
    nfts: [],
    erc20: [],
  },
  maker: {
    address: '',
    nfts: [],
    erc20: [],
  },
  duration: 7 * 24 * 60 * 60 * 1000,
  chainId: 25
};

// Atom to hold the entire barter state
export const barterStateAtom = atomWithReset(initialBarterState);

export const setTakerAddressAtom = atom(
  null,
  (get, set, address: string) => {
    const currentState = get(barterStateAtom);
    if (currentState.taker.address !== address) {
      set(barterStateAtom, {
        ...currentState,
        taker: {
          ...currentState.taker,
          address: address,
          nfts: [],
          erc20: [],
        },
      });
    }
  }
);

export const setMakerAddressAtom = atom(
  null,
  (get, set, address: string) => {
    const currentState = get(barterStateAtom);
    if (currentState.maker.address !== address) {
      set(barterStateAtom, {
        ...currentState,
        maker: {
          ...currentState.maker,
          address: address,
          nfts: [],
          erc20: [],
        },
      });
    }
  }
);

export const clearTakerDataAtom = atom(
  null,
  (get, set) => {
    const currentState = get(barterStateAtom);
    set(barterStateAtom, {
      ...currentState,
      taker: {
        address: currentState.taker.address,
        nfts: [],
        erc20: [],
      },
    });
  }
);

// Atom to clear maker's data
export const clearMakerDataAtom = atom(
  null,
  (get, set) => {
    const currentState = get(barterStateAtom);
    set(barterStateAtom, {
      ...currentState,
      maker: {
        address: '',
        nfts: [],
        erc20: [],
      },
    });
  }
);

// Function to toggle NFTs in User A's selection
export const toggleTakerNFTAtom = atom(
  null,
  (get, set, nftToToggle: BarterNft) => {
    set(barterStateAtom, (prev) => {
      const existingNFTIndex = prev.taker.nfts.findIndex((nft) => ciEquals(nft.nftAddress, nftToToggle.nftAddress) && nft.nftId === nftToToggle.nftId);

      if (existingNFTIndex > -1) {
        // NFT is already selected, check the amountSelected
        const existingNFT = prev.taker.nfts[existingNFTIndex];
        if (existingNFT.amountSelected < nftToToggle.amountSelected) {
          // Increment the amountSelected by 1
          const updatedNFTs = [...prev.taker.nfts];
          updatedNFTs[existingNFTIndex] = { ...existingNFT, amountSelected: existingNFT.amountSelected + 1 };
          return { ...prev, taker: { ...prev.taker, nfts: updatedNFTs } };
        } else {
          // Max amountSelected reached, remove the NFT from selection
          return {
            ...prev,
            taker: {
              ...prev.taker,
              nfts: prev.taker.nfts.filter((_, index) => index !== existingNFTIndex),
            },
          };
        }
      } else {
        // NFT is not selected, add it with an amountSelected of 1
        return {
          ...prev,
          taker: {
            ...prev.taker,
            nfts: [...prev.taker.nfts, { ...nftToToggle, amountSelected: 1 }],
          },
        };
      }
    });
  }
);

// Function to toggle ERC20 tokens in User A's selection
export const toggleTakerERC20Atom = atom(
  null,
  (get, set, erc20: BarterToken) => {
    set(barterStateAtom, (prev) => {
      const erc20Tokens = prev.taker.erc20;
      const exists = erc20Tokens.find((item) => ciEquals(item.address, erc20.address));
      if (exists) {
        // If the token already exists, remove it
        return {
          ...prev,
          taker: {
            ...prev.taker,
            erc20: erc20Tokens.filter((item) => !ciEquals(item.symbol, erc20.symbol)),
          },
        };
      } else {
        // If the token doesn't exist, add it
        return {
          ...prev,
          taker: {
            ...prev.taker,
            erc20: [...erc20Tokens, erc20],
          },
        };
      }
    });
  }
);

// Function to toggle NFTs in User A's offer
export const toggleOfferANFTAtom = atom(
  null,
  (get, set, nftToToggle: BarterNft) => {
    set(barterStateAtom, (prev) => {
      const existingNFTIndex = prev.maker.nfts.findIndex((nft) => ciEquals(nft.nftAddress, nftToToggle.nftAddress) && nft.nftId === nftToToggle.nftId);

      if (existingNFTIndex > -1) {
        // NFT is already selected, check the amountSelected
        const existingNFT = prev.maker.nfts[existingNFTIndex];
        if (existingNFT.amountSelected < nftToToggle.amountSelected) {
          // Increment the amountSelected by 1
          const updatedNFTs = [...prev.maker.nfts];
          updatedNFTs[existingNFTIndex] = { ...existingNFT, amountSelected: existingNFT.amountSelected + 1 };
          return { ...prev, maker: { ...prev.maker, nfts: updatedNFTs } };
        } else {
          // Max amountSelected reached, remove the NFT from selection
          return {
            ...prev,
            maker: {
              ...prev.maker,
              nfts: prev.maker.nfts.filter((_, index) => index !== existingNFTIndex),
            },
          };
        }
      } else {
        // NFT is not selected, add it with an amountSelected of 1
        return {
          ...prev,
          maker: {
            ...prev.maker,
            nfts: [...prev.maker.nfts, { ...nftToToggle, amountSelected: 1 }],
          },
        };
      }
    });
  }
);

// Function to toggle ERC20 tokens in User A's offer
export const toggleOfferAERC20Atom = atom(
  null,
  (get, set, erc20: BarterToken) => {
    set(barterStateAtom, (prev) => {
      const erc20Tokens = prev.maker.erc20; // Note: maker stores what taker offers
      const exists = erc20Tokens.find((item) => ciEquals(item.symbol, erc20.symbol));
      if (exists) {
        // If the token already exists in the offer, remove it
        return {
          ...prev,
          maker: {
            ...prev.maker,
            erc20: erc20Tokens.filter((item) => !ciEquals(item.symbol, erc20.symbol)),
          },
        };
      } else {
        // If the token doesn't exist in the offer, add it
        return {
          ...prev,
          maker: {
            ...prev.maker,
            erc20: [...erc20Tokens, erc20],
          },
        };
      }
    });
  }
);

export const updateAmountSelectedAtom = atom(
  null,
  (get, set, { nftAddress, nftId, newAmountSelected }: { nftAddress: string; nftId: string; newAmountSelected: number }) => {
    set(barterStateAtom, (prev) => {
      const nfts = prev.taker.nfts;
      const nftIndex = nfts.findIndex(nft => ciEquals(nft.nftAddress, nftAddress) && nft.nftId === nftId);

      if (nftIndex === -1) {
        // NFT is not found in the selection, could optionally add it or do nothing
        console.warn("NFT not found in selection.");
        return prev; // Optionally, add NFT to selection here if that's desired behavior
      }

      // NFT found, update its amountSelected
      const updatedNFTs = [...nfts];
      const updatedNFT = { ...updatedNFTs[nftIndex], amountSelected: newAmountSelected };
      updatedNFTs[nftIndex] = updatedNFT;

      return {
        ...prev,
        taker: {
          ...prev.taker,
          nfts: updatedNFTs,
        },
      };
    });
  }
);

export const updateOfferAmountSelectedAtom = atom(
  null,
  (get, set, { nftAddress, nftId, newAmountSelected }: { nftAddress: string; nftId: string; newAmountSelected: number }) => {
    set(barterStateAtom, (prev) => {
      const nfts = prev.maker.nfts;
      const nftIndex = nfts.findIndex(nft => ciEquals(nft.nftAddress, nftAddress) && nft.nftId === nftId);

      if (nftIndex === -1) {
        // NFT is not found in the offer, could optionally add it or do nothing
        console.warn("NFT not found in offer.");
        return prev; // Optionally, add NFT to offer here if that's desired behavior
      }

      // NFT found, update its amountSelected
      const updatedNFTs = [...nfts];
      const updatedNFT = { ...updatedNFTs[nftIndex], amountSelected: newAmountSelected };
      updatedNFTs[nftIndex] = updatedNFT;

      return {
        ...prev,
        maker: {
          ...prev.maker,
          nfts: updatedNFTs,
        },
      };
    });
  }
);

export const updateERC20AmountSelectedAtom = atom(
  null,
  (get, set, { tokenAddress, newAmountSelected }: { tokenAddress: string; newAmountSelected: number }) => {
    set(barterStateAtom, (prev) => {
      // Assuming ERC20 token amounts are managed in a similar structure to NFTs
      const tokenIndex = prev.taker.erc20.findIndex(token => ciEquals(token.address, tokenAddress));

      if (tokenIndex === -1) {
        console.warn("ERC20 token not found in request.");
        return prev; // Optionally, add token to request here
      }

      const updatedTokens = [...prev.taker.erc20];
      updatedTokens[tokenIndex] = { ...updatedTokens[tokenIndex], amount: newAmountSelected };

      return {
        ...prev,
        taker: {
          ...prev.taker,
          erc20: updatedTokens,
        },
      };
    });
  }
);

export const updateOfferERC20AmountSelectedAtom = atom(
  null,
  (get, set, { tokenAddress, newAmountSelected }: { tokenAddress: string; newAmountSelected: number }) => {
    set(barterStateAtom, (prev) => {
      const tokenIndex = prev.maker.erc20.findIndex(token => ciEquals(token.address, tokenAddress));

      if (tokenIndex === -1) {
        console.warn("ERC20 token not found in offer.");
        return prev; // Optionally, add token to offer here
      }

      const updatedTokens = [...prev.maker.erc20];
      updatedTokens[tokenIndex] = { ...updatedTokens[tokenIndex], amount: newAmountSelected };

      return {
        ...prev,
        maker: {
          ...prev.maker,
          erc20: updatedTokens,
        },
      };
    });
  }
);

export const setStartDateAtom = atom(
  null,
  (get, set, startDate: Date) => {
    const currentState = get(barterStateAtom);
    set(barterStateAtom, {
      ...currentState,
      startDate
    });
  }
);

export const setEndDateAtom = atom(
  null,
  (get, set, endDate: Date) => {
    const currentState = get(barterStateAtom);
    set(barterStateAtom, {
      ...currentState,
      endDate
    });
  }
);

export const setDurationAtom = atom(
  null,
  (get, set, duration: number) => {
    const currentState = get(barterStateAtom);
    set(barterStateAtom, {
      ...currentState,
      duration
    });
  }
);

export const setParentIdAtom = atom(
  null,
  (get, set, id?: string) => {
    const currentState = get(barterStateAtom);
    if (currentState.parentId !== id) {
      set(barterStateAtom, {
        ...currentState,
       parentId: id
      });
    }
  }
);

export const setChainIdIdAtom = atom(
  null,
  (get, set, id: number) => {
    const currentState = get(barterStateAtom);
    if (currentState.chainId !== id) {
      set(barterStateAtom, {
        ...currentState,
        chainId: id
      });
    }
  }
);
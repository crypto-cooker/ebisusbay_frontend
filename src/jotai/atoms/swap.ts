// store/barterStore.ts
import {atom} from 'jotai';
import {ciEquals} from "@src/utils";

export interface BarterNft {
  nftAddress: string;
  nftId: string;
  name: string;
  image: string;
  balance: number;
  amountSelected: number;
}

export interface BarterToken {
  address: string;
  symbol: string;
  name: string;
  image: string;
  amount: number;
}

export interface BarterState {
  userA: {
    address: string;
    nfts: BarterNft[];
    erc20: BarterToken[];
  };
  userB: {
    address: string;
    nfts: BarterNft[];
    erc20: BarterToken[];
  };
}

// Initial state for the barter swap
const initialBarterState: BarterState = {
  userA: {
    address: '',
    nfts: [],
    erc20: [],
  },
  userB: {
    address: '',
    nfts: [],
    erc20: [],
  },
};

// Atom to hold the entire barter state
export const barterStateAtom = atom(initialBarterState);

export const setUserAAddressAtom = atom(
  null,
  (get, set, address: string) => {
    const currentState = get(barterStateAtom);
    if (currentState.userA.address !== address) {
      set(barterStateAtom, {
        ...currentState,
        userA: {
          ...currentState.userA,
          address: address,
          nfts: [],
          erc20: [],
        },
      });
    }
  }
);

export const setUserBAddressAtom = atom(
  null,
  (get, set, address: string) => {
    const currentState = get(barterStateAtom);
    if (currentState.userB.address !== address) {
      set(barterStateAtom, {
        ...currentState,
        userB: {
          ...currentState.userB,
          address: address,
          nfts: [],
          erc20: [],
        },
      });
    }
  }
);

export const clearUserADataAtom = atom(
  null,
  (get, set) => {
    const currentState = get(barterStateAtom);
    set(barterStateAtom, {
      ...currentState,
      userA: {
        address: '',
        nfts: [],
        erc20: [],
      },
    });
  }
);

// Atom to clear userB's data
export const clearUserBDataAtom = atom(
  null,
  (get, set) => {
    const currentState = get(barterStateAtom);
    set(barterStateAtom, {
      ...currentState,
      userB: {
        address: '',
        nfts: [],
        erc20: [],
      },
    });
  }
);

// Function to toggle NFTs in User A's selection
export const toggleUserANFTAtom = atom(
  null,
  (get, set, nftToToggle: BarterNft) => {
    set(barterStateAtom, (prev) => {
      const existingNFTIndex = prev.userA.nfts.findIndex((nft) => ciEquals(nft.nftAddress, nftToToggle.nftAddress) && nft.nftId === nftToToggle.nftId);

      if (existingNFTIndex > -1) {
        // NFT is already selected, check the amountSelected
        const existingNFT = prev.userA.nfts[existingNFTIndex];
        if (existingNFT.amountSelected < nftToToggle.amountSelected) {
          // Increment the amountSelected by 1
          const updatedNFTs = [...prev.userA.nfts];
          updatedNFTs[existingNFTIndex] = { ...existingNFT, amountSelected: existingNFT.amountSelected + 1 };
          return { ...prev, userA: { ...prev.userA, nfts: updatedNFTs } };
        } else {
          // Max amountSelected reached, remove the NFT from selection
          return {
            ...prev,
            userA: {
              ...prev.userA,
              nfts: prev.userA.nfts.filter((_, index) => index !== existingNFTIndex),
            },
          };
        }
      } else {
        // NFT is not selected, add it with an amountSelected of 1
        return {
          ...prev,
          userA: {
            ...prev.userA,
            nfts: [...prev.userA.nfts, { ...nftToToggle, amountSelected: 1 }],
          },
        };
      }
    });
  }
);

// Function to toggle ERC20 tokens in User A's selection
export const toggleUserAERC20Atom = atom(
  null,
  (get, set, erc20: BarterToken) => {
    set(barterStateAtom, (prev) => {
      const erc20Tokens = prev.userA.erc20;
      const exists = erc20Tokens.find((item) => item.symbol === erc20.symbol);
      if (exists) {
        // If the token already exists, remove it
        return {
          ...prev,
          userA: {
            ...prev.userA,
            erc20: erc20Tokens.filter((item) => item.symbol !== erc20.symbol),
          },
        };
      } else {
        // If the token doesn't exist, add it
        return {
          ...prev,
          userA: {
            ...prev.userA,
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
      const existingNFTIndex = prev.userB.nfts.findIndex((nft) => ciEquals(nft.nftAddress, nftToToggle.nftAddress) && nft.nftId === nftToToggle.nftId);

      if (existingNFTIndex > -1) {
        // NFT is already selected, check the amountSelected
        const existingNFT = prev.userB.nfts[existingNFTIndex];
        if (existingNFT.amountSelected < nftToToggle.amountSelected) {
          // Increment the amountSelected by 1
          const updatedNFTs = [...prev.userB.nfts];
          updatedNFTs[existingNFTIndex] = { ...existingNFT, amountSelected: existingNFT.amountSelected + 1 };
          return { ...prev, userB: { ...prev.userB, nfts: updatedNFTs } };
        } else {
          // Max amountSelected reached, remove the NFT from selection
          return {
            ...prev,
            userB: {
              ...prev.userB,
              nfts: prev.userB.nfts.filter((_, index) => index !== existingNFTIndex),
            },
          };
        }
      } else {
        // NFT is not selected, add it with an amountSelected of 1
        return {
          ...prev,
          userB: {
            ...prev.userB,
            nfts: [...prev.userB.nfts, { ...nftToToggle, amountSelected: 1 }],
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
      const erc20Tokens = prev.userB.erc20; // Note: userB stores what userA offers
      const exists = erc20Tokens.find((item) => item.symbol === erc20.symbol);
      if (exists) {
        // If the token already exists in the offer, remove it
        return {
          ...prev,
          userB: {
            ...prev.userB,
            erc20: erc20Tokens.filter((item) => item.symbol !== erc20.symbol),
          },
        };
      } else {
        // If the token doesn't exist in the offer, add it
        return {
          ...prev,
          userB: {
            ...prev.userB,
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
      const nfts = prev.userA.nfts;
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
        userA: {
          ...prev.userA,
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
      const nfts = prev.userB.nfts;
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
        userB: {
          ...prev.userB,
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
      const tokenIndex = prev.userA.erc20.findIndex(token => ciEquals(token.address, tokenAddress));

      if (tokenIndex === -1) {
        console.warn("ERC20 token not found in request.");
        return prev; // Optionally, add token to request here
      }

      const updatedTokens = [...prev.userA.erc20];
      updatedTokens[tokenIndex] = { ...updatedTokens[tokenIndex], amount: newAmountSelected };

      return {
        ...prev,
        userA: {
          ...prev.userA,
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
      const tokenIndex = prev.userB.erc20.findIndex(token => ciEquals(token.address, tokenAddress));

      if (tokenIndex === -1) {
        console.warn("ERC20 token not found in offer.");
        return prev; // Optionally, add token to offer here
      }

      const updatedTokens = [...prev.userB.erc20];
      updatedTokens[tokenIndex] = { ...updatedTokens[tokenIndex], amount: newAmountSelected };

      return {
        ...prev,
        userB: {
          ...prev.userB,
          erc20: updatedTokens,
        },
      };
    });
  }
);

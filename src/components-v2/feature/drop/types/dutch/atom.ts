// atoms.ts
import {atom} from 'jotai';
import {Contract} from "ethers";
import {Drop} from "@src/core/models/drop";
import {DropState} from "@src/core/api/enums";

interface AuctionData {
  drop?: Drop;
  readContract?: Contract;
  writeContract?: Contract;
  startPrice: number;
  currentRound: number;
  currentPrice: number;
  isUsingContract: boolean;
  status: DropState;
  refundDue: number;
  nextRoundTime: number;
  maxSupply: number;
  refreshContract: () => void;
  availableTokenCount: number;
  currentSupply: number;
  canMint: number;
  address: string;
  userBalance: number;
  onUserMinted: () => void;
}

export const dutchAuctionDataAtom = atom<AuctionData>({
  startPrice: 0,
  currentRound: -1,
  currentPrice: 0,
  isUsingContract: false,
  status: DropState.UNSET,
  refundDue: 0,
  nextRoundTime: 0,
  maxSupply: 0,
  refreshContract: () => {},
  availableTokenCount: 0,
  currentSupply: 0,
  canMint: 0,
  address: '',
  userBalance: 0,
  onUserMinted: () => {},
});

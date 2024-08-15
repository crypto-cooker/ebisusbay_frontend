// atoms.ts
import {atom} from 'jotai';
import {Contract} from "ethers";
import {Drop} from "@src/core/models/drop";
import {DropState} from "@src/core/api/enums";


interface RyoshiWithKnifeData {
  readContract?: Contract;
  writeContract?: Contract;
  address: string;
  isUsingContract: boolean;
  status: DropState;
  maxSupply: number;
  currentSupply: number;
  refreshContract: () => void;
  availableTokenCount: number;
  userBalance: number;
  userContribution: number;
  onUserMinted: (address: string) => void;
  endTime: number;
  startTime: number;
}

export const rwkDataAtom = atom<RyoshiWithKnifeData>({
  address: '',
  isUsingContract: false,
  status: DropState.UNSET,
  maxSupply: 0,
  currentSupply: 0,
  refreshContract: () => {},
  availableTokenCount: 0,
  userBalance: 0,
  userContribution: 0,
  onUserMinted: (address: string) => {},
  endTime: 0,
  startTime: 0,
});

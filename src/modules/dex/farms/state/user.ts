import {atom, useSetAtom} from "jotai";
import {atomWithReset} from "jotai/utils";

export interface UserFarmState {
  address: string;
  approved: boolean;
  stakedBalance: bigint;
  earnings: bigint;
  tokenBalance: bigint;
}

export interface UserFarms {
  [address: string]: UserFarmState;
}

// Initial states
const initialApprovals: { [address: string]: boolean } = {};
const initialBalances: { [address: string]: { balance: number; harvestable: number; available: number } } = {};

// Atoms for individual data pieces
export const approvalsAtom = atom<{ [address: string]: boolean }>(initialApprovals);
export const balancesAtom = atom<{ [address: string]: { balance: number; harvestable: number; available: number } }>(initialBalances);

// Refetch trigger atoms
export const refetchApprovalsAtom = atomWithReset<number>(0);
export const refetchBalancesAtom = atomWithReset<number>(0);

// Derived atom to combine data into user farms
export const userFarmsAtom = atom((get) => {
  const approvals = get(approvalsAtom);
  const balances = get(balancesAtom);
  const userFarms: UserFarms = {};

  Object.keys(approvals).forEach((address) => {
    userFarms[address] = {
      address,
      approved: approvals[address],
      stakedBalance: BigInt(balances[address]?.balance || 0),
      earnings: BigInt(balances[address]?.harvestable || 0),
      tokenBalance: BigInt(balances[address]?.available || 0),
    };
  });

  return userFarms;
});
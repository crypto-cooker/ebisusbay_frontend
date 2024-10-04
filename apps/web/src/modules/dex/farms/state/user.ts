import {atom} from "jotai";
import {atomWithReset} from "jotai/utils";

export interface UserFarmState {
  address: string;
  approved: boolean;
  stakedBalance: bigint;
  earnings: FarmEmissionToken[];
  tokenBalance: bigint;
}

export interface UserFarmBalances {
  stakedBalance: bigint;
  earnings: FarmEmissionToken[];
  tokenBalance: bigint;
}

export interface MappedUserFarmBalances {
  [address: string]: UserFarmBalances;
}

export interface FarmEmissionToken {
  address: string;
  amount: bigint;
}

export interface UserFarmBoost {
  boost: string;
  chainId: number;
  claimAmount: string;
  claimAt: string;
  createdAt: string;
  farmApr: string;
  farmId: number;
  heroBoost: string;
  id: number;
  profileId: number;
  status: string;
  troops: number;
  updatedAt: string;
  usdDeposit: number;
}

export interface UserFarms {
  [address: string]: UserFarmState;
}

// Initial states
const initialApprovals: { [address: string]: boolean } = {};
const initialBalances: MappedUserFarmBalances = {};
const initialBoosts: UserFarmBoost[] = [];

// Atoms for individual data pieces
export const approvalsAtom = atomWithReset<{ [address: string]: boolean }>(initialApprovals);
export const balancesAtom = atomWithReset<MappedUserFarmBalances>(initialBalances);
export const boostsAtom = atom<UserFarmBoost[]>(initialBoosts);

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
      stakedBalance: BigInt(balances[address]?.stakedBalance || 0),
      earnings: balances[address]?.earnings.map(earning => ({...earning, amount: BigInt(earning.amount)})) ?? [],
      tokenBalance: BigInt(balances[address]?.tokenBalance || 0),
    };
  });

  return userFarms;
});
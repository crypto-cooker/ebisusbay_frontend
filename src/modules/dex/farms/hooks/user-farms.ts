import {useAtom, useSetAtom} from "jotai";
import {
  approvalsAtom,
  balancesAtom,
  refetchApprovalsAtom,
  refetchBalancesAtom,
  userFarmsAtom
} from "@dex/farms/state/user";
import {useEffect} from "react";
import {Contract, ethers} from "ethers";
import FarmsAbi from "@src/global/contracts/Farms.json";
import {multicall} from "@wagmi/core";
import {Address} from "wagmi";
import LpAbi from "@src/global/contracts/LP.json";
import {appConfig} from "@src/Config";
import {useUser} from "@src/components-v2/useUser";
import {ApiService} from "@src/core/services/api-service";

const config = appConfig();
const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);


export const useUserFarms = () => {
  const [userFarms] = useAtom(userFarmsAtom);
  return userFarms;
}

export const fetchApprovals = async (userAddress: string) => {
  const readContract = new Contract(config.contracts.farms, FarmsAbi, readProvider);
  const poolLength = await readContract.poolLength();

  const poolInfo = await multicall({
    contracts: [...Array(parseInt(poolLength)).fill(0)].map((_, i) => (
      {
        address: config.contracts.farms as Address,
        abi: FarmsAbi as any,
        functionName: 'poolInfo',
        args: [i],
      }
    )),
  });

  const lpAddresses = poolInfo.slice(1).map((pool: any) => {
    const [lpToken] = pool.result;
    return lpToken
  });

  const approvalInfo = await multicall({
    contracts: lpAddresses.map((address, i) => (
      {
        address: address as Address,
        abi: LpAbi as any,
        functionName: 'allowance',
        args: [userAddress, config.contracts.farms],
      }
    )),
  });

  return approvalInfo.reduce((acc: any, approval: any, i: number) => {
    acc[lpAddresses[i].toLowerCase()] = approval.status === 'success' ? approval.result > 0 : false
    return acc;
  }, {});
};

// Fetch balances from the REST API
export const fetchBalances = async (userAddress: string) => {
  const readContract = new Contract(config.contracts.farms, FarmsAbi, readProvider);
  const poolLength = await readContract.poolLength();

  const poolInfo = await multicall({
    contracts: [...Array(parseInt(poolLength)).fill(0)].map((_, i) => (
      {
        address: config.contracts.farms as Address,
        abi: FarmsAbi as any,
        functionName: 'poolInfo',
        args: [i],
      }
    )),
  });

  const lpAddresses = poolInfo.slice(1).map((pool: any) => {
    const [lpToken] = pool.result;
    return lpToken
  });

  const lpBalances = await multicall({
    contracts: lpAddresses.map((address, i) => (
      {
        address: address as Address,
        abi: LpAbi as any,
        functionName: 'balanceOf',
        args: [userAddress],
      }
    )),
  });

  let balances = lpBalances.reduce((acc: any, approval: any, i: number) => {
    acc[lpAddresses[i].toLowerCase()] = {
      available: approval.status === 'success' ? approval.result : 0,
      balance: 0,
      harvestable: 0
    }
    return acc;
  }, {});



  const harvestableBalances = await multicall({
    contracts: poolInfo.map((pool: any, pid: number) => (
      {
        address: config.contracts.farms as Address,
        abi: FarmsAbi as any,
        functionName: 'pendingFRTN',
        args: [pid, userAddress],
      }
    )),
  });

  poolInfo.forEach((pool, i) => {
    if (i === 0) return;
    balances[pool.result![0].toLowerCase()].harvestable = harvestableBalances[i].result;
  });

  const farmsUser = await ApiService.withoutKey().getFarmsUser(userAddress);
  farmsUser.forEach((user, i) => {
    balances[user.pool.pair.toLowerCase()].balance = BigInt(user.amount);
  });

  return balances;
};

// Hook to fetch approvals
export const useFetchApprovals = () => {
  const user = useUser();
  const setApprovals = useSetAtom(approvalsAtom);
  const [refetchCounter, setRefetchCounter] = useAtom(refetchApprovalsAtom);

  useEffect(() => {
    const fetchData = async () => {
      const approvals = await fetchApprovals(user.address!);
      setApprovals(approvals);
    };

    if (user.address) {
      fetchData();
    }
  }, [refetchCounter, setApprovals, user.address]);

  const refetch = () => {
    setRefetchCounter((prev) => prev + 1);
  };

  return refetch;
};

// Hook to fetch balances
export const useFetchBalances = () => {
  const user = useUser();
  const setBalances = useSetAtom(balancesAtom);
  const [refetchCounter, setRefetchCounter] = useAtom(refetchBalancesAtom);

  useEffect(() => {
    const fetchData = async () => {
      const balances = await fetchBalances(user.address!);
      setBalances(balances);
    };

    if (user.address) {
      fetchData();
    }
  }, [refetchCounter, setBalances, user.address]);

  const refetch = () => {
    setRefetchCounter((prev) => prev + 1);
  };

  return refetch;
};
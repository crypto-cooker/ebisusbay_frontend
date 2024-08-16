import {useAtom, useSetAtom} from "jotai";
import {approvalsAtom, balancesAtom, userFarmsAtom} from "@dex/farms/state/user";
import {useContext} from "react";
import {Contract, ethers} from "ethers";
import FarmsAbi from "@src/global/contracts/Farms.json";
import LpAbi from "@src/global/contracts/LP.json";
import {useUser} from "@src/components-v2/useUser";
import {ApiService} from "@src/core/services/api-service";
import {UserFarmsRefetchContext} from "@dex/farms/components/provider";
import {wagmiConfig} from "@src/wagmi";
import {Address} from "viem";
import {readContracts} from "@wagmi/core";
import {useActiveChainId} from "@eb-pancakeswap-web/hooks/useActiveChainId";
import {getAppChainConfig} from "@src/config/hooks";
import {ChainId} from "@pancakeswap/chains";

export const useUserFarms = () => {
  const [userFarms] = useAtom(userFarmsAtom);
  return userFarms;
}

export const fetchApprovals = async (userAddress: string, chainId: number) => {
  const config = getAppChainConfig(chainId);
  const readProvider = new ethers.providers.JsonRpcProvider(config.chain.rpcUrls.default.http[0]);
  const readContract = new Contract(config.contracts.farms, FarmsAbi, readProvider);
  const poolLength = await readContract.poolLength();

  const poolInfo = await readContracts(wagmiConfig, {
    contracts: [...Array(parseInt(poolLength)).fill(0)].map((_, i) => (
      {
        address: config.contracts.farms,
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

  const approvalInfo = await readContracts(wagmiConfig, {
    contracts: lpAddresses.map((address, i) => (
      {
        address: address,
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
export const fetchBalances = async (userAddress: string, chainId: number) => {
  const config = getAppChainConfig(chainId);
  const readProvider = new ethers.providers.JsonRpcProvider(config.chain.rpcUrls.default.http[0]);
  const readContract = new Contract(config.contracts.farms, FarmsAbi, readProvider);
  const poolLength = await readContract.poolLength();

  const poolInfo = await readContracts(wagmiConfig, {
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

  const lpBalances = await readContracts(wagmiConfig, {
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
      tokenBalance: approval.status === 'success' ? approval.result : 0,
      stakedBalance: 0,
      earnings: 0
    }
    return acc;
  }, {});



  const harvestableBalances = await readContracts(wagmiConfig, {
    contracts: poolInfo.map((pool: any, pid: number) => (
      {
        address: config.contracts.farms as Address,
        abi: FarmsAbi as any,
        functionName: 'pendingTokens',
        args: [pid, userAddress],
      }
    )),
  });


  poolInfo.forEach((pool, i) => {
    if (i === 0) return;
    // @ts-ignore
    let tokens = harvestableBalances[i].result?.[0] as string[];
    // @ts-ignore
    let amounts = harvestableBalances[i].result?.[1] as bigint[];
    if (chainId === ChainId.CRONOS_ZKEVM) {
      tokens = tokens.slice(1);
      amounts = amounts.slice(1);
    }
    // @ts-ignore
    balances[pool.result![0].toLowerCase()].earnings = tokens.map((token) => ({
      address: token,
      amount: amounts[tokens.indexOf(token)]
    }));
  });


  const farmsUser = await ApiService.forChain(chainId).getFarmsUser(userAddress);
  farmsUser.forEach((user, i) => {
    balances[user.pool.pair.toLowerCase()].stakedBalance = BigInt(user.amount);
  });
  return balances;
};

// Hook to fetch approvals
export const useFetchApprovals = () => {
  const user = useUser();
  const setApprovals = useSetAtom(approvalsAtom);
  const {chainId} = useActiveChainId();
  // const [refetchCounter, setRefetchCounter] = useAtom(refetchApprovalsAtom);

  const fetchData = async () => {
    if (!user.address) return;
    const approvals = await fetchApprovals(user.address, chainId);
    setApprovals(approvals);
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const approvals = await fetchApprovals(user.address!);
  //     setApprovals(approvals);
  //   };
  //
  //   if (user.address) {
  //     fetchData();
  //   }
  // }, [refetchCounter, setApprovals, user.address]);
  //
  // const refetch = () => {
  //   setRefetchCounter((prev) => prev + 1);
  // };

  return fetchData;
};

// Hook to fetch balances
export const useFetchBalances = () => {
  const user = useUser();
  const setBalances = useSetAtom(balancesAtom);
  const {chainId} = useActiveChainId();
  // const [refetchCounter, setRefetchCounter] = useAtom(refetchBalancesAtom);

  const fetchData = async () => {
    if (!user.address) return;
    const balances = await fetchBalances(user.address!, chainId);
    setBalances(balances);
  };

  return fetchData;

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const balances = await fetchBalances(user.address!);
  //     setBalances(balances);
  //   };
  //
  //   if (user.address) {
  //     fetchData();
  //   }
  // }, [refetchCounter, setBalances, user.address]);
  //
  // const refetch = () => {
  //   setRefetchCounter((prev) => prev + 1);
  // };
  //
  // return refetch;
};

export const useUserFarmsRefetch = () => {
  const context = useContext(UserFarmsRefetchContext);
  if (!context) {
    throw new Error('useUserFarmsRefetch must be used within a UserFarmsRefetchProvider');
  }
  return context;
};
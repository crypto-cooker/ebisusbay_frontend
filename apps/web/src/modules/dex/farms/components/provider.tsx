import {createContext, ReactNode, useEffect} from "react";
import {useUser} from "@src/components-v2/useUser";
import {useFetchApprovals, useFetchBalances} from "@dex/farms/hooks/user-farms";
import {useResetAtom} from "jotai/utils";
import {approvalsAtom, balancesAtom, boostsAtom, mitamaAtom} from "@dex/farms/state/user";
import {useActiveChainId} from "@eb-pancakeswap-web/hooks/useActiveChainId";
import {useQuery} from "@tanstack/react-query";
import {ApiService} from "@src/core/services/api-service";
import {useAtom, useSetAtom} from "jotai";
import { SUPPORTED_RD_CHAIN_CONFIGS } from "@src/config/chains";

interface RefetchContextProps {
  refetchApprovals: () => void;
  refetchBalances: () => void;
  refetchBoosts: () => void;
}

export const UserFarmsRefetchContext = createContext<RefetchContextProps | undefined>(undefined);

export const UserFarmsRefetchProvider = ({ children, refetchApprovals, refetchBalances, refetchBoosts }: { children: ReactNode } & RefetchContextProps) => {
  return (
    <UserFarmsRefetchContext.Provider value={{
      refetchApprovals,
      refetchBalances,
      refetchBoosts
    }}>
      {children}
    </UserFarmsRefetchContext.Provider>
  );
};

export default function UserFarmsProvider({ children }: { children: ReactNode }) {
  const user = useUser();
  const {chainId} = useActiveChainId();
  const fetchApprovals = useFetchApprovals();
  const fetchBalances = useFetchBalances();
  const resetApprovals = useResetAtom(approvalsAtom);
  const resetBalances = useResetAtom(balancesAtom);
  const setBoosts = useSetAtom(boostsAtom);
  const setMitama = useSetAtom(mitamaAtom);

  const { data: userFarmBoosts, refetch: refetchBoosts } = useQuery({
    queryKey: ['FarmBoosts', user.address],
    queryFn: async () => ApiService.withoutKey().ryoshiDynasties.getFarmBoosts(user.address!, true),
    refetchOnWindowFocus: false,
    enabled: !!user.address,
  });

  const {data: mitamaBalance} = useQuery({
    queryKey: ['UserFrtnMitamaBalances', user.address],
    queryFn: async () => {
      let totalMitama = 0;
      for (const chainConfig of SUPPORTED_RD_CHAIN_CONFIGS) {
        const account = await ApiService.forChain(chainConfig.chain.id).ryoshiDynasties.getErc20Account(user!.address!);
        if (account) {
          totalMitama += Number(account.mitamaBalance);
        }
      }

      return totalMitama;
    },
    refetchOnWindowFocus: false,
    enabled: !!user.address
  });

  useEffect(() => {
    if (user.address) {
      fetchApprovals();
      fetchBalances();
    } else {
      resetApprovals();
      resetBalances();
    }
  }, [user.address, chainId]);

  useEffect(() => {
    if (user.address) {
      setBoosts(userFarmBoosts);
    }
  }, [userFarmBoosts, user.address]);

  useEffect(() => {
    if (user.address) {
      setMitama(mitamaBalance ?? 0);
    }
  }, [user.address, mitamaBalance]);

  return (
    <UserFarmsRefetchProvider
      refetchApprovals={fetchApprovals}
      refetchBalances={fetchBalances}
      refetchBoosts={refetchBoosts}
    >
      {children}
    </UserFarmsRefetchProvider>
  );
}
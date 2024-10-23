import {createContext, ReactNode, useEffect} from "react";
import {useUser} from "@src/components-v2/useUser";
import {useFetchApprovals, useFetchBalances} from "@dex/farms/hooks/user-farms";
import {useResetAtom} from "jotai/utils";
import {approvalsAtom, balancesAtom, boostsAtom, mitamaAtom} from "@dex/farms/state/user";
import {useActiveChainId} from "@eb-pancakeswap-web/hooks/useActiveChainId";
import {useQuery} from "@tanstack/react-query";
import {ApiService} from "@src/core/services/api-service";
import {useAtom, useSetAtom} from "jotai";

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

  const {data: frtnAndMitamaBalances} = useQuery({
    queryKey: ['UserFrtnMitamaBalances', user.address],
    queryFn: () => ApiService.withoutKey().ryoshiDynasties.getErc20Account(user!.address!),
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
      setMitama(frtnAndMitamaBalances ? parseInt(frtnAndMitamaBalances?.mitamaBalance) : 0);
    }
  }, [user.address, frtnAndMitamaBalances]);

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
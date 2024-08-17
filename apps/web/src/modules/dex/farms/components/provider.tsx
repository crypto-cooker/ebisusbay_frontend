import {createContext, ReactNode, useEffect} from "react";
import {useUser} from "@src/components-v2/useUser";
import {useFetchApprovals, useFetchBalances} from "@dex/farms/hooks/user-farms";
import {useResetAtom} from "jotai/utils";
import {approvalsAtom, balancesAtom} from "@dex/farms/state/user";
import {useActiveChainId} from "@eb-pancakeswap-web/hooks/useActiveChainId";

interface RefetchContextProps {
  refetchApprovals: () => void;
  refetchBalances: () => void;
}

export const UserFarmsRefetchContext = createContext<RefetchContextProps | undefined>(undefined);

export const UserFarmsRefetchProvider = ({ children, refetchApprovals, refetchBalances }: { children: ReactNode, refetchApprovals: () => void, refetchBalances: () => void }) => {
  return (
    <UserFarmsRefetchContext.Provider value={{ refetchApprovals, refetchBalances }}>
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

  useEffect(() => {
    if (user.address) {
      fetchApprovals();
      fetchBalances();
    } else {
      resetApprovals();
      resetBalances();
    }
  }, [user.address, chainId]);

  return (
    <UserFarmsRefetchProvider refetchApprovals={fetchApprovals} refetchBalances={fetchBalances}>
      {children}
    </UserFarmsRefetchProvider>
  );
}
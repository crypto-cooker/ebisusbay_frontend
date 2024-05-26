import {createContext, ReactNode, useEffect} from "react";
import {useUser} from "@src/components-v2/useUser";
import {useFetchApprovals, useFetchBalances} from "@dex/farms/hooks/user-farms";

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
  const fetchApprovals = useFetchApprovals();
  const fetchBalances = useFetchBalances();

  useEffect(() => {
    if (user.address) {
      fetchApprovals();
      fetchBalances();
    }
  }, [user.address]);

  return (
    <UserFarmsRefetchProvider refetchApprovals={fetchApprovals} refetchBalances={fetchBalances}>
      {children}
    </UserFarmsRefetchProvider>
  );
}
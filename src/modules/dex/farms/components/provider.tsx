import {ReactNode, useEffect} from "react";
import {useUser} from "@src/components-v2/useUser";
import {useFetchApprovals, useFetchBalances} from "@dex/farms/hooks/user-farms";

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

  return <>{children}</>;
}
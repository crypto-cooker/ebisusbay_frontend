import {useState} from "react";
import {parseErrorMessage} from "@src/helpers/validator";
import {toast} from "react-toastify";
import {appConfig} from "@src/config";
import {Contract, ethers} from "ethers";
import {useUser} from "@src/components-v2/useUser";
import FarmsAbi from "@src/global/contracts/Farms.json";
import LpAbi from "@src/global/contracts/LP.json";
import {useUserFarmsRefetch} from "@dex/farms/hooks/user-farms";

const config = appConfig()

export function useEnableFarm() {
  const user = useUser();
  const { refetchApprovals } = useUserFarmsRefetch();
  const [executing, setExecuting] = useState(false);

  const enable = async (pairAddress: string) => {
    if (!user.address) {
      user.connect();
      return;
    }

    try {
      setExecuting(true);
      const contract = new Contract(pairAddress, LpAbi, user.provider.signer);
      const tx = await contract.approve(config.contracts.farms, ethers.constants.MaxUint256);
      await tx.wait();
      refetchApprovals();
    } catch (e) {
      console.log(e);
      toast.error(parseErrorMessage(e));
    } finally {
      setExecuting(false);
    }
  }

  return [enable, executing] as const;
}

export function useHarvestRewards() {
  const user = useUser();
  const { refetchBalances } = useUserFarmsRefetch();
  const [executing, setExecuting] = useState(false);

  const enable = async (pid: number) => {
    try {
      setExecuting(true);
      const contract = new Contract(config.contracts.farms, FarmsAbi, user.provider.signer);
      const tx = await contract.withdraw(pid, 0);
      await tx.wait();
      refetchBalances();
    } catch (e) {
      console.log(e);
      toast.error(parseErrorMessage(e));
    } finally {
      setExecuting(false);
    }
  }

  return [enable, executing] as const;
}
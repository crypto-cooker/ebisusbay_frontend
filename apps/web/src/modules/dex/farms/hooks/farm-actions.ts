import { useState } from "react";
import { parseErrorMessage } from "@src/helpers/validator";
import { toast } from "react-toastify";
import { Contract, ethers } from "ethers";
import { useUser } from "@src/components-v2/useUser";
import FarmsAbi from "@src/global/contracts/Farms.json";
import LpAbi from "@src/global/contracts/LP.json";
import { useUserFarmsRefetch } from "@dex/farms/hooks/user-farms";
import { useWriteContract } from "wagmi";
import { useActiveChainId } from "@eb-pancakeswap-web/hooks/useActiveChainId";
import { Address } from "viem";
import { useAppChainConfig } from "@src/config/hooks";
import { multicall } from "@wagmi/core";

export function useEnableFarm() {
  const user = useUser();
  const { chainId } = useActiveChainId();
  const { refetchApprovals } = useUserFarmsRefetch();
  const [executing, setExecuting] = useState(false);
  const { writeContractAsync } = useWriteContract();
  const { config } = useAppChainConfig();

  const enable = async (pairAddress: string) => {
    if (!user.address) {
      user.connect();
      return;
    }

    try {
      setExecuting(true);
      await writeContractAsync({
        abi: LpAbi,
        address: pairAddress as Address,
        functionName: 'approve',
        args: [
          config.contracts.farms,
          ethers.constants.MaxUint256
        ],
        chainId
      })
      // const contract = new Contract(pairAddress, LpAbi, user.provider.signer);
      // const tx = await contract.approve(config.contracts.farms, ethers.constants.MaxUint256);
      // await tx.wait();
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
  const { config: appChainConfig } = useAppChainConfig();
  const { refetchBalances } = useUserFarmsRefetch();
  const [executing, setExecuting] = useState(false);

  const enable = async (pid: number) => {
    try {
      setExecuting(true);
      const contract = new Contract(appChainConfig.contracts.farms, FarmsAbi, user.provider.signer);
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

export function useHavestAll() {
  const user = useUser();
  const { chainId } = useActiveChainId();
  const { refetchApprovals } = useUserFarmsRefetch();
  const [executing, setExecuting] = useState(false);
  const { writeContractAsync } = useWriteContract();
  const { config } = useAppChainConfig();

  const enable = async (pairAddresses: string[]) => {
    if (!user.address) {
      user.connect();
      return;
    }

    const contracts: any = pairAddresses.map(() => {
      return {
        address: config.contracts.farms,
        abi: FarmsAbi,
        functionName: "withdraw",
        args:[]
      }
    })


    try {
      setExecuting(true);
      const data = await multicall(config, {
        contracts
      })
      refetchApprovals();
    } catch (e) {
      console.log(e);
      toast.error(parseErrorMessage(e));
    } finally {
      setExecuting(false);
    }
  }

}
import {useUser} from "@src/components-v2/useUser";
import React, {useState} from "react";
import {BigNumber, BigNumberish, Contract, ethers} from "ethers";
import {ERC20, ERC721} from "@src/global/contracts/Abis";
import {toast} from "react-toastify";
import {parseErrorMessage} from "@src/helpers/validator";
import {Box, Flex} from "@chakra-ui/react";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import {appConfig} from "@src/config";
import { getAppChainConfig, useAppChainConfig } from "@src/config/hooks";
import { useChainId } from "wagmi";

interface NftApprovalButtonProps {
  nft: {name: string, address: string};
  onApproved: (address: string, value: boolean) => void;
}

export const NftApprovalButton = ({nft, onApproved}: NftApprovalButtonProps) => {

  const user = useUser();
  const chainId = useChainId();
  const {config} = useAppChainConfig(chainId);
  const [isApproving, setIsApproving] = useState(false);

  const handleApproval = async () => {
    try {
      setIsApproving(true);
      const contract = new Contract(nft.address, ERC721, user.provider.getSigner());
      const tx = await contract.setApprovalForAll(config.contracts.market, true);
      await tx.wait();
      toast.success('Approval successful');
      onApproved(nft.address, true);
    } catch (e) {
      console.log(e);
      toast.error(parseErrorMessage(e));
    } finally {
      setIsApproving(false);
    }
  }

  return (
    <Flex justify='space-between' direction='column' h='full'>
      <Box>{nft.name}</Box>
      <PrimaryButton
        onClick={handleApproval}
        isLoading={isApproving}
        isDisabled={isApproving}
      >
        Approve
      </PrimaryButton>
    </Flex>
  )
}

interface Erc20ApprovalButtonProps {
  token: {name: string, address: string, amountWei: BigNumberish, decimals?: number};
  onApproved: (address: string, value: boolean) => void;
}

export const Erc20ApprovalButton = ({token, onApproved}: Erc20ApprovalButtonProps) => {
  const user = useUser();
  const chainId = useChainId();
  const {config} = useAppChainConfig(chainId);
  const [isApproving, setIsApproving] = useState(false);
  

  const handleApproval = async () => {
    try {
      setIsApproving(true);
      const approvalAmount = token.amountWei;
      const contract = new Contract(token.address, ERC20, user.provider.getSigner());
      const tx = await contract.approve(config.contracts.market, approvalAmount);
      await tx.wait();
      toast.success('Approval successful');
      onApproved(token.address, true);
    } catch (e) {
      console.log(e);
      toast.error(parseErrorMessage(e));
    } finally {
      setIsApproving(false);
    }
  }

  return (
    <Flex justify='space-between' direction='column' h='full'>
      <Box>{token.name}</Box>
      <PrimaryButton
        onClick={handleApproval}
        isLoading={isApproving}
        isDisabled={isApproving}
      >
        Approve
      </PrimaryButton>
    </Flex>
  )
}
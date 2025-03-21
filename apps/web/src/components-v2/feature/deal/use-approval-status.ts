import { Address, erc721Abi, erc20Abi } from 'viem';
import { ciEquals } from "@market/helpers/utils";
import { BigNumber, ethers } from "ethers";
import { appConfig } from "@src/config";
import { ItemType } from "@market/hooks/use-create-order-signer";
import { useState } from "react";
import { BarterState } from "@market/state/jotai/atoms/deal";
import { Deal } from "@src/core/services/api-service/mapi/types";
import { wagmiConfig } from '@src/wagmi';
import { ContractFunctionParameters } from 'viem/types/contract';
import { readContracts } from "@wagmi/core";
import { useChainId } from 'wagmi';
import { useAppChainConfig } from '@src/config/hooks';
import { WNATIVE } from '@pancakeswap/swap-sdk-evm';
import { ChainId } from '@pancakeswap/chains';

const useApprovalStatus = () => {
  const [approvals, setApprovals] = useState<{ [key: string]: boolean }>({});
  const chainId = useChainId();
  const { config } = useAppChainConfig(chainId)

  const checkApprovalStatusesFromMapi = async (deal: Deal, side: 'maker' | 'taker') => {
    const items = side === 'maker' ? deal.maker_items : deal.taker_items;
    const targetAddress = side === 'maker' ? deal.maker : deal.taker;

    const contracts: ContractFunctionParameters[] = items.map((item: any) => {
      const isToken = [ItemType.NATIVE, ItemType.ERC20].includes(item.item_type);
      const isNft = [ItemType.ERC721, ItemType.ERC1155].includes(item.item_type);

      if (isNft) {
        return {
          address: item.token as Address,
          abi: erc721Abi,
          chainId,
          functionName: 'isApprovedForAll',
          args: [targetAddress, config.contracts.market],
        };
      } else {
        let tokenAddress = item.token;
        if (ciEquals(tokenAddress, ethers.constants.AddressZero)) {
          tokenAddress = WNATIVE[chainId as keyof typeof WNATIVE].address;
        }
        return {
          address: tokenAddress as Address,
          abi: erc20Abi,
          chainId,
          functionName: 'allowance',
          args: [targetAddress, config.contracts.market],
        };
      }
    });

    const contractResults = await readContracts(wagmiConfig, {
      contracts: contracts,
    });

    const _approvals = contractResults.reduce((acc, approval, index) => {
      const contract = contracts[index];
      const item = items[index];
      const key = contract.address;

      const isToken = [ItemType.NATIVE, ItemType.ERC20].includes(item.item_type);
      const isNft = [ItemType.ERC721, ItemType.ERC1155].includes(item.item_type);

      if (isNft) {
        acc[key.toLowerCase()] = approval.result as boolean;
      } else if (isToken) {
        const approvedAmount = BigNumber.from(approval.result);
        const requiredAmount = BigNumber.from(item.start_amount);
        acc[key.toLowerCase()] = approvedAmount.gte(requiredAmount);
      }

      return acc;
    }, {} as { [key: string]: boolean });

    setApprovals(_approvals);
  }

  const updateApproval = (address: string, value: boolean) => {
    setApprovals(prevApprovals => {
      // Ensure we're always working with the most up-to-date state
      let updatedAddress = address;
      if (ciEquals(address, ethers.constants.AddressZero)) {
        const tokenAddress = WNATIVE[chainId as keyof typeof WNATIVE].address;
      }

      return {
        ...prevApprovals,
        [updatedAddress.toLowerCase()]: value,
      };
    });
  }

  const checkApprovalStatusesFromCreate = async (barterState: BarterState, address: string) => {

    const nftContracts: ContractFunctionParameters[] = barterState.maker.nfts.map(nft => ({
      address: nft.nftAddress.toLowerCase() as Address,
      abi: erc721Abi,
      functionName: 'isApprovedForAll',
      args: [address, config.contracts.market],
    }));

    const tokenContracts: ContractFunctionParameters[] = barterState.maker.erc20.map(token => {
      let tokenAddress = token.address;
      if (ciEquals(address, ethers.constants.AddressZero)) {
        tokenAddress = WNATIVE[chainId as keyof typeof WNATIVE].address;
      }

      return {
        address: tokenAddress.toLowerCase() as Address,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [address, config.contracts.market],
      };
    });

    const data = await readContracts(wagmiConfig, {
      contracts: nftContracts.concat(tokenContracts),
    });

    const _approvals = data.reduce((acc, item, index) => {
      if (item.status === 'failure') {
        console.log('Failed to retrieve approval status for token', item.error);
        return acc;
      }

      const nftsLength = nftContracts.length;
      const erc20sLength = tokenContracts.length;
      const isNft = index < nftsLength;
      const isToken = index >= nftsLength;

      if (isNft) {
        const key = nftContracts[index].address;
        acc[key.toLowerCase()] = item.result as boolean;
      } else if (isToken) {
        const key = tokenContracts[index - nftsLength].address;
        const approvedAmount = Number(ethers.utils.formatEther(item.result as ethers.BigNumber));
        const requiredAmount = barterState.maker.erc20[index - nftsLength].amount;
        acc[key.toLowerCase()] = approvedAmount >= requiredAmount;
      }

      return acc;
    }, {} as { [key: string]: boolean });

    console.log(data);
    console.log(_approvals);
    setApprovals(_approvals);
  }

  const requiresApprovals = Object.values(approvals).filter(approval => !approval).length > 0;

  return {
    approvals,
    requiresApprovals,
    checkApprovalStatusesFromMapi,
    checkApprovalStatusesFromCreate,
    updateApproval
  }
}

export default useApprovalStatus;
import {ContractFunctionConfig} from "viem";
import {Address, erc20ABI, erc721ABI} from "wagmi";
import {ciEquals} from "@src/utils";
import {ethers} from "ethers";
import {multicall} from "@wagmi/core";
import {appConfig} from "@src/Config";
import {ItemType} from "@src/hooks/use-create-order-signer";
import {useState} from "react";
import {BarterState} from "@src/jotai/atoms/deal";
import {Deal} from "@src/core/services/api-service/mapi/types";

const config = appConfig();

const useApprovalStatus = () => {
  const [approvals, setApprovals] = useState<{[key: string]: boolean}>({});

  const checkApprovalStatusesFromMapi = async (deal: Deal, side: 'maker' | 'taker') => {
    const items = side === 'maker' ? deal.maker_items : deal.taker_items;
    const targetAddress = side === 'maker' ? deal.maker : deal.taker;

    const contracts: ContractFunctionConfig[] = items.map((item: any) => {
      const isToken = [ItemType.NATIVE, ItemType.ERC20].includes(item.item_type);
      const isNft = [ItemType.ERC721, ItemType.ERC1155].includes(item.item_type);

      if (isNft) {
        return {
          address: item.token as Address,
          abi: erc721ABI,
          functionName: 'isApprovedForAll',
          args: [targetAddress, config.contracts.market],
        };
      } else {
        let tokenAddress = item.token;
        if (ciEquals(tokenAddress, ethers.constants.AddressZero)) {
          tokenAddress = config.tokens.wcro.address;
        }
        return {
          address: tokenAddress as Address,
          abi: erc20ABI,
          functionName: 'allowance',
          args: [targetAddress, config.contracts.market],
        };
      }
    });

    const contractResults = await multicall({
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
        const approvedAmount = Number(ethers.utils.formatEther(approval.result as ethers.BigNumber));
        const requiredAmount = Number(item.start_amount);
        acc[key.toLowerCase()] = approvedAmount >= requiredAmount;
      }

      return acc;
    }, {} as {[key: string]: boolean});

    setApprovals(_approvals);
  }

  const updateApproval = (address: string, value: boolean) => {
    setApprovals(prevApprovals => {
      // Ensure we're always working with the most up-to-date state
      let updatedAddress = address;
      if (ciEquals(address, ethers.constants.AddressZero)) {
        updatedAddress = config.tokens.wcro.address;
      }

      return {
        ...prevApprovals,
        [updatedAddress.toLowerCase()]: value,
      };
    });
  }

  const checkApprovalStatusesFromCreate = async (barterState: BarterState, address: string) => {

    const nftContracts: ContractFunctionConfig[] = barterState.maker.nfts.map(nft => ({
      address: nft.nftAddress.toLowerCase() as Address,
      abi: erc721ABI,
      functionName: 'isApprovedForAll',
      args: [address, config.contracts.market],
    }));

    const tokenContracts: ContractFunctionConfig[] = barterState.maker.erc20.map(token => {
      let tokenAddress = token.address;
      if (ciEquals(address, ethers.constants.AddressZero)) {
        tokenAddress = config.tokens.wcro.address;
      }

      return {
        address: tokenAddress.toLowerCase() as Address,
        abi: erc20ABI,
        functionName: 'allowance',
        args: [address, config.contracts.market],
      };
    });

    const data = await multicall({
      contracts: nftContracts.concat(tokenContracts),
    });

    let sumOfCros = {
      approved: 0,
      requires: 0
    };
    const _approvals = data.reduce((acc, item, index) => {
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
        if (ciEquals(key, ethers.constants.AddressZero) || ciEquals(key, config.tokens.wcro.address)) {
          sumOfCros.approved += approvedAmount;
          sumOfCros.requires += requiredAmount;
        }
        acc[key.toLowerCase()] = approvedAmount >= requiredAmount;
      }

      return acc;
    }, {} as {[key: string]: boolean});

    // Combine CRO and WCRO for a single wrapped approval status
    if (_approvals[config.tokens.wcro.address.toLowerCase()]) {
      _approvals[config.tokens.wcro.address.toLowerCase()] = sumOfCros.approved >= sumOfCros.requires;
    }

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
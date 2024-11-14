import {ethers} from "ethers";
import {ERC165} from "@src/global/contracts/Abis";
import {appConfig} from "@src/config";
import Constants from '@src/constants';
import {ciEquals} from "@market/helpers/utils";
import {Address} from "viem";
import {wagmiConfig} from "@src/wagmi";
import {ContractFunctionParameters} from "viem/types/contract";
import {readContract, readContracts} from "@wagmi/core";

const config = appConfig();
const { ItemType } = Constants;

export async function getItemType(nftAddress: string, chainId?: number) {
  if (ciEquals(nftAddress, ethers.constants.AddressZero)) return ItemType.NATIVE;

  const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);

  const ERC1155InterfaceId = "0xd9b67a26";
  const ERC721InterfaceId = "0x80ac58cd";
  const is1155 = await readContract(wagmiConfig as any, {
    chainId,
    abi: ERC165,
    address: nftAddress as Address,
    functionName: 'supportsInterface',
    args: [ERC1155InterfaceId],
  })
  // const checkContract = new Contract(nftAddress, ERC165, readProvider);
  // const is1155 = await checkContract.supportsInterface(ERC1155InterfaceId);

  return is1155 ? ItemType.ERC1155 : ItemType.ERC721;
}

export async function is1155(nftAddress: string, chainId?: number) {
  return await getItemType(nftAddress, chainId) === ItemType.ERC1155
}

export async function is1155Many(nftAddresses: string[]) {
  const ERC1155InterfaceId = "0xd9b67a26";
  const ERC721InterfaceId = "0x80ac58cd";

  const tokenContracts: ContractFunctionParameters[] = nftAddresses.map(address => {
    return {
      address: address.toLowerCase() as Address,
      abi: ERC165 as any,
      functionName: 'supportsInterface',
      args: [ERC1155InterfaceId],
    };
  });

  const data = await readContracts(wagmiConfig, {
    contracts: tokenContracts,
  });

  return nftAddresses.reduce((acc, address, i) => {
    const contractResponse = data[i];
    if (contractResponse?.status === 'success') {
      acc[address.toLowerCase()] = contractResponse.result ? ItemType.ERC1155 : ItemType.ERC721;
    }
    return acc;
  }, {} as {[key: string]: number});
}
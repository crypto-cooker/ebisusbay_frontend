import {Contract, ethers} from "ethers";
import {ERC165} from "@src/global/contracts/Abis";
import {appConfig} from "@src/Config";
import Constants from '@src/constants';
import {ciEquals} from "@market/helpers/utils";
import {Address, erc20Abi} from "viem";
import {wagmiConfig} from "@src/wagmi";
import {ContractFunctionParameters} from "viem/types/contract";
import {multicall} from "viem/actions";

const config = appConfig();
const { ItemType } = Constants;

export async function getItemType(nftAddress: string) {
  if (ciEquals(nftAddress, ethers.constants.AddressZero)) return ItemType.NATIVE;

  const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);

  const ERC1155InterfaceId = "0xd9b67a26";
  const ERC721InterfaceId = "0x80ac58cd";
  const checkContract = new Contract(nftAddress, ERC165, readProvider);
  const is1155 = await checkContract.supportsInterface(ERC1155InterfaceId);

  return is1155 ? ItemType.ERC1155 : ItemType.ERC721;
}

export async function is1155(nftAddress: string) {
  return await getItemType(nftAddress) === ItemType.ERC1155
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

  const data = await multicall(wagmiConfig as any, {
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
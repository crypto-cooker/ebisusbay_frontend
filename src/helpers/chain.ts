import {Contract, ethers} from "ethers";
import {ERC165} from "@src/Contracts/Abis";
import {JsonRpcProvider} from "@ethersproject/providers";
import {appConfig} from "@src/Config";
import Constants from '@src/constants';

const config = appConfig();
const { ItemType } = Constants;

export async function getItemType(nftAddress: string) {
  const readProvider = new JsonRpcProvider(config.rpc.read);

  const ERC1155InterfaceId = "0xd9b67a26";
  const ERC721InterfaceId = "0x80ac58cd";
  const checkContract = new Contract(nftAddress, ERC165, readProvider);
  const is1155 = await checkContract.supportsInterface(ERC1155InterfaceId);

  return is1155 ? ItemType.ERC1155 : ItemType.ERC721;
}
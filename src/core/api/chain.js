import { BigNumber, Contract, ethers } from 'ethers';
import { ERC721 } from '@src/global/contracts/Abis';
import IPFSGatewayTools from '@pinata/ipfs-gateway-tools/dist/node';
import {appConfig} from "@src/Config";

const config = appConfig();
const readProvider = new ethers.providers.JsonRpcProvider(appConfig('rpc.read'));
let gatewayTools = new IPFSGatewayTools();
const gateway = config.urls.cdn.ipfs;


export const getCRC721NftsFromWallet = async (collectionAddress, walletAddress) => {
  const readContract = new Contract(collectionAddress, ERC721, readProvider);

  const count = await readContract.balanceOf(walletAddress);

  let nfts = [];

  const iterativeArray = Array.from(Array(count.toNumber()).keys());
  const promises = iterativeArray.map(async (i) => {
    try {
      const id = await readContract.tokenOfOwnerByIndex(walletAddress, i);
      const nft = await get721NftById(collectionAddress, id, readContract);
      nfts.push(nft);
    } catch (error) {
      console.log(error);
    }
  });

  await Promise.all(promises);

  return nfts;
};

export const getCRC721NftsFromIds = async (collectionAddress, tokenIds) => {
  const readContract = new Contract(collectionAddress, ERC721, readProvider);

  let nfts = [];

  const iterativeArray = Array.from(Array(tokenIds.length).keys());
  const promises = iterativeArray.map(async (i) => {
    try {
      const nft = await get721NftById(collectionAddress, tokenIds[i], readContract);
      nfts.push(nft);
    } catch (error) {
      console.log(error);
    }
  });

  await Promise.all(promises);

  return nfts;
};

const get721NftById = async (collectionAddress, tokenId, readContract = null) => {
  if (!readContract) readContract = new Contract(collectionAddress, ERC721, readProvider);

  const uri = await readContract.tokenURI(tokenId);

  const checkedUri = (() => {
    try {
      if (gatewayTools.containsCID(uri) && !uri.startsWith('ar')) {
        return gatewayTools.convertToDesiredGateway(uri, gateway);
      }

      if (uri.startsWith('ar')) {
        return `https://arweave.net/${uri.substring(5)}`;
      }

      return uri;
    } catch (e) {
      return uri;
    }
  })();

  let json = await (await fetch(checkedUri)).json();
  const image = await getImageFromMetadata(json);

  const numberId = tokenId instanceof BigNumber ? tokenId.toNumber() : tokenId;
  return {
    id: numberId,
    name: json.name,
    image: image,
    description: json.description,
    properties: json.properties ? json.properties : json.attributes,
    address: collectionAddress,
    multiToken: false,
  };
};

const getImageFromMetadata = async (json) => {
  let image;
  if (json.image.startsWith('ipfs')) {
    image = `${gateway}${json.image.substring(7)}`;
  } else if (gatewayTools.containsCID(json.image) && !json.image.startsWith('ar')) {
    try {
      image = gatewayTools.convertToDesiredGateway(json.image, gateway);
    } catch (error) {
      image = json.image;
    }
  } else if (json.image.startsWith('ar')) {
    if (typeof json.tooltip !== 'undefined') {
      image = `https://arweave.net/${json.tooltip.substring(5)}`;
    } else {
      image = `https://arweave.net/${json.image.substring(5)}`;
    }
  } else {
    image = json.image;
  }

  return image;
};

export const getWeirdApesStakingStatus = async (collectionAddress, nftId) => {
  const readContract = new Contract(collectionAddress, ERC721, readProvider);
  return await readContract.stakedApes(nftId);
};

export const getCroSwapQuartermastersStakingStatus = async (collectionAddress, nftId) => {
  const readContract = new Contract(
    '0x8a607d9Be17dEA16BBADB9F2f19f83F2f3f2a360',
    ['function isStaked(address _product, address _nftAddress, uint256 _id) external view override returns (bool)'],
    readProvider
  );

  const isStakedInFarm = await readContract.isStaked(
    '0x812D8983EAD958512914713606E67022b965D738',
    collectionAddress,
    nftId
  );
  const isStakedInPool = await readContract.isStaked(
    '0xEdFE968033fD2B9A98371D052cD7f32A711E533a',
    collectionAddress,
    nftId
  );

  return isStakedInFarm || isStakedInPool;
};

export const getAntMintPassMetadata = async (collectionAddress, nftId) => {
  try {
    const uri = 'https://gateway.pinata.cloud/ipfs/QmWLqeupPQsb4MTtJFjxEniQ1F67gpQCzuszwhZHFx6rUM';
    return await (await fetch(uri)).json();
  } catch (e) {
    return null;
  }
};

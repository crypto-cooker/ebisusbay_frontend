import {
  convertIpfsResource,
  findCollectionByAddress,
  isAntMintPassCollection,
  isBundle,
  isNftBlacklisted,
  isUserBlacklisted,
  isWeirdApesCollection
} from "@src/utils";
import {getAntMintPassMetadata, getWeirdApesStakingStatus} from "@src/core/api/chain";
import {fallbackImageUrl} from "@src/core/constants";
import WalletNft from "@src/core/models/wallet-nft";

export async function enrichWalletNft(nft: WalletNft): Promise<WalletNft> {
  if(isBundle(nft.nftAddress)) {

    const listed = !!nft.market.id;
    const listingId = nft.market.id;

    return {
      ...nft,
      name: nft.name,
      nfts: nft.nfts,
      listed,
      listingId,
      canSell: true,
      listable: true,
    }
  } else {
    const knownContract = findCollectionByAddress(nft.nftAddress, nft.nftId);

    const listing = nft.market;
    const listingId = listing.id;
    const listed = !!listingId;

    if (isAntMintPassCollection(nft.nftAddress)) {
      const metadata = await getAntMintPassMetadata(nft.nftAddress, nft.nftId);
      if (metadata) nft = { ...nft, ...metadata };
    }

    let image;
    let name = nft.name;
    try {
      if (nft.imageAws || nft.image) {
        image = nft.imageAws ?? nft.image;
      } else if (!!nft.tokenUri) {
        if (typeof nft.tokenUri === 'string') {
          const json = await (await fetch(nft.tokenUri)).json();
          image = convertIpfsResource(json.image);
          if (json.name) name = json.name;
        } else if (typeof nft.tokenUri === 'object') {
          image = nft.tokenUri.image;
        }
      } else {
        image = fallbackImageUrl();
      }
    } catch (e) {
      image = fallbackImageUrl();
      console.log(e);
    }
    if (!image) image = fallbackImageUrl();

    const video = nft.animationUrl ?? (image.split('.').pop() === 'mp4' ? image : null);

    let isStaked = false;
    let canTransfer = true;
    let canSell = true;
    if (isWeirdApesCollection(nft.nftAddress)) {
      const staked = await getWeirdApesStakingStatus(nft.nftAddress, nft.nftId);
      if (staked) {
        canTransfer = false;
        canSell = false;
        isStaked = true;
      }
    }

    if (isUserBlacklisted(nft.owner) || isNftBlacklisted(nft.nftAddress, nft.nftId)) {
      canTransfer = false;
      canSell = false;
    }

    return {
      ...nft,
      listable: knownContract?.listable ?? false,
      listed,
      listingId,
      isStaked: isStaked,
      canSell: canSell,
      canTransfer: canTransfer,
      animationUrl: video
    };
  }
}
import {
  caseInsensitiveCompare,
  convertIpfsResource,
  findCollectionByAddress,
  isAntMintPassCollection,
  isBundle, isCroSwapQuartermastersCollection,
  isNftBlacklisted,
  isUserBlacklisted,
  isWeirdApesCollection
} from "@market/helpers/utils";
import {
  getAntMintPassMetadata,
  getCroSwapQuartermastersStakingStatus,
  getWeirdApesStakingStatus
} from "@src/core/api/chain";
import {fallbackImageUrl} from "@src/core/constants";
import WalletNft from "@src/core/models/wallet-nft";
import axios from "axios";
import {Listing, OwnerListing} from "@src/core/models/listing";
import {InvalidState} from "@src/core/services/api-service/types";

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
    try {
      if (nft.imageAws || nft.image) {
        image = nft.imageAws ?? nft.image;
      } else if (!!nft.tokenUri) {
        if (typeof nft.tokenUri === 'string') {
          const jsonUrl = convertIpfsResource(nft.tokenUri);
          const json = await axios.get(jsonUrl, {timeout: 5000});
          image = convertIpfsResource(json.data.image);
          if (json.data.name) nft.name = json.data.name;
        } else if (typeof nft.tokenUri === 'object') {
          image = nft.tokenUri.image;
        }
      } else {
        image = fallbackImageUrl();
      }
    } catch (e) {
      image = fallbackImageUrl();
    }
    if (!image) image = fallbackImageUrl();
    nft.image = image;

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


    if (isCroSwapQuartermastersCollection(nft.nftAddress)) {
      const staked = await getCroSwapQuartermastersStakingStatus(nft.nftAddress, nft.nftId);
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

/**
 * Currently used to track ownership of ERC1155 where MAPI falls short
 *
 * @param listing
 * @param walletNfts
 */
export function enrichOwnerListing(listing: Listing, walletNfts: WalletNft[]): OwnerListing {
  const isInWallet = !!walletNfts.find((walletNft) => caseInsensitiveCompare(walletNft.nftAddress, listing.nftAddress) && walletNft.nftId == listing.nftId);

  return {
    ...listing,
    isInWallet,
    valid: listing.valid && isInWallet,
    invalid: listing.invalid ?? isInWallet ? listing.invalid : InvalidState.OWNER_SELLER
  };
}

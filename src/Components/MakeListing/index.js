import {isGaslessListing} from "@src/utils";

import UpdateLegacyListingDialog from "@src/Components/MakeListing/legacy";
import MakeGaslessListingDialog from "@src/Components/MakeListing/gasless";
import useFeatureFlag from "@src/hooks/useFeatureFlag";
import Constants from "@src/constants";

export default function MakeListingDialog({ isOpen, nft, onClose, listing }) {
  const { Features } = Constants;
  const isGaslessListingEnabled = useFeatureFlag(Features.GASLESS_LISTING);

  return !isGaslessListingEnabled || (nft && nft.listed && !isGaslessListing(nft.listingId)) ?
    <UpdateLegacyListingDialog isOpen={isOpen} nft={nft} onClose={onClose} listing={listing} /> :
    <MakeGaslessListingDialog isOpen={isOpen} nft={nft} onClose={onClose} listing={listing} />
}

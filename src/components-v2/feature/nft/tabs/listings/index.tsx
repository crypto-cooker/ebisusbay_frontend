import React from 'react';
import ResponsiveNftListingsTable from "@src/components-v2/shared/responsive-table/responsive-nft-listings-table";
import {addToCart, openCart} from "@src/GlobalState/cartSlice";
import {toast} from "react-toastify";
import {createSuccessfulAddCartContent} from "@src/utils";
import {useDispatch} from "react-redux";

interface ListingsProps {
  listings: any[];
  nft: any;
}

export default function Listings({ listings, nft }: ListingsProps) {
  const dispatch = useDispatch();

  const handleAddToCart = (listing: any) => {
    if (!listing || !listing.listingId) return;

    dispatch(addToCart({
      listingId: listing.listingId,
      name: nft.name,
      image: nft.image,
      price: listing.price,
      address: listing.nftAddress,
      id: listing.nftId,
      rank: nft.rank,
      amount: listing.amount
    }));
    toast.success(createSuccessfulAddCartContent(() => dispatch(openCart())));
  };

  return (
    <div className='listing-tab'>
      {listings && listings.length > 0 ? (
        <ResponsiveNftListingsTable
          data={listings}
          onAddToCart={handleAddToCart}
          breakpointValue='xl'
        />
      ) : (
        <>
          <span>No history found for this item</span>
        </>
      )}
    </div>
  );
}

import React from 'react';
import ListingsRow from './row';

interface ListingsProps {
  listings: any[];
  nft: any;
}

export default function Listings({ listings, nft }: ListingsProps) {
  return (
    <div className='listing-tab'>
      {listings && listings.length > 0 ? (
        <>
          {listings.map((listing, index) => (
            <ListingsRow listing={listing} key={index} nft={nft} />
          ))}
        </>
      ) : (
        <>
          <span>No history found for this item</span>
        </>
      )}
    </div>
  );
}

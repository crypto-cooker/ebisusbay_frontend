import React from 'react';
import ListingsRow from './ListingsRow';

export default function NFTTabListings({ listings, nft }) {
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

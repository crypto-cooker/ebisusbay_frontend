import React from 'react';
import EmptyData from '../EmptyData';
import TableHeader from '../MadeOffersHeader';
import TableRow from '../MadeOffersRow';

export default function MadeOffers({ offers }) {
  return (
    <div>
      <TableHeader />
      {offers.length > 0 ? (
        offers.map((offer, index) => <TableRow key={index} data={offer} type="Made" />)
      ) : (
        <EmptyData>No offers found</EmptyData>
      )}
    </div>
  );
}

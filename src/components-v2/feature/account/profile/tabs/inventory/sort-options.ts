export type SortOption = {
  id: string;
  key: 'id' | 'rank' | 'receivedTimestamp' | 'address' | 'price' | 'offerPrice';
  direction: 'asc' | 'desc';
  label: string;
}

export const sortOptions: SortOption[] = [
  {
    id: 'receivedTimestamp-desc',
    key: 'receivedTimestamp',
    direction: 'desc',
    label: 'Recently Received',
  },
  {
    id: 'receivedTimestamp-asc',
    key: 'receivedTimestamp',
    direction: 'asc',
    label: 'Oldest Received',
  },
  {
    id: 'rank-asc',
    key: 'rank',
    direction: 'asc',
    label: 'Rank: Rare to Common',
  },
  {
    id: 'rank-desc',
    key: 'rank',
    direction: 'desc',
    label: 'Rank: Common to Rare',
  },
  {
    id: 'price-desc',
    key: 'price',
    direction: 'desc',
    label: 'Price: High to Low',
  },
  {
    id: 'price-asc',
    key: 'price',
    direction: 'asc',
    label: 'Price: Low to High',
  },
  {
    id: 'offerPrice-desc',
    key: 'offerPrice',
    direction: 'desc',
    label: 'Offer Price: High to Low',
  },
  {
    id: 'offerPrice-asc',
    key: 'offerPrice',
    direction: 'asc',
    label: 'Offer Price: Low to High',
  },
  {
    id: 'id-desc',
    key: 'id',
    direction: 'desc',
    label: 'Token ID: High to Low',
  },
  {
    id: 'id-asc',
    key: 'id',
    direction: 'asc',
    label: 'Token ID: Low to High',
  },
  {
    id: 'address-asc',
    key: 'address',
    direction: 'asc',
    label: 'Collection: A-Z',
  },
  {
    id: 'address-desc',
    key: 'address',
    direction: 'desc',
    label: 'Collection: Z-A',
  }
];
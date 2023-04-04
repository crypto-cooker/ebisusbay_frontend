export type SortOption = {
  id: string;
  key: 'listingId' | 'listingTime' | 'saleTime' | 'price' | 'rank' | 'expirationDate';
  direction: 'asc' | 'desc';
  label: string;
}

export const sortOptions: SortOption[] = [
  {
    id: 'listingTime-desc',
    key: 'listingTime',
    direction: 'desc',
    label: 'Latest Listings',
  },
  {
    id: 'listingTime-asc',
    key: 'listingTime',
    direction: 'asc',
    label: 'Oldest Listings',
  },
  {
    id: 'expirationDate-asc',
    key: 'expirationDate',
    direction: 'asc',
    label: 'Ending Soon',
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
  }
];
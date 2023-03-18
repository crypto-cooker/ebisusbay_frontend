export type SortOption = {
  id: string;
  key: 'id' | 'rank' | 'receivedTimestamp' | 'address';
  direction: 'asc' | 'desc';
  label: string;
}

export const sortOptions: SortOption[] = [
  {
    id: 'receivedTimestamp',
    key: 'receivedTimestamp',
    direction: 'desc',
    label: 'Recently Received',
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
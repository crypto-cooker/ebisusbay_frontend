import { CollectionSortOption } from '../../Models/collection-sort-option.model';

const sort = [
  {
    key: 'listingTime',
    direction: 'desc',
    label: 'Latest Listings',
  },
  {
    key: 'expirationDate',
    direction: 'asc',
    label: 'Ending Soon',
  },
  {
    key: 'price',
    direction: 'desc',
    label: 'Price: High to Low',
  },
  {
    key: 'price',
    direction: 'asc',
    label: 'Price: Low to High',
  },
  {
    key: 'rank',
    direction: 'asc',
    label: 'Rank: Rare to Common',
  },
  {
    key: 'rank',
    direction: 'desc',
    label: 'Rank: Common to Rare',
  },
  {
    key: 'id',
    direction: 'desc',
    label: 'Token ID: High to Low',
  },
  {
    key: 'id',
    direction: 'asc',
    label: 'Token ID: Low to High',
  }
];

export const sortOptions = sort.map((x) => CollectionSortOption.fromJson(x));

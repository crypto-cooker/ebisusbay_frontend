import { SortOption } from '../../Models/sort-option.model';

const sort = [
  {
    id: 'listingTime-desc',
    key: 'listingTime',
    direction: 'desc',
    label: 'Latest Listings',
  },
  {
    id: 'expirationDate-asc',
    key: 'expirationDate',
    direction: 'asc',
    label: 'Ending Soon',
  },
  {
    id: 'price-desc',
    key: 'price',
    direction: 'desc',
    label: 'Price (High to Low)',
  },
  {
    id: 'price-asc',
    key: 'price',
    direction: 'asc',
    label: 'Price (Low to High)',
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
  }
];

export const sortOptions = sort.map((x) => SortOption.fromJson(x));

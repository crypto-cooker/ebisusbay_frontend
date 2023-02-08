import { SortOption } from '../../Models/sort-option.model';

const sort = [
  {
    id: 'listingTime',
    key: 'listingTime',
    direction: 'desc',
    label: 'Latest Listings',
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
    label: 'Rare to Common',
  },
  {
    id: 'rank-desc',
    key: 'rank',
    direction: 'desc',
    label: 'Common to Rare',
  },
];

export const sortOptions = sort.map((x) => SortOption.fromJson(x));

import {InvalidState, OrderState} from "@src/core/services/api-service/types";

export interface Deal {
  id: string;
  chain: number;
  state: OrderState;
  invalid: InvalidState;
  created_at: string;
  completed_at?: string | null;
  cancelled_at?: string | null;
  maker: string;
  taker: string;
  order_type: number;
  start_at: number;
  end_at: number;
  salt: string;
  maker_signature: string;
  maker_items: DealItem[];
  taker_items: DealItem[];
  estimated_maker_value: number;
  estimated_taker_value: number;
}

export interface DealItem {
  offer_item_id: number;
  item_type: number;
  token: string;
  identifier_or_criteria: string | null;
  start_amount: string;
  end_amount: string;
  token_details?: { // ERC721 only
    metadata: {
      name: string;
      image: string;
      description: string;
      rank?: number;
      attributes: Array<{trait_type: string, value: string | number}>;
    }
  },
  collection?: { // ERC721 only
    name: string;
    slug: string;
    metadata: any;
  },
  token_name?: string; // ERC20 only
  token_symbol?: string; // ERC20 only
  token_decimals?: number; // ERC20 only
}

export interface AbbreviatedDeal {
  id: string;
  chain: number;
  state: OrderState;
  invalid: InvalidState;
  created_at: string;
  completed_at?: string | null;
  cancelled_at?: string | null;
  transaction_hash?: string | null;
  maker: string;
  taker: string;
  order_type: number;
  start_at: number;
  end_at: number;
  maker_types: number[];
  taker_types: number[];
}

export interface MapiWalletNft {
  nftId: string;
  nftAddress: string;
  chain: number;
  collection: MapiWalletCollection;
  collectionName: string;
  burnt: boolean;
  balance: string;
  owner: string;
  token_uri: string;
  is1155: boolean;
  market?: {
    id: string;
    price: string;
    currency: string;
    seller: string;
    expirationDate: string;
    listingCount: string;
    uri: string;
  };
  last_sale?: {
    price: string;
    currency: string;
    seller: string;
    id: string;
    uri: string;
  };
  offer?: {
    id: string;
    hash: string;
    offerIndex: string;
    price: string;
    purchaser: string;
    uri: string;
  };
  name: string;
  image: string;
  description: string;
  rank?: number;
  attributes: Array<{value: string, trait_type: string}>;

}

export interface MapiWalletCollection {
  name: string;
  slug: string;
  blacklist: MapiCollectionBlacklist;
}

export enum MapiCollectionBlacklist {
  LISTABLE,
  UNLISTABLE,
  BLACKLIST,
  ADMIN_BLACKLIST,
  PENDING
}

export interface MapiCollection {
  chain: number;
  verification: {
    verified: boolean;
    doxx: boolean;
    kyc: boolean;
  },
  blacklist: MapiCollectionBlacklist;
  holders: string;
  totalSupply: string;
  address: string;
  owner: string;
  ownerExt: string;

  // @deprecated use is1155 field
  multiToken: boolean;

  // @deprecated use blacklist field
  listable: boolean;

  is1155: boolean;
  name: string;
  slug: string;
  stats: {
    total: {
      active: string;
      complete: string;
      sales: string;
      floorPrice: string;
      avgSalesPrice: string;
      volume: string;
      volume1d: string;
      volume1d_increase: string;
      royalty: string;
      sales1d: string;
      sales1d_increase: string;
      avgSalePrice1d: string;
      avgSalePrice1d_increase: string;
      volume7d: string;
      sales7d: string;
      avgSalePrice7d: string;
      volume30d: string;
      sales30d: string;
      avgSalePrice30d: string;
      volume7d_increase: string;
      sales7d_increase: string;
      avgSalePrice7d_increase: string;
    }
  };
  metadata: {
    description: string;
    avatar: string;
    card: string;
    banner: string;
    website: string;
    twitter: string;
    discord: string;
    medium: string;
    rankings?: {
      source: string;
      slug: string;
    }
  };
  blacklisted: MapiCollectionBlacklist;
}
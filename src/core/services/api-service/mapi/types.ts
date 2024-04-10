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
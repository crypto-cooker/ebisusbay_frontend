import {atomWithStorage} from "jotai/utils";
import {atom} from "jotai/index";

export interface CartItem {
  listingId: string;
  name: string;
  image: string;
  price: number | string;
  address: string;
  id: string;
  rank: number;
  amount: number;
  currency: string;
  isBundle?: boolean;
}

export const cartOpenAtom = atom<boolean>(false);
export const cartItemsAtom = atomWithStorage<CartItem[]>('eb.cart', []);
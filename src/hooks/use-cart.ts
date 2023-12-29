import { atom, useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// Define the type for a cart item based on provided structure
type CartItem = {
  listingId: string;
  name: string;
  image: string;
  price: number | string;
  address: string;
  id: string; // Assuming this is a unique identifier for each item
  rank: number;
  amount: number; // Assuming this is the quantity of the item
  currency: string;
  isBundle?: boolean;
};

// Define atoms
const cartOpenAtom = atom<boolean>(false);
const cartItemsAtom = atomWithStorage<CartItem[]>('CART', []);

// Hook to manage the cart
const useCart = () => {
  const [isOpen, setIsOpen] = useAtom(cartOpenAtom);
  const [items, setItems] = useAtom(cartItemsAtom);

  const addItem = (newItem: CartItem) => {
    setItems((oldItems) => {
      if (!oldItems.some(item => item.listingId === newItem.listingId)) {
        if (oldItems.length === 0) {
          setIsOpen(true);
        }
        return [...oldItems, newItem];
      }
      return oldItems;
    });
  };

  const removeItem = (listingId: string) => {
    setItems((oldItems) => oldItems.filter((item) => item.listingId !== listingId));
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const clearCart = () => {
    setItems([]);
  };

  const isItemInCart = (itemId: string) => {
    return items.some((item) => item.listingId === itemId);
  };

  const totalPrice = items.reduce((total, item) => total + parseInt(item.price.toString()) * item.amount, 0);

  return {
    isOpen,
    items,
    addItem,
    removeItem,
    openCart,
    closeCart,
    clearCart,
    isItemInCart,
    totalPrice,
  };
};

export default useCart;

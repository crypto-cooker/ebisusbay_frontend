import { useAtom } from 'jotai';
import {CartItem, cartItemsAtom, cartOpenAtom} from "@market/state/jotai/atoms/cart";


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

        // Sometimes API does not return an amount
        if (!newItem.amount) newItem.amount = 1;

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

  const clearCart = (newItems?: CartItem[]) => {
    setItems(newItems ?? []);
  };

  const isItemInCart = (itemId: string) => {
    return items.some((item) => item.listingId === itemId);
  };

  const totalPrice = items.reduce((total, item) => total + parseInt(item.price.toString()) * item.amount, 0);

  const itemsForChain = (chain: number) => items.filter((item) => item.chain === chain);

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
    itemsForChain
  };
};

export default useCart;

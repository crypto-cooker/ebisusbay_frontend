import {useAtom} from 'jotai';
import {searchHistoryAtom, SearchHistoryItem} from "@market/state/jotai/atoms/search";
import {ciEquals} from "@market/helpers/utils";


const useSearch = () => {
  const [items, setItems] = useAtom(searchHistoryAtom);

  const addItem = (newItem: SearchHistoryItem) => {
    setItems((oldItems) => {
      if (!oldItems.some(item => ciEquals(item.address, newItem.address))) {
        return [...oldItems, newItem];
      }
      return oldItems;
    });
  };

  const removeItem = (address: string) => {
    setItems((oldItems) => oldItems.filter((item) => !ciEquals(item.address, address)));
  };

  const clearCart = () => {
    setItems([]);
  };

  const isItemInCart = (address: string) => {
    return items.some((item) => ciEquals(item.address, address));
  };

  return {
    items,
    addItem,
    removeItem,
    clearCart,
    isItemInCart,
  };
};

export default useSearch;

import { useState } from 'react';
import {useSelector} from "react-redux";
import { cancelListing } from '@src/core/cms/endpoints/gaslessListing';
import {toast} from "react-toastify";
import {pluralize} from "@src/utils";

const useCancelGaslessListing = () => {
  const [response, setResponse] = useState({
    loading: false,
    error: null,
  });

  const user = useSelector((state) => state.user);

  const cancelGaslessListing = async (listingIds) => {
    if (!Array.isArray(listingIds)) listingIds = [listingIds];

    setResponse({
      ...response,
      loading: true,
      error: null,
    });

    try {
      const { data: orders } = await cancelListing(listingIds);

      const ship = user.contractService.ship;
      const tx = await ship.cancelOrders(orders);
      await tx.wait();

      setResponse({
        ...response,
        loading: false,
        error: null,
      });

      return true;
    } catch (error) {
      console.log(error)
      setResponse({
        ...response,
        loading: false,
        error: error,
      });
      throw error;
    }
  };

  return [cancelGaslessListing, response];
};

export default useCancelGaslessListing;

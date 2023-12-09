import {useState} from 'react';
import {cancelListing} from '@src/core/cms/endpoints/gaslessListing';
import ContractService from "@src/core/contractService";
import {useContractService, useUser} from "@src/components-v2/useUser";

type ResponseProps = {
  loading: boolean;
  error?: any;
};

const useCancelGaslessListing = () => {
  const [response, setResponse] = useState<ResponseProps>({
    loading: false,
    error: undefined,
  });

  const user = useUser();
  const contractService = useContractService();

  const cancelGaslessListing = async (listingIds: string[]) => {
    if (!Array.isArray(listingIds)) listingIds = [listingIds];

    setResponse({
      ...response,
      loading: true,
      error: null,
    });

    try {
      const { data: orders } = await cancelListing(listingIds);

      const ship = (contractService! as ContractService).ship;
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

  return [cancelGaslessListing, response] as const;
};

export default useCancelGaslessListing;

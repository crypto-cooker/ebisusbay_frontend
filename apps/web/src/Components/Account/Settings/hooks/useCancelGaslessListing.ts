import {useState} from 'react';
import {cancelListing, expressCancelListing} from '@src/core/cms/endpoints/gaslessListing';
import {useContractService, useUser} from "@src/components-v2/useUser";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";

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
  const { requestSignature } = useEnforceSignature();
  const contractService = useContractService();

  const cancelGaslessListing = async (listingIds: string[], express: boolean) => {
    if (!Array.isArray(listingIds)) listingIds = [listingIds];

    setResponse({
      ...response,
      loading: true,
      error: null,
    });

    try {
      if (listingIds.length > 0) {
        if (express) {
          const signature = await requestSignature();
          await expressCancelListing(listingIds, user.address, signature);
        } else {
          const { data: orders } = await cancelListing(listingIds);
          const ship = contractService!.ship;
          const tx = await ship.cancelOrders(orders);
          await tx.wait();
        }
      }

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

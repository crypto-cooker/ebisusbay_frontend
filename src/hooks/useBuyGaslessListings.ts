import {useState} from 'react';
import {ContractReceipt, ethers} from "ethers";
import {toast} from 'react-toastify';
import {getServerSignature} from '@src/core/cms/endpoints/gaslessListing';
import {pluralize} from "@src/utils";
import {useAppSelector} from "@src/Store/hooks";

type ResponseProps = {
  loading: boolean;
  error?: any;
  tx?: ContractReceipt;
};

interface PendingGaslessPurchase {
  listingId: string;
  price: number;
  currency: string;
}

const useBuyGaslessListings = () => {
  const [response, setResponse] = useState<ResponseProps>({
    loading: false,
    error: undefined,
    tx: undefined
  });

  const {contractService, address} = useAppSelector((state) => state.user);

  const buyGaslessListings = async (pendingPurchases: PendingGaslessPurchase[]) => {
    setResponse({
      ...response,
      loading: true,
      error: undefined,
      tx: undefined
    });

    try {
      const buyContract = contractService!.ship;
      const croTotal = pendingPurchases
        .filter((purchase) => !purchase.currency || purchase.currency === ethers.constants.AddressZero)
        .reduce((acc, curr) => acc + Number(curr.price), 0);
      const price = ethers.utils.parseEther(`${croTotal}`);

      const approvedTokens: string[] = [];
      for (const purchase of pendingPurchases) {
        if (purchase.currency && purchase.currency !== ethers.constants.AddressZero && !approvedTokens.includes(purchase.currency)) {
          const tokenContract = contractService!.erc20(purchase.currency);
          const allowance = await tokenContract.allowance(address!, contractService!.market.address);
          if (allowance.lt(ethers.utils.parseEther(`${purchase.price}`))) {
            const approvalAmout = ethers.utils.parseEther(`${purchase.price * 10}`);
            const tx = await tokenContract.approve(contractService!.market.address, approvalAmout);
            await tx.wait();
          }
          approvedTokens.push(purchase.currency);
        }
      }

      const { data: serverSig } = await getServerSignature((address! as string), pendingPurchases.map((purchase) => purchase.listingId));
      const { signature, orderData, ...sigData } = serverSig;
      const total = price.add(sigData.feeAmount);
      const tx = await buyContract.fillOrders(orderData, sigData, signature, { value: total });
      const receipt = await tx.wait()
      toast.success(`${pluralize(pendingPurchases.length, 'NFT')} successfully purchased`);

      setResponse({
        ...response,
        loading: false,
        error: undefined,
        tx: receipt
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

  return [buyGaslessListings, response] as const;
};

export default useBuyGaslessListings;

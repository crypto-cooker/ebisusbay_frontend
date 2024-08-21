import {useState} from 'react';
import {Contract, ContractReceipt, ethers} from "ethers";
import {toast} from 'react-toastify';
import {getServerSignature} from '@src/core/cms/endpoints/gaslessListing';
import {pluralize} from "@market/helpers/utils";
import {useContractService, useUser} from "@src/components-v2/useUser";
import gaslessListingContract from "@src/global/contracts/GaslessListing.json";
import chainConfigs, {SupportedChainId} from "@src/config/chains";
import {useContractWrite} from "wagmi";

type ResponseProps = {
  loading: boolean;
  error?: any;
  tx?: ContractReceipt;
};

interface PendingGaslessPurchase {
  listingId: string;
  price: number;
  currency: string;
  chainId: number;
}

const useBuyGaslessListings = () => {
  const [response, setResponse] = useState<ResponseProps>({
    loading: false,
    error: undefined,
    tx: undefined
  });

  const {address, provider} = useUser();

  const contractService = useContractService();

  const buyGaslessListings = async (pendingPurchases: PendingGaslessPurchase[]) => {
    setResponse({
      ...response,
      loading: true,
      error: undefined,
      tx: undefined
    });

    try {
      const chainId = pendingPurchases[0].chainId as SupportedChainId
      const chainConfig = chainConfigs[chainId];

      const croTotal = pendingPurchases
        .filter((purchase) => !purchase.currency || purchase.currency === ethers.constants.AddressZero)
        .reduce((acc, curr) => acc + Number(curr.price), 0);
      const price = ethers.utils.parseEther(`${croTotal}`);

      // Sum all currency totals for allowance approval
      const currencyTotals = new Map<string, ethers.BigNumber>();
      for (const purchase of pendingPurchases) {
        if (purchase.currency && purchase.currency !== ethers.constants.AddressZero) {
          const price = ethers.utils.parseEther(`${purchase.price}`);
          currencyTotals.set(
            purchase.currency,
            (currencyTotals.get(purchase.currency) || ethers.BigNumber.from(0)).add(price)
          );
        }
      }

      // Approve the currencies
      for (const [currency, totalPrice] of currencyTotals) {
        const tokenContract = contractService!.erc20(currency);
        const allowance = await tokenContract.allowance(address!, contractService!.market.address);

        if (allowance.lt(totalPrice)) {
          const approvalAmount = totalPrice.mul(10);
          const tx = await tokenContract.approve(contractService!.market.address, approvalAmount);
          await tx.wait();
        }
      }

      const { data: serverSig } = await getServerSignature((address! as string), pendingPurchases.map((purchase) => purchase.listingId));
      const { signature, orderData, ...sigData } = serverSig;
      const total = price.add(sigData.feeAmount);
      const buyContract = new Contract(chainConfig.contracts.gaslessListing, gaslessListingContract.abi, provider.signer);
      const gasEstimate = await buyContract.estimateGas.fillOrders(orderData, sigData, signature, { value: total });
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

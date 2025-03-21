import {useUser} from "@src/components-v2/useUser";
import {useEffect, useState} from "react";
import {Transak, TransakConfig} from "@transak/transak-sdk";
import {getServerSignature} from "@src/core/cms/endpoints/gaslessListing";
import Pusher from "pusher-js";
import {appConfig} from "@src/config";
import {useErrorLogger} from "@market/hooks/use-error-logger";
import {isNativeCro} from "@market/helpers/utils";

let pusher = new Pusher("1d9ffac87de599c61283", { cluster: "ap2" });
const config = appConfig();

export default function useTransak() {
  const user = useUser();
  const logError = useErrorLogger();
  const [transak, setTransak] = useState<Transak | null>(null);
  const [channel, setChannel] = useState<any>(null);
  const [executing, setExecuting] = useState(false);

  const handleOrderCreated = (orderData: any) => {
    // console.log('callback transak order created', orderData);
    const eventData = orderData;
    const orderId = eventData.status?.id;

    if (!orderId) {
      return;
    }

    subscribeToWebsockets(orderId);
  };

  const subscribeToWebsockets = (orderId: string) => {
    const newChannel = pusher.subscribe(orderId);
    setChannel(newChannel);

    // Receive updates of all events
    pusher.bind_global((eventId: any, orderData: any) => {
      // console.log(`websocket Event: ${eventId} with order data:`, orderData);
    });

    // Receive updates of specific events
    newChannel.bind('ORDER_COMPLETED', (orderData: any) => {
      // console.log('ORDER COMPLETED websocket event', orderData);
    });

    newChannel.bind('ORDER_FAILED', async (orderData: any) => {
      // console.log('ORDER FAILED websocket event', orderData);
    });
  };

  const handlePurchase = async (listings: AdaptedTransakListing[]) => {
    // console.log('SERVER SIG REQUEST', rawCallData);
    try {
      setExecuting(true);
      const { data: transakData } = await getServerSignature(
        user.address,
        listings.map(listing => listing.listingId),
        config.vendors.transak.filler,
        'transak'
      );
      const { nftTransactionId, calldata } = transakData;

      const newTransak = new Transak({
        ...defaultTransakConfig,
        walletAddress: user.address,
        calldata: calldata,
        nftTransactionId
      } as any);

      setTransak(newTransak);
      newTransak.init();

      Transak.on(Transak.EVENTS.TRANSAK_ORDER_CREATED, handleOrderCreated);
      Transak.on(Transak.EVENTS.TRANSAK_WIDGET_CLOSE, cleanup);
    } catch (e) {
      logError({error: e, toastLog: 'Unable to process purchase'});
    } finally {
      setExecuting(false);
    }
  };

  const cleanup = () => {
    if (transak) {
      transak.close();
      setTransak(null);
    }

    if (channel) {
      channel.unbind_all();
      pusher.unsubscribe(channel.name);
      setChannel(null);
    }

    // Transak.off(Transak.EVENTS.TRANSAK_ORDER_CREATED, handleOrderCreated);
    // Transak.off(Transak.EVENTS.TRANSAK_WIDGET_CLOSE, cleanup);
  };

  const mapPrice = (listing: AdaptedTransakListing) => {
    const amount = Number(listing.amount);
    const pricePerUnit = Number(listing.price) / amount;
    const remainder = Number(listing.price) % amount;

    return [...Array(amount)].map((_, i) => {
      let price = pricePerUnit;
      if (remainder && i === amount - 1) {
        price += remainder;
      }
      return {
        tokenID: listing.nftId,
        price: price,
      };
    });
  };

  const isEligible = async (listing: { currency: string }) => {
    // const is1155Token = await is1155(listing.nftAddress);
    const isCro = isNativeCro(listing.currency);

    return isCro;
  }

  const purchaseToken = (walletAddress: string, symbol: 'CRO' | 'USDC') => {
    const url = new URL(config.vendors.transak.url);
    if (user.address) {
      url.searchParams.append('cryptoCurrencyCode', symbol);
      url.searchParams.append('walletAddress', walletAddress);
    }

    window.open(url, '_blank');
  }

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  return {
    purchase: handlePurchase,
    isLoading: executing,
    isEligible,
    purchaseToken
  }
}


type TransakConfigEnv = typeof Transak['ENVIRONMENTS']['STAGING'] | typeof Transak['ENVIRONMENTS']['PRODUCTION'];

const defaultTransakConfig: TransakConfig = {
  apiKey: config.vendors.transak.apiKey,
  environment: config.vendors.transak.env as TransakConfigEnv,
  themeColor: '000000',
  defaultPaymentMethod: 'credit_debit_card',
  exchangeScreenTitle: 'Buy NFT',
  disableWalletAddressForm: true,
  estimatedGasLimit: 70_000,
  network: 'cronos',
  cryptoCurrencyCode: 'CRO',
  isNFT: true,
  contractId: config.vendors.transak.contractId,
};

interface AdaptedTransakListing {
  listingId: string,
  price: string | number,
  amount: string | number,
  currency: string,
  nftAddress: string;
  nftId: string;
  name: string;
  image: string;
}
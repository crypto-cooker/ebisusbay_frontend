import { Address } from "viem";
import { Currency, CurrencyAmount } from '@pancakeswap/sdk'
import { ChainId } from "@pancakeswap/chains";



export type BridgeContract = {
    address: Address;
    currencyId: string;
}

export type Bridge = {
    currency: Currency;
    amount: CurrencyAmount<Currency>;
    fromChainId: ChainId;
    toChainId: ChainId;
    fee: BigInt;
}
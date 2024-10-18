import { Address } from 'viem';
import { Currency, CurrencyAmount } from '@pancakeswap/sdk';
import { ChainId } from '@pancakeswap/chains';
import { BigNumber } from 'ethers';

export type BridgeContract = {
  address: Address;
  currencyId: string;
};

export type Bridge = {
  currency: Currency;
  amount: CurrencyAmount<Currency>;
  fromChainId: ChainId;
  toChainId: ChainId;
  fee: BigNumber | undefined;
};

import {Card} from "@src/components-v2/foundation/card";
import {Alert, AlertIcon, Button, Box, Heading, HStack, IconButton, Spinner, Stack, Text, VStack} from "@chakra-ui/react";
import NextLink from "next/link";
import {AddIcon, ArrowBackIcon, ChevronDownIcon} from "@chakra-ui/icons";
import React, {useCallback, useEffect, useState} from "react";
import useNativeCurrency from "@eb-pancakeswap-web/hooks/useNativeCurrency";
import {useV2Pair, PairState} from "@eb-pancakeswap-web/hooks/usePairs";
import {ChainLogo, CurrencyLogo} from "@dex/components/logo";
import {Currency} from "@pancakeswap/sdk";
import {FRTN, STABLE_COIN, USDC, USDT} from '@pancakeswap/tokens'
import {ChainId} from "@pancakeswap/chains";
import {useUser} from "@src/components-v2/useUser";
import {BIG_INT_ZERO} from "@dex/swap/constants/exchange";
import {useTokenBalance} from "@eb-pancakeswap-web/state/wallet/hooks";
import currencyId from "@eb-pancakeswap-web/utils/currencyId"
import {CurrencySearchModal} from "@dex/components/search-modal";
import {MinimalPositionCard} from '@dex/liquidity/components/position-card';
import { PrimaryButton, SecondaryButton } from '@src/components-v2/foundation/button';
import SwapCurrencyInputPanel from "@dex/swap/components/tabs/swap/swap-currency-input-panel";
import {Field} from "@dex/swap/constants";


export default function AddLiquidity() {
  const { address: account } = useUser();

  return (
    <>
      <Card>
        <Heading size='md' mb={2}>
          <HStack>
            <NextLink href='/dex/liquidity'>
              <IconButton
                aria-label='Back'
                icon={<ArrowBackIcon />}
                variant='unstyled'
              />
            </NextLink>
            <Box>Add Liquidity</Box>
          </HStack>
        </Heading>
        <Box>
          <Alert status='info'>
            <AlertIcon />
            <Box fontSize='sm'>
              <strong>Tip:</strong> When you add liquidity, you will receive pool tokens representing your position. These tokens automatically earn fees proportional to your share of the pool, and can be redeemed at any time.
            </Box>
          </Alert>
          <VStack w='full' align='stretch'>
            {/*<SwapCurrencyInputPanel*/}
            {/*  label='You pay'*/}
            {/*  currency={derivedSwapInfo.currencies[Field.INPUT]}*/}
            {/*  otherCurrency={derivedSwapInfo.currencies[Field.OUTPUT]}*/}
            {/*  value={formattedAmounts[Field.INPUT]}*/}
            {/*  onCurrencySelect={handleInputSelect}*/}
            {/*  onUserInput={handleTypeInput}*/}
            {/*  onMax={handleMaxInput}*/}
            {/*/>*/}
            <Box className='text-muted' mx='auto'>
              <AddIcon />
            </Box>
            {/*<SwapCurrencyInputPanel*/}
            {/*  label='You receive'*/}
            {/*  currency={derivedSwapInfo.currencies[Field.OUTPUT]}*/}
            {/*  otherCurrency={derivedSwapInfo.currencies[Field.INPUT]}*/}
            {/*  value={formattedAmounts[Field.OUTPUT]}*/}
            {/*  onCurrencySelect={handleOutputSelect}*/}
            {/*  onUserInput={handleTypeOutput}*/}
            {/*/>*/}
          </VStack>
        </Box>
      </Card>
    </>
  )
}

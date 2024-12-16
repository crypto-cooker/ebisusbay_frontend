import {ChainId} from "@pancakeswap/chains";
import {Currency, Token} from "@pancakeswap/sdk";
import useNativeCurrency from "@eb-pancakeswap-web/hooks/useNativeCurrency";
import { CommonBasesType } from './types'
import {
  Box,
  Button,
  HStack,
  Image,
  Text,
  VStack,
  Wrap
} from "@chakra-ui/react";
import React from "react";
import {QuestionHelper} from "@dex/swap/components/tabs/swap/question-helper";
import { CurrencyLogo } from "../logo";
import { SUGGESTED_BASES } from "@dex/swap/constants/exchange";


export default function CommonBases({
  chainId,
  onSelect,
  selectedCurrency,
  commonBasesType,
}: {
  chainId?: ChainId,
  commonBasesType?: CommonBasesType,
  selectedCurrency?: Currency | null,
  onSelect: (currency: Currency) => void
}) {
  const native = useNativeCurrency()
  const pinTokenDescText = commonBasesType === CommonBasesType.SWAP_LIMITORDER ? 'Common tokens' : 'Common bases'


  return (
    <>
      <Box>
        <VStack p={4} align='start' w='full'>
          <Box mt={2}>
            <HStack>
              <Text fontSize="14px">
                {pinTokenDescText}
              </Text>
              <QuestionHelper
                text='These tokens are commonly paired with other tokens.'
                ml="4px"
                placement="top"
              />
            </HStack>
            <Wrap mt={2}>
              <Box>
                <Button
                  variant='outline'
                  leftIcon={<CurrencyLogo currency={native} />}
                  onClick={() => {
                    if (!selectedCurrency || !selectedCurrency.isNative) {
                      onSelect(native)
                    }
                  }}
                  isDisabled={selectedCurrency?.isNative}
                >
                  {native?.symbol}
                </Button>
              </Box>
              {(chainId ? SUGGESTED_BASES[chainId] || [] : []).map((token: Token) => {
                const selected = selectedCurrency?.equals(token);
                return (
                  <Box key={token.symbol}>
                    <Button
                      variant='outline'
                      leftIcon={<CurrencyLogo currency={token} />}
                      onClick={() => !selected && onSelect(token)}
                    >
                      {token.symbol}
                    </Button>
                  </Box>
                 )
              })}
            </Wrap>
          </Box>
        </VStack>
      </Box>
    </>
  )
}
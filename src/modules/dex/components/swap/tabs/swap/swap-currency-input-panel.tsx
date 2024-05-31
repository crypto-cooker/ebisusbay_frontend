import {Currency, Token} from "@uniswap/sdk-core";
import {Card} from "@src/components-v2/foundation/card";
import {Box, Button, Flex, HStack, Image, NumberInput, NumberInputField, useDisclosure} from "@chakra-ui/react";
import {ChevronDownIcon} from "@chakra-ui/icons";
import {ResponsiveChooseTokenDialog} from "@dex/components/swap/responsive-choose-token-dialog";
import tokenConfig from "@dex/configs/tokens.json";
import {DexToken} from "@dex/types/types";
import {useCallback} from "react";

const supportedTokens = tokenConfig.tokens.map(token => {
  return new Token(
    token.chainId,
    token.address,
    token.decimals,
    token.symbol,
    token.name
  )
}) as Token[];
const commonBases = supportedTokens.filter(token => tokenConfig.commonBases.map(symbol =>  symbol.toLowerCase()).includes(token.symbol!.toLowerCase()));

interface SwapCurrencyInputPanelProps {
  value: string;
  onUserInput: (value: string) => void;
  label: string;
  onCurrencySelect: (currency: Currency) => void
  currency?: Currency | null
  otherCurrency?: Currency | null
}

export default function SwapCurrencyInputPanel({ value, onUserInput, label, onCurrencySelect, currency, otherCurrency }: SwapCurrencyInputPanelProps) {
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();

  const handleSelectedCurrency = useCallback((currency: Currency) => {
    onModalClose();
    onCurrencySelect(currency);
  }, [onCurrencySelect])

  return (
    <>
      <Card>
        <Flex justify='space-between' fontSize='sm'>
          <Box>{label}</Box>
          <Box>Balance: 0</Box>
        </Flex>
        <HStack>
          <NumberInput
            variant='unstyled'
            value={value}
            onChange={onUserInput}
            flex={1}
          >
            <NumberInputField
              fontSize='2xl'
              placeholder='0.0'
            />
          </NumberInput>

          <Button onClick={onModalOpen}>
            <HStack>
              {!!currency && (
                <Box as='span' minW='30px'>
                  <Image w='30px' src={(currency as any).logoURI} />
                </Box>
              )}
              <span>
                {currency ? currency?.symbol : 'Select token'}
              </span>
              <ChevronDownIcon />
            </HStack>
          </Button>
        </HStack>
      </Card>
      {!!onCurrencySelect && (
        <ResponsiveChooseTokenDialog
          isOpen={isModalOpen}
          onClose={onModalClose}
          onCurrencySelect={handleSelectedCurrency}
          selectedCurrency={currency}
          otherSelectedCurrency={otherCurrency}
          commonBases={commonBases}
          tokens={supportedTokens}
          modalProps={{size: 'lg', isCentered: false}}
        />
      )}
    </>
  )
}
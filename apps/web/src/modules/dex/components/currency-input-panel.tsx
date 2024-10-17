import {Card} from "@src/components-v2/foundation/card";
import {Box, Button, Flex, HStack, Image, NumberInput, NumberInputField, useDisclosure} from "@chakra-ui/react";
import {ChevronDownIcon} from "@chakra-ui/icons";
import {ResponsiveChooseTokenDialog} from "@dex/swap/components/tabs/swap/responsive-choose-token-dialog";
import tokenConfig from "@dex/config/tokens.json";
import React, {useCallback} from "react";
import useSupportedTokens from "@dex/hooks/use-supported-tokens";
import {Currency} from "@pancakeswap/sdk";
import {useCurrencyBalance} from "@eb-pancakeswap-web/state/wallet/hooks";
import {useUser} from "@src/components-v2/useUser";
import {CurrencySearchModal} from "@dex/components/search-modal";
import {CurrencyLogo} from "@dex/components/logo";

interface CurrencyInputPanelProps {
  value: string | undefined;
  onUserInput: (value: string) => void;
  label: string;
  onCurrencySelect: (currency: Currency) => void
  currency?: Currency | null
  otherCurrency?: Currency | null
  onMax?: () => void
  disabled?: boolean
  disableCurrencySelect?: boolean
}

export default function CurrencyInputPanel({
 value,
 onUserInput,
 label,
 onCurrencySelect,
 currency,
 otherCurrency,
 onMax,
 disabled,
 disableCurrencySelect
}: CurrencyInputPanelProps) {

  const {address: account} = useUser();
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
  const { supportedTokens } = useSupportedTokens();
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined);

  const handleSelectedCurrency = useCallback((currency: Currency) => {
    onModalClose();
    onCurrencySelect(currency);
  }, [onCurrencySelect])

  return (
    <>
      <Card>
        <Flex justify='space-between' fontSize='sm'>
          <Box>{label}</Box>

          <Box
            onClick={!disabled ? onMax : undefined}
            cursor='pointer'
          >
            Balance: {selectedCurrencyBalance?.toSignificant(6)}
          </Box>
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

          <Button onClick={() => !disableCurrencySelect ? onModalOpen() : undefined}>
            <HStack>
              {!!currency && (
                <Box as='span' minW='30px'>
                  <CurrencyLogo currency={currency} />
                </Box>
              )}
              <span>
                {currency ? currency?.symbol : 'Select token'}
              </span>
              {!disableCurrencySelect && <ChevronDownIcon />}
            </HStack>
          </Button>
        </HStack>
      </Card>
      {!!onCurrencySelect && (
        <CurrencySearchModal
          isOpen={isModalOpen}
          onClose={onModalClose}
          onCurrencySelect={handleSelectedCurrency}
          showCommonBases
          selectedCurrency={currency}
        />
      )}
    </>
  )
}
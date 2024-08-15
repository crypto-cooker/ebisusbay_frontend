import {Card} from "@src/components-v2/foundation/card";
import {Box, Button, Flex, HStack, Image, NumberInput, NumberInputField, useDisclosure} from "@chakra-ui/react";
import {ChevronDownIcon} from "@chakra-ui/icons";
import {ResponsiveChooseTokenDialog} from "@dex/swap/components/tabs/swap/responsive-choose-token-dialog";
import tokenConfig from "@dex/config/tokens.json";
import {useCallback} from "react";
import useSupportedTokens from "@dex/hooks/use-supported-tokens";
import {Currency} from "@pancakeswap/sdk";
import {useCurrencyBalance} from "@eb-pancakeswap-web/state/wallet/hooks";
import {useUser} from "@src/components-v2/useUser";

interface SwapCurrencyInputPanelProps {
  value: string;
  onUserInput: (value: string) => void;
  label: string;
  onCurrencySelect: (currency: Currency) => void
  currency?: Currency | null
  otherCurrency?: Currency | null
  onMax?: () => void
  disabled?: boolean
}

export default function SwapCurrencyInputPanel({
  value,
  onUserInput,
  label,
  onCurrencySelect,
  currency,
  otherCurrency,
  onMax,
  disabled,
}: SwapCurrencyInputPanelProps) {

  const {address: account} = useUser();
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
  const { supportedTokens } = useSupportedTokens();
  const commonBases = supportedTokens.filter(token => tokenConfig.commonBases.map(symbol =>  symbol.toLowerCase()).includes(token.symbol!.toLowerCase()));
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

          <Button onClick={onModalOpen}>
            <HStack>
              {!!currency && (
                <Box as='span' minW='30px'>
                  <Image w='30px' src={`https://cdn-prod.ebisusbay.com/files/dex/images/tokens/${currency?.symbol.toLowerCase()}.webp`} />
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
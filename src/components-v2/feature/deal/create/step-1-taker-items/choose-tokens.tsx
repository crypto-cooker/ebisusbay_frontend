import {useUser} from "@src/components-v2/useUser";
import useCurrencyBroker, {BrokerCurrency} from "@src/hooks/use-currency-broker";
import useBarterDeal from "@src/components-v2/feature/deal/use-barter-deal";
import {useCallback, useState} from "react";
import ReactSelect, {SingleValue} from "react-select";
import {toast} from "react-toastify";
import {getTheme} from "@src/Theme/theme";
import {
  Container,
  Flex,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack
} from "@chakra-ui/react";
import {TitledCard} from "@src/components-v2/foundation/card";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import {CustomTokenPicker} from "@src/components-v2/feature/deal/create/custom-token-picker";
import {BarterToken} from "@src/jotai/atoms/deal";

export const ChooseTokensTab = ({address}: {address: string}) => {
  const { toggleSelectionERC20 } = useBarterDeal();

  const handleAddCustomToken = (token: BarterToken) => {
    toggleSelectionERC20(token);
  }

  return (
    <Container>
      <Stack spacing={4}>
        <WhitelistedTokenPicker />
        <CustomTokenPicker onAdd={handleAddCustomToken} />
      </Stack>
    </Container>
  )
}

const WhitelistedTokenPicker = () => {
  const user = useUser();
  const { whitelistedERC20DealCurrencies  } = useCurrencyBroker();
  const { toggleSelectionERC20 } = useBarterDeal();
  const [quantity, setQuantity] = useState<string>();
  const [selectedCurrency, setSelectedCurrency] = useState<BrokerCurrency>(whitelistedERC20DealCurrencies[0]);

  const handleCurrencyChange = useCallback((currency: SingleValue<BrokerCurrency>) => {
    setSelectedCurrency(currency!);
  }, [selectedCurrency]);

  const handleAddCurrency = () => {
    if (!selectedCurrency) {
      toast.error('A currency is required');
      return;
    }

    if (!quantity) {
      toast.error('An amount is required');
      return;
    }

    toggleSelectionERC20({
      ...selectedCurrency,
      amount: Math.floor(parseInt(quantity)),
    })
  }

  const userTheme = user.theme;
  const customStyles = {
    menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
    option: (base: any, state: any) => ({
      ...base,
      background: getTheme(userTheme).colors.bgColor2,
      color: getTheme(userTheme).colors.textColor3,
      borderRadius: state.isFocused ? '0' : 0,
      '&:hover': {
        background: '#eee',
        color: '#000',
      },
    }),
    menu: (base: any) => ({
      ...base,
      borderRadius: 0,
      marginTop: 0,
    }),
    menuList: (base: any) => ({
      ...base,
      padding: 0,
    }),
    singleValue: (base: any, state: any) => ({
      ...base,
      background: getTheme(userTheme).colors.bgColor2,
      color: getTheme(userTheme).colors.textColor3
    }),
    control: (base: any, state: any) => ({
      ...base,
      background: getTheme(userTheme).colors.bgColor2,
      color: getTheme(userTheme).colors.textColor3,
      padding: 1,
      minWidth: '132px',
      borderColor: 'none'
    }),
  };

  return (
    <TitledCard title='Available Tokens'>
      <Stack direction={{base: 'column', sm: 'row'}}>
        <ReactSelect
          isSearchable={false}
          menuPortalTarget={document.body} menuPosition={'fixed'}
          styles={customStyles}
          options={whitelistedERC20DealCurrencies}
          formatOptionLabel={({ name, image }) => (
            <HStack>
              {image}
              <span>{name}</span>
            </HStack>
          )}
          value={selectedCurrency}
          defaultValue={whitelistedERC20DealCurrencies[0]}
          onChange={handleCurrencyChange}
        />
        <NumberInput
          value={quantity}
          max={1000000}
          onChange={(valueAsString: string) => setQuantity(valueAsString)}
          precision={0}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Stack>
      <Flex justify='end' mt={2}>
        <PrimaryButton onClick={handleAddCurrency}>
          Add
        </PrimaryButton>
      </Flex>
    </TitledCard>
  )
}
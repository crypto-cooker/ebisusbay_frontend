import {useUser} from "@src/components-v2/useUser";
import useCurrencyBroker, {BrokerCurrency} from "@src/hooks/use-currency-broker";
import useBarterDeal from "@src/components-v2/feature/deal/use-barter-deal";
import React, {useCallback, useState} from "react";
import ReactSelect, {SingleValue} from "react-select";
import {toast} from "react-toastify";
import {isWrappedeCro} from "@src/utils";
import {Contract, ethers} from "ethers";
import WCRO from "@src/Contracts/WCRO.json";
import {parseErrorMessage} from "@src/helpers/validator";
import {getTheme} from "@src/Theme/theme";
import {
  Box,
  Container,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack
} from "@chakra-ui/react";
import {Card, TitledCard} from "@src/components-v2/foundation/card";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import {appConfig} from "@src/Config";
import {BarterToken} from "@src/jotai/atoms/deal";
import {CustomTokenPicker} from "@src/components-v2/feature/deal/create/custom-token-picker";

const config = appConfig();

export const ChooseTokensTab = ({address}: {address: string}) => {
  const { toggleOfferERC20 } = useBarterDeal();

  const handleAddCustomToken = (token: BarterToken) => {
    toggleOfferERC20(token);
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
  const { toggleOfferERC20 } = useBarterDeal();
  const [quantity, setQuantity] = useState<string>();
  const [selectedCurrency, setSelectedCurrency] = useState<BrokerCurrency>(whitelistedERC20DealCurrencies[0]);
  const [isWrapping, setIsWrapping] = useState(false);

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

    toggleOfferERC20({
      ...selectedCurrency,
      amount: Math.floor(parseInt(quantity)),
    });
  }

  const handleWrapCro = async () => {
    if (!selectedCurrency) {
      toast.error('A currency is required');
      return;
    }

    if (!isWrappedeCro(selectedCurrency.address)) {
      toast.error('CRO must be selected for this action');
      return;
    }

    if (!quantity) {
      toast.error('An amount is required');
      return;
    }

    try {
      setIsWrapping(true);
      const amountInWei = ethers.utils.parseEther(quantity);
      const contract = new Contract(config.tokens.wcro.address, WCRO, user.provider.signer)
      const tx = await contract.deposit({ value: amountInWei });
      await tx.wait();

      toast.success('CRO wrapped successfully to WCRO');
      toggleOfferERC20({
        ...selectedCurrency,
        amount: Math.floor(parseInt(quantity)),
      });
    } catch (e) {
      console.log(e);
      toast.error(parseErrorMessage(e));
    } finally {
      setIsWrapping(false);
    }
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
      <Stack direction={{base: 'column', sm: 'row'}} justify='end' mt={2}>
        {isWrappedeCro(selectedCurrency.address) && (
          <>
            <Box fontSize='sm'>If wanting to use native CRO for the deal, you can choose to wrap to WCRO</Box>
            <PrimaryButton
              onClick={handleWrapCro}
              isLoading={isWrapping}
              isDisabled={isWrapping}
              loadingText='Wrapping'
            >
              Wrap and Add
            </PrimaryButton>
          </>
        )}
        {!isWrapping && (
          <PrimaryButton onClick={handleAddCurrency}>
            Add
          </PrimaryButton>
        )}
      </Stack>
    </TitledCard>
  )
}

import {useUser} from "@src/components-v2/useUser";
import useCurrencyBroker, {BrokerCurrency} from "@market/hooks/use-currency-broker";
import useBarterDeal from "@src/components-v2/feature/deal/use-barter-deal";
import React, {useCallback, useState} from "react";
import ReactSelect, {SingleValue} from "react-select";
import {toast} from "react-toastify";
import {ciEquals, isWrappedeCro, round} from "@market/helpers/utils";
import {Contract, ethers} from "ethers";
import WCRO from "@src/global/contracts/WCRO.json";
import {parseErrorMessage} from "@src/helpers/validator";
import {getTheme} from "@src/global/theme/theme";
import {
  Box,
  Container,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper, Spacer, Spinner,
  Stack, VStack
} from "@chakra-ui/react";
import {Card, TitledCard} from "@src/components-v2/foundation/card";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import {appConfig} from "@src/Config";
import {BarterToken} from "@market/state/jotai/atoms/deal";
import {CustomTokenPicker} from "@src/components-v2/feature/deal/create/custom-token-picker";
import {commify} from "ethers/lib/utils";
import {useQuery} from "@tanstack/react-query";
import {ERC20} from "@src/global/contracts/Abis";

const config = appConfig();
const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);

export const ChooseTokensTab = ({address}: {address: string}) => {
  const { toggleOfferERC20 } = useBarterDeal();

  const handleAddCustomToken = (token: BarterToken) => {
    toggleOfferERC20(token);
  }

  return (
    <Container>
      <Stack spacing={4}>
        <WhitelistedTokenPicker balanceCheckAddress={address} />
        <CustomTokenPicker onAdd={handleAddCustomToken} />
      </Stack>
    </Container>
  )
}

const WhitelistedTokenPicker = ({balanceCheckAddress}: {balanceCheckAddress: string}) => {
  const user = useUser();
  const { whitelistedERC20DealCurrencies  } = useCurrencyBroker();
  const { toggleOfferERC20 } = useBarterDeal();
  const [quantity, setQuantity] = useState<string>();
  const [isWrapping, setIsWrapping] = useState(false);

  const sortedWhitelistedERC20DealCurrencies = whitelistedERC20DealCurrencies.sort((a, b) => {
    // Place FRTN first
    if (ciEquals(a.symbol, config.tokens.frtn.symbol)) return -1;
    if (ciEquals(b.symbol, config.tokens.frtn.symbol)) return 1;

    // Place WCRO second
    if (ciEquals(a.symbol, config.tokens.wcro.symbol)) return -1;
    if (ciEquals(b.symbol, config.tokens.wcro.symbol)) return 1;

    // Place USDC third
    if (ciEquals(a.symbol, config.tokens.usdc.symbol)) return -1;
    if (ciEquals(b.symbol, config.tokens.usdc.symbol)) return 1;

    // Alphabetically sort the rest
    return a.symbol.localeCompare(b.symbol);
  });

  const [selectedCurrency, setSelectedCurrency] = useState<BrokerCurrency>(sortedWhitelistedERC20DealCurrencies[0]);

  const { data: availableBalance, isLoading } = useQuery({
    queryKey: ['balance', balanceCheckAddress, selectedCurrency.address],
    queryFn: async () => {
      const readContract = new Contract(selectedCurrency.address, ERC20, readProvider);
      const count = await readContract.balanceOf(balanceCheckAddress);
      let native = 0;
      if (isWrappedeCro(selectedCurrency.address)) {
        const cro = await readProvider.getBalance(balanceCheckAddress);
        native = Number(ethers.utils.formatEther(cro));
      }
      return {native, selected: Number(ethers.utils.formatUnits(count, selectedCurrency.decimals))};
    },
    enabled: !!selectedCurrency,
  });

  const handleCurrencyChange = useCallback((currency: SingleValue<BrokerCurrency>) => {
    if (!currency) return;

    setSelectedCurrency(currency);
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
      amount: Number(quantity),
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
          options={sortedWhitelistedERC20DealCurrencies}
          formatOptionLabel={({ symbol, image }) => (
            <HStack>
              <Box as='span' minW='30px'>{image}</Box>
              <span>{symbol}</span>
            </HStack>
          )}
          value={selectedCurrency}
          defaultValue={sortedWhitelistedERC20DealCurrencies[0]}
          onChange={handleCurrencyChange}
        />
        <NumberInput
          value={quantity}
          max={100000000000000}
          onChange={(valueAsString: string) => setQuantity(valueAsString)}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Stack>
      <Stack direction={{base: 'column', sm: 'row'}} justify='space-between' mt={2}>
        <Box mt='auto'>
          {!!selectedCurrency && (
            <VStack align='start' spacing={0}>
              {!!availableBalance && availableBalance.native > 0 && (
                <HStack fontSize='sm'>
                  <Box fontWeight='bold'>CRO Balance:</Box>
                  <Box>{isLoading ? <Spinner size='sm' /> : commify(round(availableBalance.native || 0))}</Box>
                </HStack>
              )}
              <HStack fontSize='sm'>
                <Box fontWeight='bold'>Balance:</Box>
                <Box>{isLoading ? <Spinner size='sm' /> : commify(availableBalance?.selected || 0)}</Box>
              </HStack>
            </VStack>
          )}
        </Box>
        <Stack direction={{base: 'column', sm: 'row'}} justify='end' mt={2}>
          {isWrappedeCro(selectedCurrency.address) && (
            <>
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
      </Stack>

      {isWrappedeCro(selectedCurrency.address) && (
        <Box fontSize='sm' mt={2}>If wanting to use native CRO for the deal, you can choose to wrap to WCRO</Box>
      )}
    </TitledCard>
  )
}

import React, {useEffect, useState} from "react";
import {Contract} from "ethers";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Image,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Text,
  VStack
} from "@chakra-ui/react";
import {RdModalBox} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";
import {appConfig} from "@src/Config";
import {createSuccessfulTransactionToastContent} from "@src/utils";
import RdButton from "../../../../components/rd-button";
import {ApiService} from "@src/core/services/api-service";
import {useUser} from "@src/components-v2/useUser";
import useEnforceSigner from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import AuthenticationRdButton from "@src/components-v2/feature/ryoshi-dynasties/components/authentication-rd-button";
import ImageService from "@src/core/services/image";
import {toast} from "react-toastify";
import {parseErrorMessage} from "@src/helpers/validator";
import Resources from "@src/Contracts/Resources.json";

const config = appConfig();
enum ActionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW'
}

const ResourcesTab = () => {
  const user = useUser();
  const {signature} = useEnforceSigner();

  const [selectedResourceAction, setSelectedResourceAction] = useState<{ id: number, action: ActionType }>();
  const [keyedBalances, setKeyedBalances] = useState<any>({});

  const { data: balances, status, error, refetch } = useQuery({
    queryKey: ['UserResourcesBalances', user.address],
    queryFn: () => ApiService.withoutKey().ryoshiDynasties.getResourcesBalances(user.address!, signature),
    enabled: !!user.address && !!signature,
  });

  useEffect(() => {
    if (!balances) return;
    const keyedBalances = balances.reduce((acc: any, balance: any) => {
      acc[balance.tokenId] = balance;
      return acc;
    }, {});
    if (!keyedBalances[1]) {
      keyedBalances[1] = {
        tokenId: 1,
        amount: 0
      }
    }
    setKeyedBalances(keyedBalances);
  }, [balances]);

  return (
    <RdModalBox textAlign='center'>
      <AuthenticationRdButton
        connectText='Connect and sign in to claim your daily reward'
        signinText='Sign in to claim your daily reward'
      >
        <Box textAlign='center'>
          Koban rewards from daily claims will be deposited here. Other resources may be added here in the future. By withdrawing these resources, they will be transferred to your wallet.
        </Box>
        {!!balances && balances.length > 0 && (
          <Accordion allowToggle>
            <AccordionItem style={{borderWidth:'0'}}>
              <Flex justify='space-between' mt={2} direction={{base: 'column', md: 'row'}}>
                <VStack align='start' spacing={0}>
                  <Text fontSize='xl' fontWeight='bold'>
                    Koban Balance
                  </Text>
                  {!!keyedBalances[1] && (
                    <HStack>
                      <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/koban.png').convert()} alt="kobanIcon" boxSize={6}/>
                      <Text fontSize='lg' fontWeight='bold'>{keyedBalances[1].amount}</Text>
                    </HStack>
                  )}
                </VStack>
                {!!keyedBalances[1] && (
                  <Flex direction='column' mt={{base: 2, md: 0}}>
                    <Stack direction={{base: 'column', sm: 'row'}} spacing={4}>
                      {/*<AccordionButton px={0}>*/}
                      {/*  <RdButton*/}
                      {/*    size='sm'*/}
                      {/*    w='full'*/}
                      {/*    onClick={() => setSelectedResourceAction({id: keyedBalances[1].tokenId, action: ActionType.DEPOSIT})}*/}
                      {/*  >*/}
                      {/*    Deposit*/}
                      {/*  </RdButton>*/}
                      {/*</AccordionButton>*/}
                      {keyedBalances[1].amount > 0 && (
                        <AccordionButton px={0}>
                          <RdButton
                            size='sm'
                            w='full'
                            onClick={() => setSelectedResourceAction({id: keyedBalances[1].tokenId, action: ActionType.WITHDRAW})}
                          >
                            Withdraw
                          </RdButton>
                        </AccordionButton>
                      )}
                    </Stack>
                  </Flex>
                )}
              </Flex>

              <AccordionPanel px={0}>
                {selectedResourceAction?.id === 1 && selectedResourceAction.action === ActionType.DEPOSIT ? (
                  <DepositForm tokenId={selectedResourceAction!.id} maxAmount={keyedBalances[1].amount} />
                ) : selectedResourceAction?.id === 1 && selectedResourceAction.action === ActionType.WITHDRAW && (
                  <WithdrawForm tokenId={selectedResourceAction!.id} maxAmount={keyedBalances[1].amount} />
                )}
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        )}
      </AuthenticationRdButton>
    </RdModalBox>
  )
}

export default ResourcesTab;

interface ActionFormProps {
  tokenId: number;
  maxAmount: number;
}

const WithdrawForm = ({tokenId, maxAmount}: ActionFormProps) => {
  const user = useUser();
  const {requestSignature, signature} = useEnforceSigner();
  const queryClient = useQueryClient();

  const [selectedQuantity, setSelectedQuantity] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState('');

  const handleQuantityChange = (stringValue: string, numValue: number) => setSelectedQuantity(stringValue);

  const claim = async ({tokenId, amount}: {tokenId: number, amount: number}) => {
    if (!user.address) return;

    try {
      setIsExecuting(true);
      const signature = await requestSignature();
      const authorization = await ApiService.withoutKey().ryoshiDynasties.requestResourcesWithdrawalAuthorization(tokenId, amount, user.address, signature);
      const {signature: approvalSignature, approval} = authorization.data;

      const resourcesContract = new Contract(config.contracts.resources, Resources, user.provider.getSigner());
      const tx = await resourcesContract.mintWithSig(approval, approvalSignature);
      const receipt = await tx.wait();
      return {
        tx: receipt,
        tokenId,
        amount
      }
    } finally {
      setIsExecuting(false);
    }
  }

  const mutation = useMutation({
    mutationFn: claim,
    onSuccess: data => {
      try {
        queryClient.setQueryData(['UserResourcesBalances', user.address], (old: any) => {
          if (!data || !Array.isArray(old)) return old;
          return old.map((balance: any) => {
            if (balance.tokenId === data.tokenId) {
              return { ...balance, amount: balance.amount - data.amount };
            }
            return balance;
          });
        });
      } catch (e) {
        console.log(e);
      } finally {
        toast.success(createSuccessfulTransactionToastContent(data?.tx.transactionHash));
      }
    },
    onError: (error: any) => {
      console.log(error);
      toast.error(parseErrorMessage(error));
    }
  });

  const handleWithdrawal = async (tokenId: number, amount: string | number) => {
    if (isNaN(Number(amount)) || Number(amount) <= 0 || Number(amount) > maxAmount) {
      setError('Invalid amount');
      return;
    }
    setError('');
    mutation.mutate({tokenId, amount: Number(amount)});
  }

  return (
    <Box>
      <FormControl isInvalid={!!error}>
        <Stack direction={{base: 'column', sm: 'row'}} justify='space-between'>
          <Stack direction='row'>
            <Box>
              <FormLabel>Amount to withdraw</FormLabel>
              <NumberInput
                defaultValue={1}
                min={1}
                max={maxAmount}
                onChange={handleQuantityChange}
                value={selectedQuantity}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Box>
            <Button
              variant={'outline'}
              onClick={() => setSelectedQuantity(maxAmount.toString())}
              color='white'
              alignSelf='end'
            >
              Max
            </Button>
          </Stack>
          <Box alignSelf={{base: 'center', sm: 'end'}}>
            <RdButton
              size='sm'
              w='full'
              onClick={() => handleWithdrawal(tokenId, selectedQuantity)}
              isLoading={isExecuting}
              loadingText='Confirming...'
            >
              Confirm
            </RdButton>
          </Box>
        </Stack>
        {/*<FormHelperText>By withdrawing this resource, it will become available in your wallet</FormHelperText>*/}
        <FormErrorMessage>{error}</FormErrorMessage>
      </FormControl>
    </Box>
  )
}

const DepositForm = ({tokenId, maxAmount}: ActionFormProps) => {
  const user = useUser();
  const {requestSignature, signature} = useEnforceSigner();
  const queryClient = useQueryClient();

  const [selectedQuantity, setSelectedQuantity] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState('');

  const handleQuantityChange = (stringValue: string, numValue: number) => setSelectedQuantity(stringValue);
  const handleSetMax = (amount: number) => {
    if (!isExecuting) return;
    setSelectedQuantity(amount.toString());
  }

  const claim = async ({tokenId, amount}: {tokenId: number, amount: number}) => {
    if (!user.address) return;

    try {
      setIsExecuting(true);
      const signature = await requestSignature();
      const authorization = await ApiService.withoutKey().ryoshiDynasties.requestResourcesWithdrawalAuthorization(tokenId, amount, user.address, signature);
      const {signature: approvalSignature, approval} = authorization.data;

      const resourcesContract = new Contract(config.contracts.resources, Resources, user.provider.getSigner());
      const tx = await resourcesContract.mintWithSig(approval, approvalSignature);
      const receipt = await tx.wait();
      return {
        tx: receipt,
        tokenId,
        amount
      }
    } finally {
      setIsExecuting(false);
    }
  }

  const mutation = useMutation({
    mutationFn: claim,
    onSuccess: data => {
      try {
        queryClient.setQueryData(['UserResourcesBalances', user.address], (old: any) => {
          if (!data) return old;
          return old.map((balance: any) => {
            if (balance.tokenId === data.tokenId) {
              balance.amount -= data.amount;
            }
            return balance;
          });
        });
      } catch (e) {
        console.log(e);
      } finally {
        toast.success(createSuccessfulTransactionToastContent(data?.tx.transactionHash));
      }
    },
    onError: (error: any) => {
      console.log(error);
      toast.error(parseErrorMessage(error));
    }
  });

  const handleDeposit = async (tokenId: number, amount: string | number) => {
    if (isNaN(Number(amount)) || Number(amount) <= 0 || Number(amount) > maxAmount) {
      setError('Invalid amount');
      return;
    }
    setError('');
    mutation.mutate({tokenId, amount: Number(amount)});
  }

  return (
    <Box>
      <FormControl isInvalid={!!error}>
        <Stack direction={{base: 'column', sm: 'row'}} justify='space-between'>
          <Stack direction='row'>
            <Box>
              <FormLabel>Amount to deposit</FormLabel>
              <NumberInput
                defaultValue={1}
                min={1}
                max={maxAmount}
                onChange={handleQuantityChange}
                value={selectedQuantity}
                isDisabled={isExecuting}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Box>
            <Button
              variant={'outline'}
              onClick={() => handleSetMax(maxAmount)}
              color='white'
            >
              Max
            </Button>
          </Stack>
          <Box alignSelf={{base: 'center', sm: 'end'}}>
            <RdButton
              size='sm'
              w='full'
              onClick={() => handleDeposit(tokenId, selectedQuantity)}
              isLoading={isExecuting}
              loadingText='Depositing...'
            >
              Confirm
            </RdButton>
          </Box>
        </Stack>
        <FormErrorMessage>{error}</FormErrorMessage>
      </FormControl>
    </Box>
  )
}
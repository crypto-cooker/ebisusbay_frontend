import {Box, Flex, Spacer, Text} from "@chakra-ui/react"
import React, {useEffect, useState} from "react";
import useCreateSigner from '@src/Components/Account/Settings/hooks/useCreateSigner'
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";

//contracts
import {Contract, ethers} from "ethers";
import {appConfig} from "@src/Config";
import {toast} from "react-toastify";
import Bank from "@src/Contracts/Bank.json";
import {createSuccessfulTransactionToastContent} from '@src/utils';
import moment from 'moment';
import {RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {useAppSelector} from "@src/Store/hooks";
import MetaMaskOnboarding from "@metamask/onboarding";
import {chainConnect, connectAccount} from "@src/GlobalState/User";
import {useDispatch} from "react-redux";

interface EmergencyWithdrawProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmergencyWithdraw = ({ isOpen, onClose}: EmergencyWithdrawProps) => {
  const dispatch = useDispatch();

  // const [isLoading, setIsLoading] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const user = useAppSelector((state) => state.user);
  const [isLoading, getSigner] = useCreateSigner();
  const config = appConfig();

  //deposit info
  const [hasDeposited, setHasDeposited] = useState(false);
  const [amountDeposited, setAmountDeposited] = useState(0);
  const [depositLength, setDepositLength] = useState(0);
  const [startTime, setStartTime] = useState<string>();
  const [depositsView, setDepositsView] = useState([])

  // const [remainingFortune, setRemainingFortune] = useState(0);
  // const [fortuneStaked, setFortuneStaked] = useState(amountDeposited);
  // const [fortuneToWithdraw, setFortuneToWithdraw] = useState(0);

  const [executingLabel, setExecutingLabel] = useState('Staking...');


  // const handleChangeFortune = (value) => {
  //   if(fortuneStaked - (value*2) >= 0) {
  //     setRemainingFortune(fortuneStaked - (value*2))
  //     setFortuneToWithdraw(value)
  //   }
  // }
  // const WithdrawFortune = async () => {
  //   setFortuneStaked(fortuneStaked - (fortuneToWithdraw*2))
  //   setRemainingFortune(fortuneStaked - (fortuneToWithdraw*2))
  //   setFortuneToWithdraw(0)
  // }

  const checkForDeposits = async () => {
    console.log("Checking for deposits", config.contracts.bank)
    const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
    const bank = new Contract(config.contracts.bank, Bank, readProvider);
    const deposits = await bank.deposits(user.address?.toLowerCase());

    //if has deposits, set state
    if(deposits[0].gt(0)){
      setHasDeposited(true);
      const daysToAdd = Number(deposits[1].div(86400));
      const newDate = new Date(Number(deposits[2].mul(1000)));
      const newerDate = newDate.setDate(newDate.getDate() + daysToAdd);

      setAmountDeposited(Number(ethers.utils.formatEther(deposits[0])));
      setDepositLength(daysToAdd);
      setStartTime(moment(newerDate).format("MMM D yyyy"));
    }
    else {
      setHasDeposited(false);
    }
  }
  const handleEmergencyWithdraw = async () => {
    try {
      setIsExecuting(true);
      setExecutingLabel('Withdrawing...');
      const bank = new Contract(config.contracts.bank, Bank, user.provider.getSigner());
      const tx = await bank.emergencyClose();
      const receipt = await tx.wait();
      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      checkForDeposits();
    } catch (error: any) {
      console.log(error)
      if(error.response !== undefined) {
        console.log(error)
        toast.error(error.response.data.error.metadata.message)
      }
      else {
        toast.error(error);
      }
    } finally {
      setIsExecuting(false);
    }

    console.log("Done")
  }

  const handleConnect = async () => {
    if (!user.address) {
      if (user.needsOnboard) {
        const onboarding = new MetaMaskOnboarding();
        onboarding.startOnboarding();
      } else if (!user.address) {
        dispatch(connectAccount());
      } else if (!user.correctChain) {
        dispatch(chainConnect());
      }
    }
  }

  useEffect(() => {
    if (user.address) {
      checkForDeposits();
    }
  }, [user.address]);

  return (
    <RdModal
      isOpen={isOpen}
      onClose={onClose}
      title='Emergency Withdraw'
    >
      <Box py={4}>
        <Text textAlign='center' fontSize={14}>Will return 50% of staked tokens and burn the rest</Text>
      </Box>

      {user.address ? (
        <>
          {hasDeposited ? (
            <>
              <Text align='center' fontSize='14'>$Fortune Tokens Staked: {amountDeposited}</Text>
              <Text align='center' fontSize='14'>$Fortune Tokens to Withdraw: {amountDeposited/2}</Text>

              <Flex alignContent={'center'} justifyContent={'center'}>
                {/* <Box textAlign={'center'}>
                <FormControl>
                  <FormLabel textAlign={'center'}></FormLabel>
                  <NumberInput
                    defaultValue={0}
                    min={0}
                    max={fortuneStaked/2}
                    name="quantity"
                    onChange={handleChangeFortune}
                    value={fortuneToWithdraw} type ='number'>
                  <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </Box> */}
              </Flex>
              <Box textAlign='center' mt={8} mx={2}>
                <Box ps='20px'>
                  <RdButton
                    w='250px'
                    fontSize={{base: 'xl', sm: '2xl'}}
                    stickyIcon={true}
                    onClick={handleEmergencyWithdraw}
                    isLoading={isExecuting}
                    disabled={isExecuting}
                  >
                    {user.address ? (
                      <>{isExecuting ? executingLabel : 'Withdraw'}</>
                    ) : (
                      <>Connect</>
                    )}
                  </RdButton>
                </Box>
              </Box>
              <Spacer h='8'/>
            </>
          ) : (
            <Box py={4}>
              <Text textAlign='center' fontSize={14}>You have no deposits to withdraw.</Text>
            </Box>
          )}
        </>
      ) : (
        <Box textAlign='center' pb={4} mx={2}>
          <Box ps='20px'>
            <RdButton
              w='250px'
              fontSize={{base: 'xl', sm: '2xl'}}
              stickyIcon={true}
              onClick={handleConnect}
              isLoading={isExecuting}
              disabled={isExecuting}
            >
              {user.address ? (
                <>{isExecuting ? executingLabel : 'Withdraw'}</>
              ) : (
                <>Connect</>
              )}
            </RdButton>
          </Box>
        </Box>
      )}
    </RdModal>
    
  )
}

export default EmergencyWithdraw;
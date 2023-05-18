import {RdButton, RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {useQuery} from "@tanstack/react-query";
import {useAppSelector} from "@src/Store/hooks";
import {ApiService} from "@src/core/services/api-service";
import {getAuthSignerInStorage} from "@src/helpers/storage";
import useCreateSigner from "@src/Components/Account/Settings/hooks/useCreateSigner";
import {Box, Text} from "@chakra-ui/react";
import {createSuccessfulTransactionToastContent, pluralize} from "@src/utils";
import {useState} from "react";
import {Contract} from "ethers";
import {toast} from "react-toastify";
import {appConfig} from "@src/Config";
import Resources from "@src/Contracts/Resources.json";
import MetaMaskOnboarding from "@metamask/onboarding";
import {chainConnect, connectAccount} from "@src/GlobalState/User";
import {useDispatch} from "react-redux";

const config = appConfig();

interface DailyCheckinProps {
  isOpen: boolean;
  onClose: () => void;
}
const DailyCheckin = ({isOpen, onClose}: DailyCheckinProps) => {
  const dispatch = useDispatch();

  const user = useAppSelector(state => state.user);
  const [isLoading, getSigner] = useCreateSigner();
  const [streak, setStreak] = useState(1);
  const [nextClaim, setNextClaim] = useState(0);

  const fetcher = async () => {
    // let signatureInStorage = getAuthSignerInStorage()?.signature;
    //
    // if (!signatureInStorage) {
    //   const { signature } = await getSigner();
    //   signatureInStorage = signature;
    // }
    // if (signatureInStorage) {
      return await ApiService.withoutKey().ryoshiDynasties.getDailyRewards(user.address!)
    // }

  }
  const {data} = useQuery(
    ['RyoshiDailyCheckin', user.address],
    fetcher,
    {
      enabled: !!user.address,
      refetchOnWindowFocus: false,
    }
  );

  console.log('data', data);

  const claimDailyRewards = async () => {
    if (!user.address) return;

    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {
        const authorization = await ApiService.withoutKey().ryoshiDynasties.claimDailyRewards(user.address, signatureInStorage);

        const sig = authorization.data.signature;
        const mintRequest = JSON.parse(authorization.data.metadata);
        console.log('auth', authorization)


        console.log('===contract', config.contracts.resources, Resources, user.provider.getSigner());
        const resourcesContract = new Contract(config.contracts.resources, Resources, user.provider.getSigner());
        console.log('===request', mintRequest, sig, authorization);
        const tx = await resourcesContract.mintWithSig(mintRequest, sig);

        const receipt = await tx.wait();
        toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));

      } catch (error) {
        console.log(error)
      }
    }
  }

  const connectWalletPressed = async () => {
    if (user.needsOnboard) {
      const onboarding = new MetaMaskOnboarding();
      onboarding.startOnboarding();
    } else if (!user.address) {
      dispatch(connectAccount());
    } else if (!user.correctChain) {
      dispatch(chainConnect());
    }
  };

  return (
    <RdModal
      isOpen={isOpen}
      onClose={onClose}
      title='Claim Daily Reward'
    >
      <Box mx={1} pb={4}>
        <Text align='center'>
          Earn $Koban by checking in daily. Multiply your rewards by claiming multiple days in a row!

        </Text>
        {!!user.address ? (
          <>
            <Text align='center' mt={4}>
              Your current streak is 1 {pluralize(1, 'day')}. Claim again in {nextClaim}
            </Text>
            <Box textAlign='center' mt={4}>
              <RdButton stickyIcon={true} onClick={claimDailyRewards}>Claim Koban</RdButton>
            </Box>
          </>
        ) : (
          <Box textAlign='center' mt={4}>
            <RdButton onClick={connectWalletPressed}>Connect Wallet</RdButton>
          </Box>
        )}
      </Box>
    </RdModal>
  )
}

export default DailyCheckin;
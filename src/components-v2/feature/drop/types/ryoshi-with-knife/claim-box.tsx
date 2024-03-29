import React, {useEffect, useState} from "react";
import {Box, HStack, Icon, IconButton} from "@chakra-ui/react";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRefresh} from "@fortawesome/free-solid-svg-icons";
import {useAtom} from "jotai/index";
import {dutchAuctionDataAtom} from "@src/components-v2/feature/drop/types/dutch/atom";
import {toast} from "react-toastify";
import {parseErrorMessage} from "@src/helpers/validator";
import {commify} from "ethers/lib/utils";
import FortuneIcon from "@src/components-v2/shared/icons/fortune";
import {createSuccessfulTransactionToastContent} from "@src/utils";
import {useUser} from "@src/components-v2/useUser";
import {rwkDataAtom} from "@src/components-v2/feature/drop/types/ryoshi-with-knife/atom";


const ClaimBox = () => {
  const user = useUser();
  const [rwkData, setRwkData] = useAtom(rwkDataAtom);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isClaimOpen, setIsClaimOpen] = useState(false);

  const handleClaim = async () => {
    try {
      setIsClaiming(true);
      const tx = await rwkData.writeContract!.claim(user.address!);
      const receipt = await tx.wait();

      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
    } catch (e) {
      console.log(e);
      toast.error(parseErrorMessage(e));
    } finally {
      setIsClaiming(false);
    }
  }

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await rwkData.refreshContract();
    } catch (e) {
      console.log(e);
      toast.error(parseErrorMessage(e));
    } finally {
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    async function checkStatus()  {
      if (rwkData.readContract) {
        const status = await rwkData.readContract.claimOpen();
        setIsClaimOpen(status);
      }
    }
  }, [rwkData.readContract]);

  return isClaimOpen && (
    <Box>
      {/*<Box fontWeight='bold'>Refund Balance</Box>*/}
      {/*<HStack justify='center' my={1}>*/}
      {/*  <FortuneIcon boxSize={4} />*/}
      {/*  <Box fontWeight='bold'>{commify(rwkData.refundDue)}</Box>*/}
      {/*</HStack>*/}
      <HStack justify='center' mt={2}>
        <PrimaryButton
          onClick={handleClaim}
          isDisabled={isClaiming}
          isLoading={isClaiming}
          loadingText='Claiming...'
        >
          Claim
        </PrimaryButton>
        <IconButton
          aria-label={'Claim Refresh'}
          icon={<Icon as={FontAwesomeIcon} icon={faRefresh} />}
          variant='outline'
          fontSize='sm'
          onClick={handleRefresh}
        />
      </HStack>
    </Box>
  )
}

export default ClaimBox;
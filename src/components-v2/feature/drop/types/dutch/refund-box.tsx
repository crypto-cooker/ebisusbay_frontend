import {Contract} from "ethers";
import React, {useState} from "react";
import {Box, HStack, Icon, IconButton} from "@chakra-ui/react";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRefresh} from "@fortawesome/free-solid-svg-icons";
import {useAtom} from "jotai/index";
import {dutchAuctionDataAtom} from "@src/components-v2/feature/drop/types/dutch/atom";
import {toast} from "react-toastify";
import {parseErrorMessage} from "@src/helpers/validator";
import {commify} from "ethers/lib/utils";
import {useAppSelector} from "@src/Store/hooks";


const RefundBox = () => {
  const user = useAppSelector((state) => state.user);
  const [auctionData, setAuctionData] = useAtom(dutchAuctionDataAtom);
  const [isRefunding, setIsRefunding] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefund = async () => {
    try {
      setIsRefunding(true);
      await auctionData.writeContract!.refundDifference(user.address!);
    } catch (e) {
      console.log(e);
      toast.error(parseErrorMessage(e));
    } finally {
      setIsRefunding(false);
    }
  }

  const handleRefresh = () => {
    try {
      setIsRefreshing(true);
    } catch (e) {
      console.log(e);
      toast.error(parseErrorMessage(e));
    } finally {
      setIsRefreshing(false);
    }
  }

  return (
    <Box>
      <Box fontWeight='bold'>Refund Balance</Box>
      <Box fontWeight='bold'>{commify(auctionData.refundDue)}</Box>
      <HStack justify='center'>
        <PrimaryButton
          onClick={handleRefund}
          disabled={isRefunding}
          isLoading={isRefunding}
          loadingText='Refunding...'
        >
          Refund
        </PrimaryButton>
        <IconButton
          aria-label={'Refund'}
          icon={<Icon as={FontAwesomeIcon} icon={faRefresh} />}
          variant='outline'
          fontSize='sm'
          onClick={handleRefresh}
        />
      </HStack>
    </Box>
  )
}

export default RefundBox;
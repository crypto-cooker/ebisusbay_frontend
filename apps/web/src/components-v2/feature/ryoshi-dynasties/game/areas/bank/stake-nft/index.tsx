import React, {useEffect, useState} from 'react';
import {RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {ArrowBackIcon} from "@chakra-ui/icons";
import FaqPage from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-nft/faq-page";
import {useUser} from "@src/components-v2/useUser";
import StakePage from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-nft/stake-page";

interface StakeNftsProps {
  isOpen: boolean;
  onClose: () => void;
}

const StakeNfts = ({isOpen, onClose}: StakeNftsProps) => {
  const user = useUser();
  const [page, setPage] = useState<string>();

  const handleClose = () => {
    onClose();
  }

  const handleBack = () => {
    if (!!page) {
      setPage(undefined);
    } else {
      setPage('faq');
    }
  };

  useEffect(() => {
    if (!user.address) {
      onClose();
    }
  }, [user.address]);

  return (
    <RdModal
      isOpen={isOpen}
      onClose={handleClose}
      title='Stake NFTs'
      size='5xl'
      isCentered={false}
      utilBtnTitle={!!page ? <ArrowBackIcon /> : <>?</>}
      onUtilBtnClick={handleBack}
    >
      {page === 'faq' ? (
        <FaqPage />
      ) : (
        <StakePage />
      )}
    </RdModal>
  )
}

export default StakeNfts;





import React, {useCallback, useState} from "react";
import {RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {ArrowBackIcon} from "@chakra-ui/icons";
import FaqPage from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/faq-page";
import StakePage from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/stake-page";

interface StakeFortuneProps {
  address: string;
  isOpen: boolean;
  onClose: () => void;
}

const StakeFortune = ({address, isOpen, onClose}: StakeFortuneProps) => {
  const [page, setPage] = useState('main');

  const handleClose = useCallback(() => {
    setPage('main');
    onClose();
  }, []);

  return (
    <RdModal
      isOpen={isOpen}
      onClose={handleClose}
      title='Stake Fortune'
      utilBtnTitle={page === 'faq' ? <ArrowBackIcon /> : <>?</>}
      onUtilBtnClick={() => setPage(page === 'faq' ? 'main' : 'faq')}
    >
      {page === 'faq' ? (
        <FaqPage />
      ) : (
        <StakePage />
      )}
    </RdModal>
  )
}

export default StakeFortune;
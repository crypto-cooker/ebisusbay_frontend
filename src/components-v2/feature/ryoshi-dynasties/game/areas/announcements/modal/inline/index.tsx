import React, {useCallback, useState, ReactElement} from "react";
import {Spinner} from 'react-bootstrap';
import {ArrowBackIcon} from "@chakra-ui/icons";
import MainPage from "@src/components-v2/feature/ryoshi-dynasties/game/areas/announcements/modal/main";
import LeaderboardPage from "@src/components-v2/feature/ryoshi-dynasties/game/areas/announcements/modal/leaderboard";
import {RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import FaqPage from "@src/components-v2/feature/ryoshi-dynasties/game/areas/announcements/modal/faq-page";
import RdInlineModal from "@src/components-v2/feature/ryoshi-dynasties/components/rd-inline-modal";

interface AnnouncementBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDailyCheckin: () => void;
}

const AnnouncementBoardModal = ({isOpen, onClose, onOpenDailyCheckin}: AnnouncementBoardModalProps) => {
  const [page, setPage] = useState<ReactElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState<string>('RYOSHI DYNASTIES');

  const returnHome = () => {
    setPage(null);
    setTitle('RYOSHI DYNASTIES');
  };

  const handleClose = () => {
    returnHome();
    onClose();
  };

  const handleBack = () => {
    // console.log('handleBack?', !!page, page);
    if (!!page) {
      returnHome();
    } else {
      setPage(<FaqPage />);
      setTitle('Ryoshi Dynasties FAQ');
    }
  };  

  const handleShowLeaderboard = useCallback(() => {
    setPage(<LeaderboardPage onReturn={returnHome} />)
    setTitle('Leaderboard');
  }, [returnHome]);

  return (
    <RdInlineModal
      title={title}
      isOpen={isOpen}
      onClose={handleClose}
      utilBtnTitle={!!page ? <ArrowBackIcon /> : <>?</>}
      onUtilBtnClick={handleBack}
    >         
          {!!page ? (
            <>{page}</>
          ) : (
            <MainPage 
              handleShowLeaderboard={handleShowLeaderboard} 
              onOpenDailyCheckin={onOpenDailyCheckin}/>
          )}
      
    </RdInlineModal>
  )
}

export default AnnouncementBoardModal;
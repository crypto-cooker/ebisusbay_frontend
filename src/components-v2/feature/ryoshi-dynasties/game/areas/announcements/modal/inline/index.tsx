import React, {useCallback, useState, ReactElement} from "react";
import {Spinner} from 'react-bootstrap';
import {ArrowBackIcon} from "@chakra-ui/icons";
import MainPage from "@src/components-v2/feature/ryoshi-dynasties/game/areas/announcements/modal/main";
import LeaderboardPage from "@src/components-v2/feature/ryoshi-dynasties/game/areas/announcements/modal/leaderboard";
import PatchNotes from "@src/components-v2/feature/ryoshi-dynasties/game/areas/announcements/modal/patch-notes-page";
import {RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import FaqPage from "@src/components-v2/feature/ryoshi-dynasties/game/areas/announcements/modal/faq-page";
import RdAnnouncementModal from "@src/components-v2/feature/ryoshi-dynasties/components/rd-announcement-modal";
import PatchNoteProps from "@src/components-v2/feature/ryoshi-dynasties/game/areas/announcements/modal/patch-notes-page";

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

  const handleShowPatchNotes = useCallback((changeDate:string, patchNumer:string, notes:string[]) => {
    setPage(<PatchNotes changeDate={patchNumer} patchNumber={changeDate} notes={notes} />)
  }, [returnHome]);

  return (
    <RdAnnouncementModal
      isOpen={isOpen}
      onClose={handleClose}
      utilBtnTitle={!!page ? <></> : <>?</>}
      isFAQ={!!page}
      onUtilBtnClick={handleBack}
    >         
          {!!page ? (
            <>{page}</>
          ) : (
            <MainPage 
              handleShowLeaderboard={handleShowLeaderboard} 
              onOpenDailyCheckin={onOpenDailyCheckin}
              handleShowPatchNotes={handleShowPatchNotes}
              />
          )}
      
    </RdAnnouncementModal>
  )
}

export default AnnouncementBoardModal;
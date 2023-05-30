import React, {useEffect, useState} from "react";
import {Spinner} from 'react-bootstrap';
import {ArrowBackIcon} from "@chakra-ui/icons";
import MainPage from "@src/components-v2/feature/ryoshi-dynasties/game/areas/announcements/modal/main";
import LeaderboardPage from "@src/components-v2/feature/ryoshi-dynasties/game/areas/announcements/modal/leaderboard";
import {RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";


interface AnnouncementBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AnnouncementBoardModal = ({isOpen, onClose}: AnnouncementBoardModalProps) => {
  const [page, setPage] = useState('info');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // SetUp();
    setPage('info');
  }, []);

  const handleShowLeaderboard = () => {
    setPage('leaderboard');
  }

  return (
    <RdModal
      isOpen={isOpen}
      onClose={onClose}
      title={page === 'info' ? 'RYOSHI DYNASTIES' : 'Leaderboard'}
      utilBtnTitle={<ArrowBackIcon />}
      onUtilBtnClick={() => setPage(page === 'info' ? 'leaderboard' : 'info')}
    >
      {!isLoading ? (
        <>
          {page === 'info' ? (
            <MainPage onShowLeaderboard={handleShowLeaderboard}/>
          ) : (
            <LeaderboardPage />
          )}
        </>
      ) : (
        <Spinner animation="border" role="status" size="sm" className="ms-1">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      )}
    </RdModal>
  )
}

export default AnnouncementBoardModal;
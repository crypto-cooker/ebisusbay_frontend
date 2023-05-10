import React, {useCallback, useEffect, useState} from "react";
import {Spinner} from 'react-bootstrap';
import localFont from "next/font/local";
import {getProfile} from "@src/core/cms/endpoints/profile";
import RdModal from "@src/components-v2/feature/ryoshi-dynasties/components/modal";
import {ArrowBackIcon} from "@chakra-ui/icons";
import AnnouncementPage from "@src/components-v2/feature/ryoshi-dynasties/game/areas/landingPage/announcementPage";
import LeaderBoardPage from "@src/components-v2/feature/ryoshi-dynasties/game/areas/landingPage/leaderBoardPage";

const gothamBook = localFont({ src: '../../../fonts/Gotham-Book.woff2' })

const AnnouncementBoardModal = ({isOpen, onClose}) => {
 
  const [page, setPage] = useState('info');
  const [isLoading, setIsLoading] = useState(false);
  // const user = useSelector((state) => state.user);
  const [profile, setProfile] = useState(null);

  // const SetUp = async () => {
  //   let profile1 = await getProfile(address);
  //   setProfile(profile1);
  // }

  const handleClose = useCallback(() => {
    setPage(initialPage);
    onClose();
  }, []);

  useEffect(() => {
    // SetUp();
    setPage('info');
  }, []);

  const showLeaderboard = () => {
    console.log("showLeaderboard");
    setPage('leaderboard');
  }

  return (
    <RdModal
      isOpen={isOpen}
      onClose={onClose}
      title={page === 'info' ? 'Ryoshi Dynasties' : 'Previous Game Winners'}
      utilBtnTitle={<ArrowBackIcon />}
      onUtilBtnClick={() => setPage(page === 'info' ? 'leaderboard' : 'info')}
    >
      {!isLoading ? (
        <>
          {page === 'info' ? (
            <AnnouncementPage showLeaderboard={showLeaderboard}/>
          ) : (
            <LeaderBoardPage/>
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
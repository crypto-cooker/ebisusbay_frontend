import Footer from "@src/Components/components/Footer";
import PageHead from "@src/Components/Head/PageHead";
import React, {useState} from "react";
import Barracks from "@src/Components/BattleBay/Areas/Barracks";
import BattleMap from "@src/Components/BattleBay/Areas/BattleMap";
import Leaderboard from "@src/Components/BattleBay/Areas/Leaderboard";
import Bank from "@src/Components/BattleBay/Areas/Bank";
import AllianceCenter from "@src/Components/BattleBay/Areas/AllianceCenter";
import AnnouncementBoard from "@src/Components/BattleBay/Areas/AnnouncementBoard";
import DefaultArea from "@src/Components/BattleBay/Areas/DefaultArea";

const BattleBay = () => {
  const [currentPage, setCurrentPage] = useState();
  const [preivousPage, setPreviousPage] = useState();

  const navigate = (page) => {
    setPreviousPage(currentPage)
    setCurrentPage(page)
  };
  const returnToPreviousPage = () => {
    setCurrentPage(preivousPage)
  };

  return (
    <>
      <PageHead
        title="Ryoshi Dynasties"
        description="some description.."
        url={`/battle-bay`}
      />
      {currentPage === 'barracks' ? (
        <Barracks onBack={returnToPreviousPage} />
      ) : currentPage === 'battleMap' ? (
        <BattleMap onBack={returnToPreviousPage}/>
      ) : currentPage === 'leaderboard' ? (
        <Leaderboard onBack={returnToPreviousPage}/>
      ): currentPage === 'bank' ? (
        <Bank onBack={returnToPreviousPage} />
      ): currentPage === 'allianceCenter' ? (
        <AllianceCenter onBack={returnToPreviousPage} />
      ): currentPage === 'announcementBoard' ? (
        <AnnouncementBoard onBack={returnToPreviousPage} />
      ): (
        <DefaultArea onChange={navigate} />
      )}
      <Footer />
    </>
  )
}

export default BattleBay;
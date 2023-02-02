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

  const navigate = (page) => {
    setCurrentPage(page)
  };

  return (
    <>
      <PageHead
        title="Ryoshi Dynasties"
        description="some description.."
        url={`/battle-bay`}
      />
      {currentPage === 'barracks' ? (
        <Barracks onChange={navigate} />
      ) : currentPage === 'battleMap' ? (
        <BattleMap />
      ) : currentPage === 'leaderboard' ? (
        <Leaderboard />
      ): currentPage === 'bank' ? (
        <Bank />
      ): currentPage === 'allianceCenter' ? (
        <AllianceCenter />
      ): currentPage === 'announcementBoard' ? (
        <AnnouncementBoard />
      ): (
        <DefaultArea onChange={navigate} />
      )}
      <Footer />
    </>
  )
}

export default BattleBay;
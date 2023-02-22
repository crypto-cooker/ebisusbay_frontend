import Footer from "@src/Components/components/Footer";
import PageHead from "@src/Components/Head/PageHead";
import React, {useState} from "react";

import Barracks from "@src/Components/BattleBay/Areas/Barracks";
import BattleMap from "@src/Components/BattleBay/Areas/BattleMap";
import Bank from "@src/Components/BattleBay/Areas/Bank";
import AllianceCenter from "@src/Components/BattleBay/Areas/AllianceCenter";
import AnnouncementBoard from "@src/Components/BattleBay/Areas/AnnouncementBoard";
import DefaultArea from "@src/Components/BattleBay/Areas/DefaultArea";
import Academy from "@src/Components/BattleBay/Areas/Academy";
import UserPage from "@src/Components/BattleBay/Areas/UserPage";

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

  //placeholder data until we get data from the backend
  const factions = [
    { clanType: "collection", rank: 1, faction: "Mad Merkat", troops: 52, owned:true, addresses: ["0x000002", "0x000001"], registered: true},
    { clanType: "user", rank: 2, faction: "CroSkull", troops: 17, owned:false, addresses: ["0x000001", "0x000001"], registered: false},
    { clanType: "collection", rank: 3, faction: "Boomer Squad", troops: 5, owned:false, addresses: ["0x000001", "0x000001"], registered: false},
    { clanType: "collection", rank: 4, faction: "Flaming Phenix Club", troops: 3, owned:false, addresses: ["0x000001", "0x000001"], registered: false},
  ]

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
        <BattleMap onBack={returnToPreviousPage} factions={factions}/>
      // ) : currentPage === 'leaderboard' ? (
      //   <Leaderboard onBack={returnToPreviousPage}/>
      ): currentPage === 'bank' ? (
        <Bank onBack={returnToPreviousPage} />
      ): currentPage === 'allianceCenter' ? (
        <AllianceCenter onBack={returnToPreviousPage} factions={factions}/>
      ): currentPage === 'academy' ? (
        <Academy onBack={returnToPreviousPage} />
      ): currentPage === 'announcementBoard' ? (
        <AnnouncementBoard onBack={returnToPreviousPage} />
      ): currentPage === 'userPage' ? (
        <UserPage onBack={returnToPreviousPage} factions={factions}/>
      ): (
        <DefaultArea onChange={navigate} />
        // <BattleMap onChange={navigate} />
      )}
      <Footer />
    </>
  )
}


export default BattleBay;
import Footer from "@src/Components/components/Footer";
import PageHead from "@src/Components/Head/PageHead";
import React, {useState} from "react";
import Barracks from "@src/Components/BattleBay/Areas/barracks";
import BattleMap from "@src/Components/BattleBay/Areas/BattleMap";
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
        <Barracks />
      ) : currentPage === 'battleMap' ? (
        <BattleMap />
      ) : (
        <DefaultArea onChange={navigate} />
      )}
      <Footer />
    </>
  )
}

export default BattleBay;
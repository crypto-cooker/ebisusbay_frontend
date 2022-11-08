import React, {useState} from 'react';

import Footer from '../src/Components/components/Footer';
import LegacyStaking from '@src/Components/Staking/LegacyStaking';
import withAuth from '../src/Components/withAuth';
import {Grid, GridItem, Heading, useColorModeValue} from "@chakra-ui/react";
import RyoshiStaking from "@src/Components/Staking/RyoshiStaking";
import {motion} from "framer-motion";
import {useDispatch, useSelector} from "react-redux";
import {closeBatch} from "@src/GlobalState/ryoshiStakingCartSlice";
import {BatchStakingDrawer} from "@src/Components/Staking/BatchStakingDrawer";

const MotionGrid = motion(Grid)
const tabs = {
  legacy: 'legacy',
  ryoshi: 'ryoshi'
};

const MyStaking = () => {
  const dispatch = useDispatch();
  const ryoshiStakingCart = useSelector((state) => state.ryoshiStakingCart);

  const batchListingBorderColor = useColorModeValue('#000', '#FFF');
  const [openMenu, setOpenMenu] = useState(tabs.ryoshi);
  const handleBtnClick = (key) => (element) => {
    setOpenMenu(key);
  };
  const variants = {
    expand: { gridTemplateColumns: '1fr 358px' },
    collapse: { gridTemplateColumns: '1fr 0' },
  }

  return (
    <div>

      <MotionGrid
        animate={ryoshiStakingCart.isDrawerOpen ? 'expand' : 'collapse'}
        variants={variants}
        gridTemplateColumns="1fr 0"
      >

        <GridItem>
          <section className="jumbotron breadcumb no-bg tint">
            <div className="mainbreadcumb">
              <div className="container">
                <div className="row m-10-hor">
                  <div className="col-12 text-center">
                    <Heading as="h1" size="2xl" className="text-center">My Staking</Heading>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="gl-legacy container">
            <div className="de_tab">
              <ul className="de_nav mb-2">
                <li className={`tab ${openMenu === tabs.ryoshi ? 'active' : ''} my-1`}>
                  <span onClick={handleBtnClick(tabs.ryoshi)}>Ryoshi VIP</span>
                </li>
                <li className={`tab ${openMenu === tabs.legacy ? 'active' : ''} my-1`}>
                  <span onClick={handleBtnClick(tabs.legacy)}>Legacy VIP</span>
                </li>
              </ul>

              <div className="de_tab_content">
                {openMenu === tabs.legacy && (
                  <LegacyStaking />
                )}
                {openMenu === tabs.ryoshi && (
                  <RyoshiStaking />
                )}
              </div>
            </div>
          </section>
          <Footer />
        </GridItem>
        <GridItem borderLeft={'0.5px solid'} borderLeftColor={batchListingBorderColor}>
          <BatchStakingDrawer
            onClose={() => dispatch(closeBatch())}
            position="fixed"
            w="358px"
            h="calc(100vh - 74px)"
          />
        </GridItem>
      </MotionGrid>
    </div>
  );
};

export default withAuth(MyStaking);

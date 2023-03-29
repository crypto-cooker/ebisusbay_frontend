import React, {useEffect, useState} from 'react';

import LegacyStaking from '@src/Components/Staking/LegacyStaking';
import {Box, Container, Grid, GridItem, Heading, Text, useBreakpointValue, useColorModeValue} from "@chakra-ui/react";
import RyoshiStaking from "@src/components-v2/feature/staking/ryoshi-staking";
import {motion} from "framer-motion";
import {useDispatch, useSelector} from "react-redux";
import {closeCart} from "@src/GlobalState/ryoshiStakingCartSlice";
import {BatchStakingDrawer} from "@src/Components/Staking/BatchStakingDrawer";
import RewardsCard from "@src/Components/Staking/RewardsCard";
import PageHead from "@src/components-v2/shared/layout/page-head";
import {MobileBatchStaking} from "@src/Components/Staking/MobileBatchStaking";

const MotionGrid = motion(Grid)
const tabs = {
  legacy: 'legacy',
  ryoshi: 'ryoshi'
};

const MyStaking = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const ryoshiStakingCart = useSelector((state) => state.ryoshiStakingCart);

  const batchListingBorderColor = useColorModeValue('#000', '#FFF');
  const [openMenu, setOpenMenu] = useState(tabs.ryoshi);
  const handleBtnClick = (key) => (element) => {
    setOpenMenu(key);
  };
  const variants = {
    expand: { gridTemplateColumns: '1fr 358px' },
    collapse: { gridTemplateColumns: '1fr 0px' },
  }
  const useMobileCartView = useBreakpointValue(
    {base: true, lg: false},
    {fallback: 'lg'},
  );

  useEffect(() => {
    if (!user.address && ryoshiStakingCart.isDrawerOpen) {
      dispatch(closeCart());
    }
  }, [user.address]);

  return (
    <>
      <PageHead
        title="Ebisu's Bay VIP Staking"
        description="Earn rewards generated through platform sales &#128640;"
        url={`/staking`}
      />
      <MotionGrid
        animate={ryoshiStakingCart.isDrawerOpen && !useMobileCartView ? 'expand' : 'collapse'}
        variants={variants}
        gridTemplateColumns="1fr 0"
      >

        <GridItem>
          <section className="jumbotron breadcumb no-bg tint">
            <div className="mainbreadcumb">
              <div className="container">
                <div className="row m-10-hor">
                  <div className="col-12 text-center">
                    <Heading as="h1" size="2xl" className="text-center">VIP Staking</Heading>
                    <Text>Earn rewards generated through platform sales &#128640;</Text>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <Container my={4}>
            <RewardsCard />
          </Container>

          <section className="container">
            <div className="de_tab">
              <ul className="de_nav mb-2">
                <li className={`tab ${openMenu === tabs.ryoshi ? 'active' : ''} my-1`}>
                  <span onClick={handleBtnClick(tabs.ryoshi)}>Ryoshi Tales VIP</span>
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
        </GridItem>
        <GridItem borderLeft={useMobileCartView ? 'none' : '0.5px solid'} borderLeftColor={batchListingBorderColor}>
          <BatchStakingDrawer
            onClose={() => dispatch(closeCart())}
            position="fixed"
            w="358px"
            h="calc(100vh - 74px)"
          />
        </GridItem>
      </MotionGrid>
      {useMobileCartView && (
        <MobileBatchStaking />
      )}
    </>
  );
};

export default MyStaking;

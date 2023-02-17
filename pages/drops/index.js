import React from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';

import DropsCarousel from '../../src/Components/components/DropsCarousel';
import CurrentDrops from '../../src/Components/components/CurrentDrops';
import UpcomingDrops from '../../src/Components/Drops/UpcomingDrops';
import PastDrops from '../../src/Components/Drops/PastDrops';
import { getTheme } from '../../src/Theme/theme';
import {hostedImage} from "../../src/helpers/image";
import Head from "next/head";
import PageHead from "../../src/Components/Head/PageHead";
import {Heading} from "@chakra-ui/react";

const Drops = () => {
  const userTheme = useSelector((state) => {
    return state.user.theme;
  });
  return (
    <div>
      <PageHead
        title="Latest Drops"
        description="View the hottest drops on the Ebisu's Bay Launchpad"
        url="/drops"
      />
      <section className="no-top mt-2 pb-2 bg-transparent">
        <div className="d-flex justify-content-center px-5">
          <p className="my-auto me-5">
          Now is your chance to mint a Founding Member VIP from the team that brought you Ebisu's Bay.
            <span className="fw-bold d-block d-md-inline-block text-end ms-3">            
                <a href='https://blog.seashrine.io/vip-founding-member-nft-presale-announcement-4b791d086d63' target="_blank" rel="noopener noreferrer" >Learn More</a>
            </span>
          </p>
          <div style={{ width: '70px' }} className="my-auto"> 
              <a href='https://seashrine.io/#mint' target="_blank" rel="noopener noreferrer" >
                <img src={hostedImage('/img/drops/seashrine-vip/drop.webp')} className="img-responsive" alt="Founding Member Membership" />
              </a>
          </div>
        </div>
      </section>
      <section className="jumbotron breadcumb no-bg" style={{ backgroundColor: getTheme(userTheme).colors.bgColor3 }}>
        <div className="container">
          <div className="row py-4">
            <DropsCarousel />
          </div>
        </div>
      </section>

      <section className="gl-legacy container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <Heading>Active Drops</Heading>
              <div className="small-border"></div>
            </div>
          </div>
          <div className="col-lg-12">
            <CurrentDrops useCarousel={false} />
          </div>
        </div>
      </section>

      <section className="gl-legacy container no-top">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <Heading>
                Upcoming Drops
              </Heading>
              <div className="small-border"></div>
            </div>
          </div>
          <div className="col-lg-12">
            <UpcomingDrops />
          </div>
        </div>
      </section>

      <section className="gl-legacy container no-top">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <Heading>Completed Drops</Heading>
              <div className="small-border"></div>
            </div>
          </div>
          <div className="col-lg-12">
            <PastDrops />
          </div>
        </div>
      </section>
    </div>
  );
};
export default Drops;

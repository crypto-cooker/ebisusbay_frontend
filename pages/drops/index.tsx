import React from 'react';

import DropsCarousel from '@src/components-v2/feature/drops/featured-carousel';
import CurrentDrops from '@src/components-v2/shared/drops/current-drops';
import UpcomingDrops from '@src/components-v2/feature/drops/upcoming-drops';
import PastDrops from '@src/components-v2/feature/drops/past-drops';
import {getTheme} from '@src/Theme/theme';
import PageHead from "@src/components-v2/shared/layout/page-head";
import {Heading} from "@chakra-ui/react";
import {useUser} from "@src/components-v2/useUser";

const Drops = () => {
  const {theme: userTheme} = useUser();
  return (
    <div>
      <PageHead
        title="Latest Drops"
        description="View the hottest drops on the Ebisu's Bay Launchpad"
        url="/drops"
      />
      {/*<section className="no-top mt-2 pb-2 bg-transparent">*/}
      {/*  <div className="d-flex justify-content-center px-5">*/}
      {/*    <p className="my-auto me-5">*/}
      {/*    Now is your chance to mint a Founding Member VIP from the team that brought you Ebisu's Bay.*/}
      {/*      <span className="fw-bold d-block d-md-inline-block text-end ms-3">            */}
      {/*          <a href='https://blog.seashrine.io/vip-founding-member-nft-presale-announcement-4b791d086d63' target="_blank" rel="noopener noreferrer" >Learn More</a>*/}
      {/*      </span>*/}
      {/*    </p>*/}
      {/*    <div style={{ width: '70px' }} className="my-auto"> */}
      {/*        <a href='https://seashrine.io/#mint' target="_blank" rel="noopener noreferrer" >*/}
      {/*          <img src={hostedImage('https://cdn-prod.ebisusbay.com/files/drop-images/seashrine-vip/drop.webp')} className="img-responsive" alt="Founding Member Membership" />*/}
      {/*        </a>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</section>*/}
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

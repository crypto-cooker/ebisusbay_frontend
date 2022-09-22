import React from 'react';

import Footer from '../src/Components/components/Footer';
import MyStakingComponent from '../src/Components/components/MyStaking';
import withAuth from '../src/Components/withAuth';
import {Heading} from "@chakra-ui/react";

const MyStaking = () => {
  const Content = () => (
    <>
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

      <section className="container">
        <MyStakingComponent />
      </section>

      <Footer />
    </>
  );

  return (
    <div>
      <Content />
    </div>
  );
};

export default withAuth(MyStaking);

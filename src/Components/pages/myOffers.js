import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';

import Footer from '../components/Footer';
import MadeOffers from '../Offer/MadeOffers';
import ReceivedOffers from '../Offer/ReceivedOffers';

const OFFERS_TAB = {
  make: 'Made Offers',
  receive: 'Received Offers',
};

const Tabs = styled.div`
  display: flex;
`;

const Tab = styled.div`
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textColor3};
  font-size: 18px;
  font-weight: bold;
  padding: 2px 18px;
  margin-right: 50px;
  border-bottom: solid 6px ${({ theme }) => theme.colors.borderColor4};

  &.active {
    border-bottom: solid 6px ${({ theme }) => theme.colors.borderColor3};
  }
`;

const MyOffers = () => {
  const walletAddress = useSelector((state) => state.user.address);
  const [tab, setTab] = useState(OFFERS_TAB.make);

  const Content = () => (
    <>
      <section className="jumbotron breadcumb no-bg tint">
        <div className="mainbreadcumb">
          <div className="container">
            <div className="row m-10-hor">
              <div className="col-12 text-center">
                <h1>My Offers</h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container">
        <Tabs>
          <Tab onClick={() => setTab(OFFERS_TAB.make)} className={`${tab === OFFERS_TAB.make ? 'active' : ''}`}>
            {OFFERS_TAB.make}
          </Tab>
          <Tab onClick={() => setTab(OFFERS_TAB.receive)} className={`${tab === OFFERS_TAB.receive ? 'active' : ''}`}>
            {OFFERS_TAB.receive}
          </Tab>
        </Tabs>
        {tab === OFFERS_TAB.make && <MadeOffers />}
        {tab === OFFERS_TAB.receive && <ReceivedOffers />}
      </section>

      <Footer />
    </>
  );

  return <div>{walletAddress ? <Content /> : <Redirect to="/marketplace" />}</div>;
};

export default MyOffers;

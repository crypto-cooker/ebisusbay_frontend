import React, { useState } from 'react';
import { createGlobalStyle } from 'styled-components';
import { Form } from 'react-bootstrap';

import Footer from '@src/Components/components/Footer';
import Switch from '@src/Components/components/common/Switch';
import { debounce } from '@src/utils';
import PageHead from "@src/Components/Head/PageHead";
import Header from './components/Header';
import Table from './components/Table';
import useFeatureFlag from '@src/hooks/useFeatureFlag';
import Constants from '@src/constants';

const GlobalStyles = createGlobalStyle`
  .mobile-view-list-item {
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    
    & > span:nth-child(2) {
      font-weight: 300;
    }
  }
  .jumbotron.tint{
    background-color: rgba(0,0,0,0.6);
    background-blend-mode: multiply;
  }
`;

const Collections = () => {
  const mobileListBreakpoint = 1000;

  const [searchTerms, setSearchTerms] = useState(null);

  const [timeFrame, setTimeFrame] = useState(null);

  const [onlyVerified, setOnlyVerified] = useState(false);

  const { Features } = Constants;

  const isSwitchEnabled = useFeatureFlag(Features.VERIFIED_SWITCH_COLLECTION);

  const handleSearch = debounce((event) => {
    const { value } = event.target;
    setSearchTerms(value);
  }, 300);

  return (
    <div>
      <PageHead
        title="Collections"
        description="View the top performing collections on Ebisu's Bay Marketplace"
        url="/collections"
      />
      <GlobalStyles />
      <Header title={'Collections'} />

      <section className="gl-legacy container no-top">
        <div className="row mt-4">
          <div className="col-lg-4 col-md-6">
            <Form.Control type="text" placeholder="Search for Collection" onChange={handleSearch} />
          </div>
          <div className="col-md-6 col-lg-8 text-end">
            <ul className="activity-filter">
              {isSwitchEnabled ? <li style={{ border: 'none' }}>
                <Switch isChecked={onlyVerified} setIsChecked={setOnlyVerified} checkedText={'Verified'} uncheckedText={'All'} />
              </li> : null}
              <li id="sale" className={timeFrame === '1d' ? 'active' : ''} onClick={() => setTimeFrame('1d')}>
                1d
              </li>
              <li id="sale" className={timeFrame === '7d' ? 'active' : ''} onClick={() => setTimeFrame('7d')}>
                7d
              </li>
              <li id="sale" className={timeFrame === '30d' ? 'active' : ''} onClick={() => setTimeFrame('30d')}>
                30d
              </li>
              <li id="sale" className={timeFrame === null ? 'active' : ''} onClick={() => setTimeFrame(null)}>
                All Time
              </li>
            </ul>
          </div>
        </div>
        <Table timeFrame={timeFrame} searchTerms={searchTerms} onlyVerified={onlyVerified} />
      </section>

      <Footer />
    </div>
  );
};
export default Collections;

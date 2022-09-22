import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { utils } from 'ethers';
import Card from '../src/Components/Leaderboard/Card';
import Table from '../src/Components/Leaderboard/Table';
import { getAllLeaderBoard } from '../src/GlobalState/leaderBoardSlice';
import { shortAddress } from '../src/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import styles from '../src/Components/Leaderboard/styles.module.scss';
import PageHead from "../src/Components/Head/PageHead";
import Footer from "../src/Components/components/Footer";
import {Badge} from "react-bootstrap";
import { Modal, ModalTitle } from 'react-bootstrap';
import styled from "styled-components";
import {Navigation, Pagination} from "swiper";
import {Swiper, SwiperSlide} from "swiper/react";

const headers = {
  totalVolume: ['User', 'Sales Volume', 'Buy Volume', 'Total Volume'],
  buyVolume: ['User', '# of Buys', 'Total Volume'],
  sellVolume: ['User', '# of Sales', 'Total Volume'],
  biggestSingleSale: ['User', 'Total Volume'],
};

const StyledModal = styled(Modal)`
  .modal-content {
    background: ${({ theme }) => theme.colors.bgColor1};
  }
`;

const StyledModalTitle = styled(ModalTitle)`
  color: ${({ theme }) => theme.colors.textColor3};
`;

export default function Stats() {
  const dispatch = useDispatch();
  const [timeframe, setTimeframe] = useState('30d');
  const [type, setType] = useState('totalVolume');
  const [showDialog, setShowDialog] = useState(false);

  const leaderBoard = useSelector((state) => {
    return state.leaderBoard;
  });

  const updateTimeframe = (val) => {
    setTimeframe(val);
  };

  useEffect(() => {
    dispatch(getAllLeaderBoard(timeframe));
  }, [timeframe]);

  const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div className={className} style={style} onClick={onClick}>
        <FontAwesomeIcon icon={faChevronLeft} />
      </div>
    );
  };

  const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div className={className} style={style} onClick={onClick}>
        <FontAwesomeIcon icon={faChevronRight} />
      </div>
    );
  };

  return (
    <div>
      <PageHead
        title="Stats"
        description="View the top performing NFTs and users on Ebisu's Bay Marketplace"
        url="/stats"
      />
      <section className="container">
        <div className="row">
          <div className="col-12 col-lg-7 text-center text-lg-start">
            <h2 className="mb-0">Cronos Marketplace NFT Sales</h2>
          </div>
          <div className="col-12 col-lg-5 text-center text-lg-end mt-4 mt-lg-0">
            <ul className="activity-filter">
              <li id="sale" className={timeframe === '1d' ? 'active' : ''} onClick={() => updateTimeframe('1d')}>
                1d
              </li>
              <li id="sale" className={timeframe === '7d' ? 'active' : ''} onClick={() => updateTimeframe('7d')}>
                7d
              </li>
              <li id="sale" className={timeframe === '30d' ? 'active' : ''} onClick={() => updateTimeframe('30d')}>
                30d
              </li>
              <li id="sale" className={timeframe === null ? 'active' : ''} onClick={() => updateTimeframe(null)}>
                All Time
              </li>
              {/*<li id="sale" className={timeframe === 'custom' ? 'active' : ''} onClick={() => updateTimeframe('custom')}>*/}
              {/*  Competition*/}
              {/*</li>*/}
            </ul>
          </div>
        </div>
        {timeframe === 'custom' && (
          <div>
            <p>
              Prizes up for grabs for the top 5 ranked wallets in each category! Competition runs from July 1st - 31st. &nbsp;
              <Badge bg="primary" onClick={() => setShowDialog(true)} className="cursor-pointer">More Info</Badge>
            </p>
          </div>
        )}
        <div className="d-flex gap-3 mt-lg-4 align-items-center justify-content-between">
          <div className={`nft ${styles.dots}`}>

            <Swiper
              spaceBetween={10}
              slidesPerView={1}
              navigation={true}
              loop={true}
              modules={[Navigation, Pagination]}
              className="mySwiper"
              breakpoints={{
                576: {
                  slidesPerView: 2,
                },
                768: {
                  slidesPerView: 3,
                },
                1200: {
                  slidesPerView: 4,
                },
              }}
            >
              <SwiperSlide>
                <Card
                  title="Most Total Volume"
                  onClick={() => setType('totalVolume')}
                  totalVolume={utils.commify(leaderBoard?.totalVolume[0]?.totalVolume || 0)}
                  name={shortAddress(leaderBoard?.totalVolume[0]?.address) || 0}
                  active={type === 'totalVolume'}
                />
              </SwiperSlide>
              <SwiperSlide>
                <Card
                  title="Most Buy Volume"
                  onClick={() => setType('buyVolume')}
                  totalVolume={utils.commify(leaderBoard?.buyVolume[0]?.totalVolume || 0)}
                  name={shortAddress(leaderBoard?.buyVolume[0]?.address) || 0}
                  active={type === 'buyVolume'}
                />
              </SwiperSlide>
              <SwiperSlide>
                <Card
                  title="Most Sell Volume"
                  onClick={() => setType('sellVolume')}
                  totalVolume={utils.commify(leaderBoard?.sellVolume[0]?.totalVolume || 0)}
                  name={shortAddress(leaderBoard?.sellVolume[0]?.address) || 0}
                  active={type === 'sellVolume'}
                />
              </SwiperSlide>
              <SwiperSlide>
                <Card
                  title="Biggest Single Sale"
                  onClick={() => setType('biggestSingleSale')}
                  totalVolume={utils.commify(leaderBoard?.biggestSingleSale[0]?.totalVolume || 0)}
                  name={shortAddress(leaderBoard?.biggestSingleSale[0]?.address) || 0}
                  active={type === 'biggestSingleSale'}
                />
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
        <div className="mt-4 table-responsive">
          <Table headers={headers[type]} items={leaderBoard[type]} />
        </div>
      </section>
      {timeframe === 'custom' &&
        <p className="text-center small"><a href="https://cdn.ebisusbay.com/Contest_Terms_and_Conditions.html">Contest Terms and
          Conditions</a></p>
      }

      <StyledModal show={showDialog} onHide={() => setShowDialog(false)}>
        <Modal.Header>
          <StyledModalTitle>Competition Details</StyledModalTitle>
        </Modal.Header>
        <Modal.Body>
          <p>Based on leaderboard results from July 1st - 31st, Ebisu's Bay will be awarding prizes in the following structure: </p>

          <span className="fw-bold">Total Volume</span>
          <ul>
            <li>1st - 8,000 CRO</li>
            <li>2nd - 5,000 CRO</li>
            <li>3rd - 3,000 CRO</li>
            <li>4th - 2,000 CRO</li>
            <li>5th - 2,000 CRO</li>
          </ul>

          <span className="fw-bold">Total Buy, Sell and Biggest Single Sale</span>
          <ul>
            <li>1st - 4,000 CRO</li>
            <li>2nd - 2,500 CRO</li>
            <li>3rd - 1,500 CRO</li>
            <li>4th - 1,000 CRO</li>
            <li>5th - 1,000 CRO</li>
          </ul>

          <p>So get trading, climbing and finding your way into the prize money!</p>
        </Modal.Body>

        <Modal.Footer>
          <button className="p-4 pt-2 pb-2 btn_menu inline white lead" onClick={() => setShowDialog(false)}>
            Close
          </button>
        </Modal.Footer>
      </StyledModal>

      <Footer />
    </div>
  );
}

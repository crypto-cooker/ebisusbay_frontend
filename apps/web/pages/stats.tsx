import React, {useEffect, useState} from 'react';
import {utils} from 'ethers';
import Card from '../src/Components/Leaderboard/Card';
import Table from '../src/Components/Leaderboard/Table';
import {getAllLeaderBoard} from '@market/state/redux/slices/leaderBoardSlice';
import {shortAddress} from '@market/helpers/utils';
import styles from '../src/Components/Leaderboard/styles.module.scss';
import PageHead from "@src/components-v2/shared/layout/page-head";
import {Navigation, Pagination} from "swiper/modules";
import {Swiper, SwiperSlide} from "swiper/react";
import {Heading, Link, Tag} from "@chakra-ui/react";
import {useRouter} from "next/router";
import {hostedImage} from "@src/helpers/image";
import {useAppDispatch, useAppSelector} from "@market/state/redux/store/hooks";
import {GetServerSidePropsContext} from "next";

const headers = {
  totalVolume: ['User', 'Sales Volume', 'Buy Volume', 'Total Volume'],
  buyVolume: ['User', '# of Buys', 'Total Volume'],
  sellVolume: ['User', '# of Sales', 'Total Volume'],
  biggestSingleSale: ['User', 'Total Volume'],
};

interface StatsProps {
  pageHead: any,
  initialTimeframe: string
}

export default function Stats({pageHead, initialTimeframe}: StatsProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [timeframe, setTimeframe] = useState(initialTimeframe);
  const [type, setType] = useState('totalVolume');
  const [showDialog, setShowDialog] = useState(false);

  const leaderBoard = useAppSelector((state) => {
    return state.leaderBoard;
  });

  const updateTimeframe = (val: string) => {
    let query = {
      time: val
    }

    router.push({
        pathname: '/stats',
        query: query
      },
      undefined, { shallow: true }
    );

    setTimeframe(val);
  };

  useEffect(() => {
    let filter: string | null = timeframe;
    if (timeframe === 'bc-all') {
      filter = 'custom'
    } else if (timeframe === 'bc-1d') {
      filter = 'custom2'
    } else if (timeframe === 'all') {
      filter = null
    }
    dispatch(getAllLeaderBoard(filter));
  }, [timeframe]);

  return (
    <div>
      <PageHead
        title={pageHead.title}
        description={pageHead.description}
        url={pageHead.url}
        image={pageHead.image}
      />
      <section className="gl-legacy container">
        <div className="row">
          <div className="col-12 col-lg-7 text-center text-lg-start">
            <Heading className="mb-0">Cronos Marketplace NFT Sales</Heading>
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
              <li id="sale" className={timeframe === 'all' ? 'active' : ''} onClick={() => updateTimeframe('all')}>
                All Time
              </li>
              {/*<li id="sale" className={timeframe === 'custom' ? 'active' : ''} onClick={() => updateTimeframe('custom')}>*/}
              {/*  Competition*/}
              {/*</li>*/}
              {/*<Menu>*/}
              {/*  <MenuButton*/}
              {/*    as={Button}*/}
              {/*    rightIcon={<ChevronDownIcon />}*/}
              {/*    variant="outline"*/}
              {/*    backgroundColor="#FF2D98"*/}
              {/*    color="white"*/}
              {/*    _hover={{ bg: '#FF2D98' }}*/}
              {/*    _expanded={{ bg: '#FF2D98' }}*/}
              {/*    _focus={{ bg: '#FF2D98' }}*/}
              {/*  >*/}
              {/*    Bored Candy*/}
              {/*  </MenuButton>*/}
              {/*  <MenuList*/}
              {/*    zIndex="2"*/}
              {/*  >*/}
              {/*    <MenuItem onClick={() => updateTimeframe('bc-1d')}>Daily</MenuItem>*/}
              {/*    <MenuItem onClick={() => updateTimeframe('bc-all')}>Overall</MenuItem>*/}
              {/*  </MenuList>*/}
              {/*</Menu>*/}
            </ul>
          </div>
        </div>
        {timeframe.startsWith('bc-') && (
          <div>
            <p>
              Daily prizes up for grabs for the top Bored Candy buyers and sellers! Competition runs from Nov 1st - 15th. &nbsp;
              <Link href="https://blog.ebisusbay.com/bored-candy-city-and-ebisus-bay-collaboration-5caa9f40cb64" isExternal>
                <Tag size='sm' colorScheme='blue' variant='solid' cursor='pointer'>More Info</Tag>
              </Link>
            </p>
          </div>
        )}
          <div className="d-flex gap-3 mt-lg-4 align-items-center justify-content-between">
            <div className={`nft ${styles.dots}`}>

              <Swiper
                spaceBetween={10}
                slidesPerView="auto"
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
                    totalVolume={utils.commify((leaderBoard?.totalVolume[0] as any)?.totalVolume || 0)}
                    name={shortAddress((leaderBoard?.totalVolume[0] as any)?.address) || 0}
                    active={type === 'totalVolume'}
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <Card
                    title="Most Buy Volume"
                    onClick={() => setType('buyVolume')}
                    totalVolume={utils.commify((leaderBoard?.buyVolume[0] as any)?.totalVolume || 0)}
                    name={shortAddress((leaderBoard?.buyVolume[0] as any)?.address) || 0}
                    active={type === 'buyVolume'}
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <Card
                    title="Most Sell Volume"
                    onClick={() => setType('sellVolume')}
                    totalVolume={utils.commify((leaderBoard?.sellVolume[0] as any)?.totalVolume || 0)}
                    name={shortAddress((leaderBoard?.sellVolume[0] as any)?.address) || 0}
                    active={type === 'sellVolume'}
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <Card
                    title="Biggest Single Sale"
                    onClick={() => setType('biggestSingleSale')}
                    totalVolume={utils.commify((leaderBoard?.biggestSingleSale[0] as any)?.totalVolume || 0)}
                    name={shortAddress((leaderBoard?.biggestSingleSale[0] as any)?.address) || 0}
                    active={type === 'biggestSingleSale'}
                  />
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
          <div className="mt-4 table-responsive">
            <Table headers={headers[type as keyof typeof headers]} items={leaderBoard[type as keyof typeof leaderBoard]} />
          </div>
      </section>
      {/*<p className="text-center small"><a href="https://cdn-prod.ebisusbay.com/Contest_Terms_and_Conditions.html">Contest Terms and*/}
      {/*  Conditions</a></p>*/}

      {/*<Modal isOpen={showDialog} onClose={() => setShowDialog(false)}>*/}
      {/*  <ModalOverlay />*/}
      {/*  <ModalContent>*/}
      {/*    <ModalHeader>Competition Details</ModalHeader>*/}
      {/*    <ModalCloseButton />*/}
      {/*    <ModalBody>*/}
      {/*      <Text>Ebisu’s Bay is going to be offering an exclusive 2 week long contest in collaboration with the Bored Candy City NFTs!</Text>*/}
      {/*    </ModalBody>*/}
      {/*  </ModalContent>*/}
      {/*</Modal>*/}
    </div>
  );
}

export const getServerSideProps = async ({ query }: GetServerSidePropsContext) => {
  const { time } = query;

  let initialTimeframe = time ?? '30d'
  const pageHead = {
    title: 'Stats',
    description: 'View the top performing NFTs and users on Ebisu\'s Bay Marketplace',
    url: '/stats',
    image: ''
  };

  if (time) {
    pageHead.url = `/stats?time=${time}`;
    if ((time as string).startsWith('bc-')) {
      pageHead.title = 'Bored Candy Volume Competition';
      pageHead.description = 'Daily prizes up for grabs for the top Bored Candy buyers and sellers! Competition runs from Nov 1st - 15th.';
      pageHead.image = hostedImage('https://cdn-prod.ebisusbay.com/files/collection-images/bored-candy/card.webp')
    }
  }

  return {
    props: {
      pageHead,
      initialTimeframe
    },
  };
};
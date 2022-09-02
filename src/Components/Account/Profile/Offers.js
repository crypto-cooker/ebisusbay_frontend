import {Collapse, Offcanvas} from "react-bootstrap";
import React, {useState, useEffect} from "react";
import useBreakpoint from "use-breakpoint";
import Button from "@src/Components/components/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleLeft, faFilter} from "@fortawesome/free-solid-svg-icons";
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';
import MadeOffers from "@src/Components/Offer/MadeOffers";
import ReceivedOffers from "@src/Components/Offer/ReceivedOffers";
import styled from "styled-components";
import {StatusFilter} from "@src/Components/Collection/Filters/StatusFilter";
import PriceFilter from "@src/Components/Collection/Filters/PriceFilter";
import RankFilter from "@src/Components/Collection/Filters/RankFilter";
import TraitsFilter from "@src/Components/Collection/Filters/TraitsFilter";
import PowertraitsFilter from "@src/Components/Collection/Filters/PowertraitsFilter";
import {useSelector} from "react-redux";
import {getWalletOverview} from "@src/core/api/endpoints/walletoverview";
import {getAllOffers} from "@src/core/subgraph";
import {getQuickWallet} from "@src/core/api/endpoints/wallets";
import {getCollectionMetadata} from "@src/core/api";

const StyledNav = styled.div`
  .nav-link {
    color: white
  }
  .nav-link.active {
    background: #218cff
  }
  .nav-item {
    cursor: pointer
  }
`;

const BREAKPOINTS = { xs: 0, m: 768, l: 1199, xl: 1200 };
const tabs = {
  madeDirect: {
    key: 'made-direct',
    title: 'Made Direct Offers',
    description: 'Offers made directly to NFTs'
  },
  madeCollection: {
    key: 'made-collection',
    title: 'Made Collection Offers',
    description: 'Offers made to an entire collection'
  },
  receivedDirect: {
    key: 'received-direct',
    title: 'Received Direct Offers',
    description: 'Offers received on your NFTs'
  },
  receivedPublic: {
    key: 'received-public',
    title: 'Received Public Offers',
    description: 'Offers received on your ERC1155 NFTs'
  },
  receivedCollection: {
    key: 'received-collection',
    title: 'Received Collection Offers',
    description: 'Offers made directly to collections you own'
  },
}
export default function Offers({ address }) {
  const userTheme = useSelector((state) => state.user.theme);

  const [filtersVisible, setFiltersVisible] = useState(true);
  const [useMobileMenu, setUseMobileMenu] = useState(false);
  const { breakpoint, maxWidth, minWidth } = useBreakpoint(BREAKPOINTS);
  const [activeTab, setActiveTab] = useState(tabs.madeDirect);

  useEffect(() => {
    setUseMobileMenu(minWidth < BREAKPOINTS.m);
  }, [breakpoint]);

  const setTab = (key) => {
    const tabKey = Object.entries(tabs).find(([k, v]) =>  v.key === key);
    setActiveTab(tabKey[1]);
  };

  const setMobileTab = (tab) => {
    setTab(tab);
    setFiltersVisible(false);
  };

  const [receivedOffersDeps, setReceivedOffersDeps] = useState(null);
  useEffect(() => {
    async function getDeps() {

      const {data: collections} = await getWalletOverview(address);
      const userNfts = await getQuickWallet(address, {pageSize: 1000});
      const collectionStats = await getCollectionMetadata();

      const ret = {
        collectionAddresses: collections.map((c) => c.nftAddress),
        nfts: userNfts.data,
        stats: collectionStats.collections
      }
      setReceivedOffersDeps(ret);
    }

    getDeps();
  }, []);

  return (
    <div className="d-flex">
      <Tab.Container id="left-tabs-example" defaultActiveKey={tabs.madeDirect.key} activeKey={activeTab.key} onSelect={setTab}>
        <Collapse in={filtersVisible && !useMobileMenu} dimension="width">
          <div className="m-0 p-0">
            <div className="me-4 px-2" style={{width: 250}}>
              <StyledNav>
                <Nav id="offer-nav" variant="pills" className="flex-column" >
                  <Nav.Item>
                    <Nav.Link eventKey={tabs.madeDirect.key}>Made Direct Offers</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey={tabs.madeCollection.key}>Made Collection Offers</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey={tabs.receivedDirect.key}>Received Direct Offers</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey={tabs.receivedPublic.key}>Received Public Offers</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey={tabs.receivedCollection.key}>Received Collection Offers</Nav.Link>
                  </Nav.Item>
                </Nav>
              </StyledNav>
            </div>
          </div>
        </Collapse>
        <div className="flex-fill">
          <div className="d-flex mb-2">
            <div>
              <Button
                type="legacy-outlined"
                onClick={() => setFiltersVisible(!filtersVisible)}
              >
                <FontAwesomeIcon icon={filtersVisible ? faAngleLeft : faFilter} />
              </Button>
            </div>
            <div className="fs-6 fw-bold my-auto ms-2 flex-fill text-end">
              {activeTab.description}
            </div>
          </div>
          <Tab.Content >
            <Tab.Pane eventKey={tabs.madeDirect.key}>
              <MadeOffers address={address} type="direct" />
            </Tab.Pane>
            <Tab.Pane eventKey={tabs.madeCollection.key}>
              <MadeOffers address={address} type="collection" />
            </Tab.Pane>
            <Tab.Pane eventKey={tabs.receivedDirect.key}>
              {receivedOffersDeps && (
                <ReceivedOffers
                  type="received-direct"
                  address={address}
                  collectionAddresses={receivedOffersDeps.collectionAddresses}
                  nfts={receivedOffersDeps.nfts}
                  stats={receivedOffersDeps.stats}
                />
              )}
            </Tab.Pane>
            <Tab.Pane eventKey={tabs.receivedPublic.key}>
              {receivedOffersDeps && (
                <ReceivedOffers
                  type="received-public"
                  address={address}
                  collectionAddresses={receivedOffersDeps.collectionAddresses}
                  nfts={receivedOffersDeps.nfts}
                  stats={receivedOffersDeps.stats}
                />
              )}
            </Tab.Pane>
            <Tab.Pane eventKey={tabs.receivedCollection.key}>
              {receivedOffersDeps && (
                <ReceivedOffers
                  type="received-collection"
                  address={address}
                  collectionAddresses={receivedOffersDeps.collectionAddresses}
                  nfts={receivedOffersDeps.nfts}
                  stats={receivedOffersDeps.stats}
                />
              )}
            </Tab.Pane>
          </Tab.Content>
        </div>
      </Tab.Container>
      <Offcanvas show={filtersVisible && useMobileMenu} placement="bottom" onHide={() => setFiltersVisible(false)} className="filter-pane">
        <Offcanvas.Header closeButton closeVariant={userTheme === 'dark' ? 'white': 'dark'}>
          <Offcanvas.Title>Filter Offers</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Button
            type="legacy-outlined"
            className="mb-2 w-100"
            onClick={() => setMobileTab(tabs.madeDirect.key)}
          >
            Made Direct Offers
          </Button>
          <Button
            type="legacy-outlined"
            className="mb-2 w-100"
            onClick={() => setMobileTab(tabs.madeCollection.key)}
          >
            Made Collection Offers
          </Button>
          <Button
            type="legacy-outlined"
            className="mb-2 w-100"
            onClick={() => setMobileTab(tabs.receivedDirect.key)}
          >
            Received Direct Offers
          </Button>
          <Button
            type="legacy-outlined"
            className="mb-2 w-100"
            onClick={() => setMobileTab(tabs.receivedPublic.key)}
          >
            Received Public Offers
          </Button>
          <Button
            type="legacy-outlined"
            className="mb-2 w-100"
            onClick={() => setMobileTab(tabs.receivedCollection.key)}
          >
            Received Collection Offers
          </Button>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  )
}
import {Collapse, Offcanvas} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import Button from "@src/Components/components/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleLeft, faFilter} from "@fortawesome/free-solid-svg-icons";
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';
import MadeOffers from "./made-offers";
import ReceivedOffers2 from "./received-offers2";
import styled from "styled-components";
import {OfferType, ReceivedOfferType} from "@src/core/services/api-service/types";
import {useAppSelector} from "@src/Store/hooks";
import {useBreakpointValue} from "@chakra-ui/react";

const StyledNav = styled.div`
  .nav-link {
    color: ${({ theme }) => theme.colors.textColor3}
  }
  .nav-link.active {
    background: #218cff;
    color: ${({ theme }) => theme.colors.white}
  }
  .nav-item {
    cursor: pointer
  }
`;

type OfferTab = {
  key: string;
  title: string;
  description: string;
}

const tabs: {[key: string]: OfferTab} = {
  madeDirect: {
    key: 'made-direct',
    title: 'Made Direct Offers',
    description: 'Offers made directly to NFTs'
  },
  madeCollection: {
    key: 'made-collection',
    title: 'Made Collection Offers',
    description: 'Offers made on an entire collection'
  },
  receivedDirect: {
    key: 'received-direct',
    title: 'Received Direct Offers',
    description: 'Offers received on your NFTs'
  },
  receivedPublic: {
    key: 'received-public',
    title: 'Received Public Offers',
    description: 'Offers received on your CRC-1155 NFTs'
  },
  receivedCollection: {
    key: 'received-collection',
    title: 'Received Collection Offers',
    description: 'Offers received directly on collections you own'
  },
}

interface OffersProps {
  address: string;
}

export default function Offers({ address }: OffersProps) {
  const userTheme = useAppSelector((state) => state.user.theme);

  const [filtersVisible, setFiltersVisible] = useState(true);
  const [activeTab, setActiveTab] = useState(tabs.madeDirect);
  const [hasManuallyToggledFilters, setHasManuallyToggledFilters] = useState(false);
  const useMobileMenu = useBreakpointValue(
    { base: true, md: false },
    { fallback: 'md', ssr: false },
  );

  useEffect(() => {
    if (!hasManuallyToggledFilters) {
      setFiltersVisible(!useMobileMenu);
    }
  }, [useMobileMenu]);

  const toggleFilterVisibility = () => {
    setHasManuallyToggledFilters(true);
    setFiltersVisible(!filtersVisible)
  };

  const setTab = (key: any) => {
    const tabKey = Object.entries(tabs).find(([k, v]) =>  v.key === key);
    if (!!tabKey) setActiveTab(tabKey[1]);
  };

  const setMobileTab = (tab: string) => {
    setTab(tab);
    setFiltersVisible(false);
  };

  return (
    <div className="d-flex">
      <Tab.Container id="left-tabs-example" defaultActiveKey={tabs.madeDirect.key} activeKey={activeTab.key} onSelect={setTab}>
        <Collapse in={filtersVisible && !useMobileMenu} dimension="width">
          <div className="m-0 p-0">
            <div className="me-4 px-2" style={{width: 250}}>
              <StyledNav>
                <Nav id="offer-nav" variant="pills" className="flex-column">
                  <div className="text-muted fw-bold">
                    Made Offers
                  </div>
                  <Nav.Item>
                    <Nav.Link eventKey={tabs.madeDirect.key}>Direct Offers</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey={tabs.madeCollection.key}>Collection Offers</Nav.Link>
                  </Nav.Item>
                  <div className="text-muted fw-bold">
                    Received Offers
                  </div>
                  <Nav.Item>
                    <Nav.Link eventKey={tabs.receivedDirect.key}>Direct Offers</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey={tabs.receivedPublic.key}>Public Offers</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey={tabs.receivedCollection.key}>Collection Offers</Nav.Link>
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
                onClick={toggleFilterVisibility}
              >
                <FontAwesomeIcon icon={filtersVisible ? faAngleLeft : faFilter} />
              </Button>
            </div>
            <div className="fs-6 fw-bold my-auto ms-2 flex-fill text-end">
              {activeTab.description}
            </div>
          </div>
          <Tab.Content>
            <Tab.Pane eventKey={tabs.madeDirect.key}>
              <MadeOffers address={address} type={OfferType.DIRECT} filterVisible={filtersVisible} />
            </Tab.Pane>
            <Tab.Pane eventKey={tabs.madeCollection.key}>
              <MadeOffers address={address} type={OfferType.COLLECTION} filterVisible={filtersVisible} />
            </Tab.Pane>
            <Tab.Pane eventKey={tabs.receivedDirect.key}>
              <ReceivedOffers2
                type={ReceivedOfferType.ERC721}
                group='nft'
                address={address}
                filterVisible={filtersVisible}
              />
            </Tab.Pane>
            <Tab.Pane eventKey={tabs.receivedPublic.key}>
              <ReceivedOffers2
                type={ReceivedOfferType.ERC1155}
                group={undefined}
                address={address}
                filterVisible={filtersVisible}
              />
            </Tab.Pane>
            <Tab.Pane eventKey={tabs.receivedCollection.key}>
              <ReceivedOffers2
                type={ReceivedOfferType.ERC721}
                group='collection'
                address={address}
                filterVisible={filtersVisible}
              />
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
import {Collapse} from "react-bootstrap";
import React, {useState, useEffect} from "react";
import useBreakpoint from "use-breakpoint";
import Button from "@src/Components/components/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleLeft, faFilter} from "@fortawesome/free-solid-svg-icons";
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';
import MadeOffers from "@src/Components/Offer/MadeOffers";
import ReceivedOffers from "@src/Components/Offer/ReceivedOffers";

const BREAKPOINTS = { xs: 0, m: 768, l: 1199, xl: 1200 };
const tabs = {
  made: 'made',
  receivedDirect: 'received-direct',
  receivedPublic: 'received-public',
  receivedCollection: 'received-collection',
}
export default function Offers({ address }) {

  const [filtersVisible, setFiltersVisible] = useState(false);
  const [useMobileMenu, setUseMobileMenu] = useState(false);
  const { breakpoint, maxWidth, minWidth } = useBreakpoint(BREAKPOINTS);
  useEffect(() => {
    setUseMobileMenu(minWidth < BREAKPOINTS.m);
  }, [breakpoint]);


  return (
    <div className="d-flex">
      <Tab.Container id="left-tabs-example" defaultActiveKey="first">
        <Collapse in={filtersVisible && !useMobileMenu} dimension="width">
          <div className="m-0 p-0">
            <div className="me-4 px-2" style={{width: 250}}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey={tabs.made}>Made Offers</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey={tabs.receivedDirect}>Received Direct Offers</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey={tabs.receivedPublic}>Received Public Offers</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey={tabs.receivedCollection}>Received Collection Offers</Nav.Link>
                </Nav.Item>
              </Nav>
            </div>
          </div>
        </Collapse>
        <div className="flex-fill">
          <div className="mb-2">
            <Button
              type="legacy"
              onClick={() => setFiltersVisible(!filtersVisible)}
            >
              <FontAwesomeIcon icon={filtersVisible ? faAngleLeft : faFilter} />
            </Button>
          </div>
          <Tab.Content>
            <Tab.Pane eventKey={tabs.made}>
              <MadeOffers address={address} />
            </Tab.Pane>
            <Tab.Pane eventKey={tabs.receivedDirect}>
              <ReceivedOffers offers={[]} isLoading={false} />
            </Tab.Pane>
            <Tab.Pane eventKey={tabs.receivedPublic}>
              <ReceivedOffers offers={[]} isLoading={false} />
            </Tab.Pane>
            <Tab.Pane eventKey={tabs.receivedCollection}>
              <ReceivedOffers offers={[]} isLoading={false} />
            </Tab.Pane>
          </Tab.Content>
        </div>
      </Tab.Container>
    </div>
  )
}
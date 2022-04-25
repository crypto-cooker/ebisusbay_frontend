import React from 'react';

import Footer from '../components/Footer';
import AuctionCollection from '../components/AuctionCollection';
import config from '../../Assets/networks/rpc_config.json';
import MetaverseModal from '../components/MetaverseModal';
export const drops = config.drops;

const MetaverseAuctions = () => {
  return (
    <div>
      <section className="container no-bottom">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center pt-5">
              <h2>Metaverse Auction for Ukraine</h2>
            </div>
          </div>
          <div className="col-lg-6 pt-3">
            <div className="card eb-nft__card h-100 shadow">
              <img className="card-img-top" src="/img/metaverse_gallery.png" />
              <div className="card-body d-flex flex-column align-middle">
                <MetaverseModal />
              </div>
            </div>
          </div>
          <div className="col-lg-6 text-center align-middle d-flex align-items-center">
            <div className="heading mt-3">
              All proceeds from this auction will be donated to victims of the Ukranian conflict. Either place you bids
              below, or enter the metaverse and place your bids there.
            </div>
          </div>
        </div>
      </section>
      <section className="container pt-5">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>2D Active Auctions</h2>
            </div>
          </div>
          <div className="col-lg-12 pt-3">
            <AuctionCollection />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};
export default MetaverseAuctions;

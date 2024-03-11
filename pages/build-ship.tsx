import React, {useCallback, useEffect, useState} from 'react';
import {Contract, ethers} from 'ethers';
import {toast} from 'react-toastify';
import * as Sentry from '@sentry/react';
import styled from 'styled-components';

import {createSuccessfulTransactionToastContent, humanizeAdvanced, percentage} from '@src/utils';
import ShipABI from '../src/Contracts/Ship.json';
import ShipItemABI from '../src/Contracts/ShipItem.json';
import {appConfig} from '@src/Config';
import {hostedImage} from '@src/helpers/image';
import PageHead from "@src/components-v2/shared/layout/page-head";
import {Center, FormLabel, Heading, Input, Progress, Spinner} from "@chakra-ui/react";

import {getCollections} from "@src/core/api/next/collectioninfo";
import {useUser} from "@src/components-v2/useUser";

const Drop = () => {
  const [ships, setShips] = useState<any[]>([]);
  const [partsBalances, setPartsBalances] = useState<number[]>([]);
  const [shipContract, setShipContract] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalSupply, setTotalSupply] = useState(0);
  const [maxSupply, setMaxSupply] = useState(0);

  const user = useUser();

  const init = useCallback(async () => {
    setIsLoading(true);
    await refreshDropDetails();
    try {
      if (user.wallet.isConnected) {
        const res = await getCollections({slug: 'crosmocrafts'});
        const spaceShipDrop = res.data.collections[0];

        if (!spaceShipDrop.address) {
          setIsLoading(false);
          return;
        }
        let spaceShip = await new ethers.Contract(spaceShipDrop.address, ShipABI.abi, user.provider.getSigner());
        const ship1 = await spaceShip.SHIP1(); // Regular
        const ship2 = await spaceShip.SHIP2(); // Great
        const ship3 = await spaceShip.SHIP3(); // Legendary
        const ships = [ship1, ship2, ship3];
        setShips(ships);

        await refreshPartsBalance();

        setShipContract(spaceShip);
      } else {
        setPartsBalances([]);
      }
    } catch (error) {
      console.log(error);
      Sentry.captureException(error);
    } finally {
      setIsLoading(false);
    }
  }, [user.address, user.wallet.isConnected]);

  const refreshPartsBalance = async () => {
    const res = await getCollections({slug: 'crosmocrafts-parts'});
    const shipItemDrop = res.data?.collections[0];
    let shipItem = await new ethers.Contract(shipItemDrop.address, ShipItemABI.abi, user.provider.getSigner());
    let ids = [];
    for (let i = 0; i < 9; i++) {
      const balance = await shipItem.balanceOf(user.address, i);
      ids.push(balance.toNumber());
    }
    setPartsBalances(ids);
  };

  const refreshDropDetails = async () => {
    const res = await getCollections({slug: 'crosmocrafts'});
    const spaceShipDrop = res.data?.collections[0];
    const readProvider = new ethers.providers.JsonRpcProvider(appConfig('rpc.read'));
    let spaceShip = await new ethers.Contract(spaceShipDrop.address, ShipABI.abi, readProvider);
    const info = await spaceShip.getInfo();

    setTotalSupply(info.totalSupply);
    setMaxSupply(info.maxSupply);
  };

  useEffect(() => {
    async function func() {
      await init();
    }
    if (user.wallet.isConnected && !isLoading) {
      func();
    }
  }, [user.wallet.isConnected]);

  const mint = async (address: string, quantity: number) => {
    if (!shipContract) return;

    let extra = {
      gasPrice: ethers.utils.parseUnits('5000', 'gwei'),
    };

    try {
      const tx = await shipContract.mint(quantity, address, extra);
      const receipt = await tx.wait();
      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      await refreshPartsBalance();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
    }
  };

  return (
    <>
      <PageHead
        title="Build a Crosmocraft"
        description="Build a crosmocraft using crosmocraft parts!"
        url="/build-ship"
      />
      <section
        id="profile_banner"
        className="jumbotron breadcumb no-bg tint"
        style={{
          backgroundImage: 'url(https://cdn-prod.ebisusbay.com/files/collection-images/crosmonauts/ship/banner.webp)',
          backgroundPosition: '50% 50%',
        }}
      >
        <div className="mainbreadcumb">
          <div className="container">
            <div className="row m-10-hor">
              <div className="col-12 text-center">
                <Heading as="h1" size="2xl" >Build a Crosmocraft</Heading>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="gl-legacy container d_coll no-top no-bottom">
        <div className="row">
          <div className="col-md-12">
            <div className="d_profile">
              <div className="profile_avatar">
                <div className="d_profile_img">
                  <img src={hostedImage('https://cdn-prod.ebisusbay.com/files/collection-images/crosmonauts/ship/avatar.webp')} alt="Crosmonauts" />
                </div>
                <p>Combine ship parts to build a Crosmocraft!</p>
                <p>
                  Parts come in 3 types: Engines, Boosters and Space Decks. Types are further divided into classes:
                  Regular, Rare and Legendary. There are a total of 9 possibilities and your parts have to be of the
                  same class to be able to build a spaceship!
                </p>
                <div className="mb-4">
                  <span>Need more parts? &nbsp;</span>
                  <div className="nft__item_action d-inline-block" style={{ fontSize: '16px' }}>
                    <span
                      onClick={() => typeof window !== 'undefined' && window.open('/drops/crosmocrafts-parts', '_self')}
                      style={{ cursor: 'pointer' }}
                    >
                      Buy Crosmocraft Parts
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="gl-legacy container no-top">
        {isLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <>
            <div className="mb-4">
              <div className="fs-6 fw-bold mb-1 text-end">
                {percentage(totalSupply.toString(), maxSupply.toString())}% minted (
                {ethers.utils.commify(totalSupply.toString())} / {ethers.utils.commify(maxSupply.toString())})
              </div>
              <Progress
                size='xs'
                value={percentage(totalSupply.toString(), maxSupply.toString())}
                bg='white'
              />
            </div>
            <div className="row row-cols-1 g-4">
              {ships[0] && (
                <ShipBuilderCard
                  type="regular"
                  shipAddress={ships[0]}
                  key={0}
                  mintCallback={mint}
                  quantityCollected={[partsBalances[0], partsBalances[3], partsBalances[6]]}
                />
              )}
              {ships[1] && (
                <ShipBuilderCard
                  type="great"
                  shipAddress={ships[1]}
                  key={1}
                  mintCallback={mint}
                  quantityCollected={[partsBalances[1], partsBalances[4], partsBalances[7]]}
                />
              )}
              {ships[2] && (
                <ShipBuilderCard
                  type="legendary"
                  shipAddress={ships[2]}
                  key={2}
                  mintCallback={mint}
                  quantityCollected={[partsBalances[2], partsBalances[5], partsBalances[8]]}
                />
              )}
            </div>
          </>
        )}
      </section>
    </>
  );
};
export default Drop;

const GreyscaleImg = styled.img`
  -webkit-filter: grayscale(100%); /* Safari 6.0 - 9.0 */
  filter: grayscale(100%);
`;

interface ShipBuilderCardProps {
  type: string;
  shipAddress: string;
  mintCallback: (address: string, quantity: number) => void;
  quantityCollected: number[];
}

const ShipBuilderCard = ({ type, shipAddress, mintCallback, quantityCollected }: ShipBuilderCardProps) => {
  const [isMinting, setIsMinting] = useState(false);
  const [quantity, setQuantity] = useState(0);

  const onQuantityChange = (key: string, e: any) => {
    const value = e.target.value;
    const maxAvailable = Math.min(...quantityCollected);
    console.log(value, quantityCollected, maxAvailable);
    if (value <= maxAvailable && value >= 0) {
      setQuantity(value);
    }
  };

  const onMint = async () => {
    setIsMinting(true);
    await mintCallback(shipAddress, quantity);
    setIsMinting(false);
  };

  useEffect(() => {
    const maxAvailable = Math.min(...quantityCollected);
    setQuantity(maxAvailable > 0 ? 1 : 0);
    // eslint-disable-next-line
  }, []);

  return (
    <div className="card eb-nft__card h-100 w-100 shadow">
      <div className="card-body d-flex flex-column">
        <h5>{humanizeAdvanced(type)} Parts</h5>
        <div className="row row-cols-1 row-cols-sm-3 row-cols-md-4 g-3">
          <div className="border-0">
            {quantityCollected[0] > 0 ? (
              <img src={`https://cdn-prod.ebisusbay.com/files/collection-images/crosmonauts/parts/${type}-engine.webp`} className="card-img-top" alt="..." />
            ) : (
              <GreyscaleImg
                src={`https://cdn-prod.ebisusbay.com/files/collection-images/crosmonauts/parts/${type}-engine.webp`}
                className="card-img-top"
                alt="..."
              />
            )}
            <div className="card-body">
              <h5 className="card-title">Engine</h5>
              <p className="card-text">Parts Collected: {quantityCollected[0]}</p>
            </div>
          </div>
          <div className="border-0">
            {quantityCollected[1] > 0 ? (
              <img src={`https://cdn-prod.ebisusbay.com/files/collection-images/crosmonauts/parts/${type}-booster.webp`} className="card-img-top" alt="..." />
            ) : (
              <GreyscaleImg
                src={`https://cdn-prod.ebisusbay.com/files/collection-images/crosmonauts/parts/${type}-booster.webp`}
                className="card-img-top"
                alt="..."
              />
            )}
            <div className="card-body">
              <h5 className="card-title">Booster</h5>
              <p className="card-text">Parts Collected: {quantityCollected[1]}</p>
            </div>
          </div>
          <div className="border-0">
            {quantityCollected[2] > 0 ? (
              <img src={`https://cdn-prod.ebisusbay.com/files/collection-images/crosmonauts/parts/${type}-deck.webp`} className="card-img-top" alt="..." />
            ) : (
              <GreyscaleImg
                src={`https://cdn-prod.ebisusbay.com/files/collection-images/crosmonauts/parts/${type}-deck.webp`}
                className="card-img-top"
                alt="..."
              />
            )}
            <div className="card-body">
              <h5 className="card-title">Space Deck</h5>
              <p className="card-text">Parts Collected: {quantityCollected[2]}</p>
            </div>
          </div>
          <div className="border-0">
            <div className="card-body d-flex justify-content-center">
              <div className="align-self-center">
                <h5 className="card-title d-flex text-center">Build {humanizeAdvanced(type)} Ship</h5>
                <div className="row row-cols-1 g-3 mt-2 d-block">
                  {quantityCollected[0] > 0 && quantityCollected[1] > 0 && quantityCollected[2] > 0 ? (
                    <>
                      <div className="col d-flex justify-content-center">
                        <FormLabel>Quantity</FormLabel>
                      </div>
                      <div className="col d-flex justify-content-center mt-0">
                        <Input
                          type="number"
                          placeholder="Input the amount"
                          onChange={(e) => onQuantityChange('regular', e)}
                          value={quantity}
                          style={{ width: '100px', marginBottom: 0, appearance: 'none', margin: 0 }}
                        />
                      </div>
                      <div className="col d-flex justify-content-center">
                        <button
                          className="btn-main lead mb-5 mr15"
                          onClick={onMint}
                          disabled={quantity < 1}
                        >
                          {isMinting ? (
                            <>
                              Minting...
                              <Spinner animation="border" role="status" size="sm" className="ms-1">
                                <span className="visually-hidden">Loading...</span>
                              </Spinner>
                            </>
                          ) : (
                            <>Mint</>
                          )}
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="text-center">Not enough parts</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

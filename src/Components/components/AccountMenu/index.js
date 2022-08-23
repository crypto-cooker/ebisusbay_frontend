import React, { memo, useEffect, useState } from 'react';
import Blockies from 'react-blockies';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBolt,
  faShoppingBag,
  faUser,
  faEdit, faCoins, faCopy, faHeart, faDollarSign, faWallet, faSearch
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import MetaMaskOnboarding from '@metamask/onboarding';
import {Modal, NavLink, Spinner, ModalTitle, Offcanvas} from 'react-bootstrap';
import styled from 'styled-components';
import { ethers } from 'ethers';
import { ERC20 } from '@src/Contracts/Abis';
import { fetcher, useInterval } from '@src/utils';
import styles from './accountmenu.module.scss';

import {
  connectAccount,
  onLogout,
  setTheme,
  setShowWrongChainModal,
  chainConnect,
  AccountMenuActions,
  checkForOutstandingOffers,
  balanceUpdated,
} from '@src/GlobalState/User';

import { getThemeInStorage, setThemeInStorage } from '@src/helpers/storage';
import { getAllCollections } from '@src/GlobalState/collectionsSlice';
import { fetchMyNFTs } from '@src/GlobalState/offerSlice';
import { round, shortAddress } from '@src/utils';
import { appConfig } from '@src/Config';
import {ImageKitService} from "@src/helpers/image";
import classnames from "classnames";
import {useWindowSize} from "@src/hooks/useWindowSize";
import Button from "@src/Components/components/Button";

const StyledModal = styled(Modal)`
  .modal-content {
    background: ${({ theme }) => theme.colors.bgColor1};
  }
`;

const StyledModalTitle = styled(ModalTitle)`
  color: ${({ theme }) => theme.colors.textColor3};
`;

const Index = function () {
  const dispatch = useDispatch();
  const history = useRouter();

  const windowSize = useWindowSize();
  const [showpop, btn_icon_pop] = useState(false);

  const closePop = () => {
    btn_icon_pop(false);
  };
  const walletAddress = useSelector((state) => {
    return state.user.address;
  });

  const correctChain = useSelector((state) => {
    return state.user.correctChain;
  });
  const theme = useSelector((state) => {
    return state.user.theme;
  });
  const user = useSelector((state) => {
    return state.user;
  });
  const needsOnboard = useSelector((state) => {
    return state.user.needsOnboard;
  });
  const collectionsStats = useSelector((state) => state.collections.collections);
  const myNFTs = useSelector((state) => state.offer.myNFTs);

  const { data: balance, mutate } = useSWR(['getBalance', walletAddress, 'latest'], {
    fetcher: fetcher(user?.provider, ERC20),
  });

  const identifier = user.profile.username ?? user.address;
  const username = () => {
    try {
      if (identifier.startsWith('0x')) {
        return shortAddress(ethers.utils.getAddress(identifier));
      }
      return identifier;
    } catch (e) {
      return identifier;
    }
  }

  useEffect(() => {
    dispatch(
      balanceUpdated({
        balance: ethers.utils.formatEther(balance || 0),
      })
    );
  }, [balance]);

  useInterval(() => {
    async function func() {
      if (user && !user.connectingWallet && user.provider) {
        const sales = ethers.utils.formatEther(await user.marketContract.payments(walletAddress));
        const stakingRewards = ethers.utils.formatEther(await user.stakeContract.getReward(walletAddress));
        dispatch(
          balanceUpdated({
            marketBalance: sales || 0,
            stakingRewards: stakingRewards || 0,
          })
        );
      }
    }
    func();
  }, 1000 * 60);

  const navigateTo = (link) => {
    closePop();
    history.push(link);
  };

  const logout = async () => {
    dispatch(onLogout());
  };

  useEffect(() => {
    if (walletAddress) {
      dispatch(getAllCollections());
      dispatch(fetchMyNFTs(walletAddress));
    }
    // eslint-disable-next-line
  }, [walletAddress]);

  useEffect(() => {
    if (collectionsStats && collectionsStats.length > 0 && myNFTs && myNFTs.length > 0) {
      dispatch(checkForOutstandingOffers());
    }
    // eslint-disable-next-line
  }, [collectionsStats, myNFTs]);

  const connectWalletPressed = async () => {
    if (needsOnboard) {
      const onboarding = new MetaMaskOnboarding();
      onboarding.startOnboarding();
    } else {
      dispatch(connectAccount());
    }
  };

  const handleCopy = (code) => () => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        toast.success('Copied!');
      })
      .catch(() => {
        toast.success('Unable to copy, please try again');
      });
  };

  const withdrawBalance = async () => {
    dispatch(AccountMenuActions.withdrawMarketBalance());
  };

  const harvestStakingRewards = async () => {
    dispatch(AccountMenuActions.harvestStakingRewards());
  };

  const clearCookies = async () => {
    dispatch(onLogout());
    toast.success(`Cookies cleared!`);
  };

  useEffect(() => {
    const themeInStorage = getThemeInStorage();

    if (themeInStorage) {
      dispatch(setTheme(themeInStorage));
    } else {
      setThemeInStorage('dark');
    }
    // eslint-disable-next-line
  }, []);

  const onWrongChainModalClose = () => {
    dispatch(setShowWrongChainModal(false));
  };

  const onWrongChainModalChangeChain = () => {
    dispatch(setShowWrongChainModal(false));
    dispatch(chainConnect());
  };

  return (
    <div>
      {!walletAddress && (
        <div className="connect-wal">
          <NavLink onClick={connectWalletPressed}>Connect Wallet</NavLink>
        </div>
      )}
      {walletAddress && !correctChain && !user.showWrongChainModal && (
        <div className="connect-wal">
          <NavLink onClick={onWrongChainModalChangeChain}>Switch network</NavLink>
        </div>
      )}
      {walletAddress && correctChain && (
        <div id="de-click-menu-profile" className="de-menu-profile">
          <span onClick={() => btn_icon_pop(!showpop)}>
            {user.profile.profilePicture ? (
              <img src={ImageKitService.buildAvatarUrl(user.profile.profilePicture)} alt={user.profile.username} />
            ) : (
              <Blockies seed={user.address} size={9} scale={4} style={{width:'10px'}}/>
            )}
          </span>
        </div>
      )}

      <StyledModal show={user.showWrongChainModal} onHide={onWrongChainModalClose}>
        <Modal.Header closeButton>
          <StyledModalTitle>Wrong network!</StyledModalTitle>
        </Modal.Header>
        <Modal.Body>
          To continue, you need to switch the network to{' '}
          <span style={{ fontWeight: 'bold' }}>{appConfig('chain.name')}</span>.{' '}
        </Modal.Body>
        <Modal.Footer>
          <button className="p-4 pt-2 pb-2 btn_menu inline white lead" onClick={onWrongChainModalClose}>
            Close
          </button>
          <button
            className="p-4 pt-2 pb-2 btn_menu inline white lead btn-outline"
            onClick={onWrongChainModalChangeChain}
          >
            Switch
          </button>
        </Modal.Footer>
      </StyledModal>

      {walletAddress && correctChain && (
        <Offcanvas show={showpop} onHide={closePop} placement={windowSize.width > 400 ? 'end' : 'bottom'}>
          <Offcanvas.Header closeButton closeVariant={theme === 'dark' ? 'white': 'dark'}>
            <Offcanvas.Title>My Account</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>

            <div className="row mb-4">
              <div className="d-flex align-items-center">
                <span className={classnames('me-2', styles.avatar)}>
                  {user.profile.profilePicture ? (
                    <img src={ImageKitService.buildAvatarUrl(user.profile.profilePicture)} alt={user.profile.username} />
                  ) : (
                    <Blockies seed={user.address} size={9} scale={4} style={{width:'10px'}}/>
                  )}
                </span>
                <div>
                  <div className="fs-5 fw-bold">
                    {username()}
                  </div>
                  <div>
                    <button className="btn_menu me-2" title="Copy Address" onClick={handleCopy(walletAddress)}>
                      <FontAwesomeIcon icon={faCopy} />
                    </button>
                    <button className="btn_menu me-2" title="Copy Address" onClick={() => window.open(`https://cronoscan.com/address/${user.address}`, '_blank')}>
                      <FontAwesomeIcon icon={faSearch} />
                    </button>
                    {user.profile.username && (
                      <span className={styles.username}>
                        {shortAddress(user.address)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className={classnames("row row-cols-2 g-2", styles.navigation)}>
              <div className="col">
                <div className={styles.col}>
                  <span onClick={() => navigateTo(`/account/${walletAddress}`)}>
                    <span>
                      <FontAwesomeIcon icon={faUser} />
                    </span>
                    <span className="ms-2">My Profile</span>
                  </span>
                </div>
              </div>
              <div className="col">
                <div className={styles.col}>
                  <span onClick={() => navigateTo(`/account/settings/profile`)}>
                    <span>
                      <FontAwesomeIcon icon={faEdit} />
                    </span>
                    <span className="ms-2">Edit Account</span>
                  </span>
                </div>
              </div>
              <div className="col">
                <div className={styles.col}>
                  <span onClick={() => navigateTo(`/offers`)}>
                    <span>
                      <FontAwesomeIcon icon={faCoins} />
                    </span>
                    <span className="ms-2">My Offers</span>
                  </span>
                </div>
              </div>
              {(user.vipCount > 0 || user.stakeCount > 0) && (
                <div className="col">
                  <div className={styles.col}>
                    <span onClick={() => navigateTo(`/staking`)}>
                      <span>
                        <FontAwesomeIcon icon={faBolt} />
                      </span>
                      <span className="ms-2">My Staking</span>
                    </span>
                  </div>
                </div>
              )}
              <div className="col">
                <div className={styles.col}>
                  <span onClick={() => navigateTo(`/account/${walletAddress}?tab=inventory`)}>
                    <span>
                      <FontAwesomeIcon icon={faShoppingBag} />
                    </span>
                    <span className="ms-2">Inventory</span>
                  </span>
                </div>
              </div>
              <div className="col">
                <div className={styles.col}>
                  <span onClick={() => navigateTo(`/account/${walletAddress}?tab=collections`)}>
                    <span>
                      <FontAwesomeIcon icon={faShoppingBag} />
                    </span>
                    <span className="ms-2">Collections</span>
                  </span>
                </div>
              </div>
              <div className="col">
                <div className={styles.col}>
                  <span onClick={() => navigateTo(`/account/${walletAddress}?tab=listings`)}>
                    <span>
                      <FontAwesomeIcon icon={faCoins} />
                    </span>
                    <span className="ms-2">Listings</span>
                  </span>
                </div>
              </div>
              <div className="col">
                <div className={styles.col}>
                  <span onClick={() => navigateTo(`/account/${walletAddress}?tab=sales`)}>
                    <span>
                      <FontAwesomeIcon icon={faDollarSign} />
                    </span>
                    <span className="ms-2">Sales</span>
                  </span>
                </div>
              </div>
              <div className="col">
                <div className={styles.col}>
                  <span onClick={() => navigateTo(`/account/${walletAddress}?tab=favorites`)}>
                    <span>
                      <FontAwesomeIcon icon={faHeart} />
                    </span>
                    <span className="ms-2">Favourites</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col">
                <div className="d-flex justify-content-evenly">
                    <span className="cursor-pointer" onClick={clearCookies}>
                      <span>Clear Cookies</span>
                    </span>
                    <span className="cursor-pointer" onClick={logout}>
                      <span>Disconnect</span>
                    </span>
                </div>
              </div>
            </div>

            <h3 className="mt-4">
              <FontAwesomeIcon icon={faWallet} className="me-2"/>
              <span>Wallet Info</span>
            </h3>
            <div className="row mb-2">
              <div className="col">
                <div className="text-muted">Balance</div>
                <div className="">
                  {!user.connectingWallet ? (
                    <span className="d-wallet-value">
                      {user.balance ? <>{ethers.utils.commify(round(user.balance, 2))} CRO</> : <>N/A</>}
                    </span>
                  ) : (
                    <span>
                      <Spinner animation="border" role="status" size={'sm'}>
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="d-flex">
              <div className="flex-fill">
                <div className="text-muted">Market Escrow</div>
                <div>
                  {!user.connectingWallet ? (
                    <>
                      {user.marketBalance ? (
                        <>
                          <span className="d-wallet-value">
                            {ethers.utils.commify(round(user.marketBalance, 2))} CRO
                          </span>
                        </>
                      ) : (
                        <span className="d-wallet-value">0.0 CRO</span>
                      )}
                    </>
                  ) : (
                    <span>
                      <Spinner animation="border" role="status" size={'sm'}>
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    </span>
                  )}
                </div>
              </div>
              <div className="my-auto">
                {user.marketBalance !== '0.0' && (
                  <Button type="legacy"
                          onClick={withdrawBalance}
                          isLoading={user.withdrawingMarketBalance}
                          disabled={user.withdrawingMarketBalance}>
                    Withdraw
                  </Button>
                )}
              </div>
            </div>
            {(user.vipCount > 0 || user.stakeCount > 0) && (
              <div className="d-flex mt-2">
                <div className="flex-fill">
                  <div className="text-muted">Staking Rewards</div>
                  <div className="">
                    {!user.connectingWallet ? (
                      <>
                        {user.stakingRewards ? (
                          <>
                            <span className="d-wallet-value">
                              {ethers.utils.commify(round(user.stakingRewards, 2))} CRO
                            </span>
                          </>
                        ) : (
                          <span className="d-wallet-value">0.0 CRO</span>
                        )}
                      </>
                    ) : (
                      <span>
                        <Spinner animation="border" role="status" size={'sm'}>
                          <span className="visually-hidden">Loading...</span>
                        </Spinner>
                      </span>
                    )}
                  </div>
                </div>
                <div className="my-auto">
                  {user.stakingRewards > 0 && (
                    <Button type="legacy"
                            onClick={harvestStakingRewards}
                            isLoading={user.harvestingStakingRewards}
                            disabled={user.harvestingStakingRewards}>
                      Harvest
                    </Button>
                  )}
                </div>
              </div>
            )}
          </Offcanvas.Body>
        </Offcanvas>
      )}
    </div>
  );
};

export default memo(Index);

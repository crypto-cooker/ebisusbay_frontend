import React, {memo, SVGProps, useEffect, useState} from 'react';
import Blockies from 'react-blockies';
import {useDispatch} from 'react-redux';
import NextLink from 'next/link';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faArrowRightArrowLeft,
  faBolt,
  faCoins,
  faCopy,
  faDollarSign,
  faEdit,
  faHand,
  faHeart,
  faMoon,
  faSearch,
  faSun,
  faUser,
  faWallet
} from '@fortawesome/free-solid-svg-icons';
import {toast} from 'react-toastify';
import {ethers} from 'ethers';
import {createSuccessfulTransactionToastContent, round, shortAddress, username} from '@src/utils';
import styles from './accountmenu.module.scss';
import {useWeb3Modal} from '@web3modal/wagmi/react'
import {appConfig} from '@src/Config';
import classnames from "classnames";
import Button from "@src/Components/components/Button";
import {
  Box,
  ButtonGroup,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Heading,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Text,
  useBreakpointValue,
  useClipboard,
  Wrap
} from "@chakra-ui/react";
import CronosIconFlat from "@src/components-v2/shared/icons/cronos";
import ImageService from "@src/core/services/image";
import {PrimaryButton, SecondaryButton} from "@src/components-v2/foundation/button";
import CronosIconBlue from "@src/components-v2/shared/icons/cronos-blue";
import FortuneIcon from "@src/components-v2/shared/icons/fortune";
import {getTheme} from "@src/Theme/theme";
import {useContractService, useUser} from "@src/components-v2/useUser";
import {parseErrorMessage} from "@src/helpers/validator";
import {GasWriter} from "@src/core/chain/gas-writer";
import * as Sentry from "@sentry/nextjs";

const config = appConfig();

const Index = function () {
  const user = useUser();
  const { open: openWeb3Modal, close: closeWeb3Modal } = useWeb3Modal();
  const contractService = useContractService();

  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const slideDirection = useBreakpointValue<'bottom' | 'right'>(
    {
      base: 'bottom',
      md: 'right',
    },
    {
      fallback: 'md',
    },
  );
  const [showWrongChainModal, setShowWrongChainModal] = useState(false);

  const { setValue:setClipboardValue, onCopy } = useClipboard(user.wallet.address ?? '');

  const closeMenu = () => {
    setShowMenu(false);
  };

  const logout = async () => {
    closeMenu();
    user.disconnect();
  };

  useEffect(() => {
    if (user.wallet.address) {
      setClipboardValue(user.wallet.address);
    }
    // eslint-disable-next-line
  }, [user.wallet.address]);

  const handleCopy = () => {
    onCopy();
    toast.success('Address copied!');
  };

  const withdrawBalance = async () => {
    if (!contractService) return;

    const tx = await GasWriter.withContract(contractService.market).call(
      'withdrawPayments',
      user.wallet.address
    );
    const receipt = await tx.wait();
    toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
    user.onEscrowClaimed();
  };

  const harvestStakingRewards = async () => {
    if (!contractService) return;

    const tx = await GasWriter.withContract(contractService.staking).call(
      'harvest',
      user.wallet.address
    );
    const receipt = await tx.wait();
    toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
    user.onStakingHarvested();
  };

  const toggleEscrowOptIn = async (optIn: boolean) => {
    if (!contractService) return;

    const tx = await GasWriter.withContract(contractService.market).call(
      'setUseEscrow',
      user.wallet.address,
      optIn
    );
    const receipt = await tx.wait();
    user.onEscrowToggled();
    toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
  };

  const clearCookies = async () => {
    user.disconnect();
    toast.success(`Cookies cleared!`);
  };

  const handleBuyCro = () => {
    const url = new URL(config.vendors.transak.url)
    url.searchParams.append('cryptoCurrencyCode', 'CRO');
    url.searchParams.append('walletAddress', user.wallet.address!);
    
    window.open(url, '_blank');
  }

  const handleBuyFortune = () => {
    const url = new URL('https://swap.ebisusbay.com/#/swap')
    url.searchParams.append('outputCurrency', config.contracts.fortune);
    url.searchParams.append('inputCurrency', config.contracts.usdc);

    window.open(url, '_blank');
  }

  useEffect(() => {
    const themeInStorage = user.theme;
    user.toggleTheme(themeInStorage ?? 'dark');
  }, []);

  useEffect(() => {
    if (user.wallet.correctChain) {
      closeWeb3Modal()
    }
  }, [user.wallet.correctChain]);

  const onWrongChainModalClose = () => {
    setShowWrongChainModal(false);
  };

  const onWrongChainModalChangeChain = () => {
    setShowWrongChainModal(false);
  }

  const toggleTheme = () => {
    const newTheme = user.theme === 'light' ? 'dark' : 'light';
    user.toggleTheme(newTheme);
  };

  const SvgComponent = (props: SVGProps<any>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={51}
      height={14}
      viewBox="0 0 363.076 100.428"
      {...props}
    >
      <path
        xmlns="http://www.w3.org/2000/svg"
        d="m360.483 39.875-1.965-1.344c-2.17-1.447-3.101-4.239-2.378-6.72l.62-2.275c1.034-3.515-1.343-7.133-4.962-7.754l-2.378-.413c-2.584-.414-4.652-2.378-5.066-4.963l-.413-2.377c-.62-3.619-4.239-5.893-7.754-4.86l-2.275.724c-2.48.724-5.272-.207-6.72-2.274l-1.447-2.068c-2.171-2.998-6.41-3.412-9.098-.93l-1.758 1.654c-1.964 1.757-4.755 2.17-7.133.827l-2.068-1.138c-3.205-1.757-7.237-.31-8.684 3.102l-.93 2.274c-.931 2.482-3.413 4.033-5.997 3.826l-2.378-.104c-3.722-.206-6.72 2.895-6.41 6.514l.207 2.378c.207 2.584-1.344 5.065-3.722 6.1l-2.171.93c-3.412 1.447-4.756 5.48-2.998 8.684l1.24 2.068c1.344 2.274 1.034 5.17-.723 7.134l-1.551 1.757c-2.482 2.791-1.965 7.03 1.137 9.098l1.964 1.344c2.171 1.447 3.102 4.239 2.378 6.72l-.93 2.378c-1.034 3.515 1.344 7.134 4.962 7.754l2.378.413c2.585.414 4.652 2.378 5.066 4.963l.414 2.378c.62 3.618 4.238 5.893 7.753 4.859l2.275-.724c2.481-.723 5.273.207 6.72 2.275l1.447 1.964c2.172 2.998 6.41 3.412 9.098.93l1.758-1.654c1.964-1.757 4.756-2.17 7.134-.827l2.067 1.138c3.205 1.757 7.237.31 8.685-3.102l.93-2.274c.93-2.482 3.412-4.033 5.997-3.826l2.377.104c3.722.206 6.72-2.895 6.41-6.514l-.103-2.378c-.207-2.584 1.344-5.065 3.722-6.1l2.171-.93c3.412-1.447 4.756-5.48 2.998-8.684l-1.24-2.068c-1.345-2.274-1.034-5.17.723-7.134l1.551-1.757c2.585-2.688 2.068-7.03-.93-9.098zm-41.251 19.54-8.478 8.374-8.374-8.478-8.064-8.167 8.477-8.374 8.064 8.167 19.333-19.23 8.375 8.478-19.333 19.23z"
        fill="currentColor"
      />
      <path
        d="M77.492 29.999c-6.361 5.97-15.058 9.476-23.106 13.63-.78-5.193-3.895-8.438-8.178-9.087-19.472-2.726-16.226 32.841-.52 26.87 2.726-1.038 4.414-4.673 5.452-6.88 8.957 4.024 17.135 8.698 24.145 14.539-4.154 19.99-19.861 34.789-46.861 28.688C10.38 93.605 1.814 74.263.255 54.532-2.21 24.547 13.236.142 44.39.012 64.9-.117 73.727 12.475 77.492 30zm40.191-26.481c7.4 17.524 13.37 32.192 19.472 50.106.649-16.875.519-33.102 1.168-50.236 8.178-.52 21.289-1.428 30.245-1.558 0 28.947.26 65.943-1.427 96.318-6.49.52-19.212.649-28.169.39-9.476-8.698-15.447-19.472-24.015-30.895 1.169 9.476 3.116 21.418 3.505 29.856-9.865 1.558-22.327.909-33.1 1.038-1.299-30.894-.39-63.346-.91-95.409 11.943-.39 23.366-.26 33.231.39zm129.241 5.711c-.779 8.048-4.284 18.044-7.529 23.106-2.466-.52-9.735-4.284-15.187-4.933-5.063-.649-9.996-.13-10.904 3.116-2.077 8.307 13.76 11.293 24.144 18.173 17.654 11.813 16.356 39.462-1.817 48.289-15.188 7.14-40.63 1.687-55.558-2.856.779-11.293 1.428-18.563 5.192-28.688 6.23.52 27 7.27 28.039-2.596.519-4.803-6.88-6.88-11.813-9.087-10.125-4.673-21.418-10.514-22.327-24.144-2.077-33.49 45.822-35.957 67.76-20.38z"
        fill="#d24b5d"
      />
    </svg>
  );

  return (
    <div>
      {!user.wallet.isConnected && (
        <div className="de-menu-notification" onClick={() => openWeb3Modal()} style={{background: '#218cff', marginLeft:'5px'}}>
          <FontAwesomeIcon icon={faWallet} color="white" />
        </div>
      )}
      {user.wallet.isConnected && !user.wallet.correctChain && !showWrongChainModal && (
        <div className="de-menu-notification" onClick={() => openWeb3Modal({view: 'Networks'})} style={{background: '#218cff', marginLeft:'5px'}}>
          <FontAwesomeIcon icon={faArrowRightArrowLeft} color="white" />
        </div>
      )}
      {user.wallet.isConnected && user.wallet.correctChain && (
        <Box className="de-menu-profile" onClick={() => setShowMenu(!showMenu)}>
          {!!user.profile?.profilePicture ? (
            <Image
              src={ImageService.translate(user.profile.profilePicture).avatar()}
              alt={user.profile.username}
              title={user.profile.username}
              w={38}
              h={38}
              objectFit='cover'
            />
          ) : (
            <Blockies seed={`${user.wallet.address?.toLowerCase()}`} size={9} scale={4} />
          )}
        </Box>
      )}

      <Modal onClose={onWrongChainModalClose} isOpen={user.wallet.isConnected && !user.wallet.correctChain}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className="text-center">
            Wrong network
          </ModalHeader>
          <ModalCloseButton color={getTheme(user.theme).colors.textColor4} />
          <ModalBody>
            To continue, you need to switch the network to{' '}
            <span style={{ fontWeight: 'bold' }}>{appConfig('chain.name')}</span>.{' '}
          </ModalBody>
          <ModalFooter>
            <ButtonGroup>
              <SecondaryButton onClick={onWrongChainModalClose}>
                Close
              </SecondaryButton>
              <PrimaryButton onClick={() => openWeb3Modal({view: 'Networks'})}>
                Switch
              </PrimaryButton>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {user.wallet.isConnected && user.wallet.correctChain && (
        <Drawer
          isOpen={showMenu}
          onClose={closeMenu}
          size="sm"
          placement={slideDirection}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>
              <div className="d-flex align-items-center">
                <span className={classnames('me-2', styles.avatar)}>
                  {user.profile.profilePicture ? (
                    <img src={ImageService.translate(user.profile.profilePicture).avatar()} alt={user.profile.username} />
                  ) : (
                    <Blockies seed={`${user.wallet.address?.toLowerCase()}`} size={9} scale={4}/>
                  )}
                </span>
                <div>
                  <div className="fs-5 fw-bold">
                    {username(user.profile.username)}
                  </div>
                  <div>
                    <button className="btn_menu me-2" title="Copy Address" onClick={handleCopy}>
                      <FontAwesomeIcon icon={faCopy} />
                    </button>
                    <button className="btn_menu me-2" title="Copy Address" onClick={() => window.open(`https://cronoscan.com/address/${user.wallet.address}`, '_blank')}>
                      <FontAwesomeIcon icon={faSearch} />
                    </button>
                    {user.profile.username && (
                      <span className={styles.username}>
                        {shortAddress(user.wallet.address)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </DrawerHeader>
            <DrawerBody>

              <SimpleGrid columns={2} gap={2} className={styles.navigation}>
                <NextLink href={`/account/${user.wallet.address}`} onClick={closeMenu}>
                  <div className={styles.col}>
                    <span>
                      <FontAwesomeIcon icon={faUser} />
                    </span>
                    <span className="ms-2">My Profile</span>
                  </div>
                </NextLink>
                <NextLink href='/account/settings/profile' onClick={closeMenu}>
                  <div className={styles.col}>
                    <span>
                      <FontAwesomeIcon icon={faEdit} />
                    </span>
                    <span className="ms-2">Edit Account</span>
                  </div>
                </NextLink>
                <NextLink href={`/account/${user.wallet.address}?tab=offers`} onClick={closeMenu}>
                  <div className={styles.col}>
                    <span>
                      <FontAwesomeIcon icon={faHand} />
                    </span>
                    <span className="ms-2">My Offers</span>
                  </div>
                </NextLink>
                <NextLink href='/staking' onClick={closeMenu}>
                  <div className={styles.col}>
                    <span>
                      <FontAwesomeIcon icon={faBolt} />
                    </span>
                    <span className="ms-2">Staking</span>
                  </div>
                </NextLink>
                <NextLink href={`/account/${user.wallet.address}?tab=listings`} onClick={closeMenu}>
                  <div className={styles.col}>
                    <span>
                      <FontAwesomeIcon icon={faCoins} />
                    </span>
                    <span className="ms-2">Listings</span>
                  </div>
                </NextLink>
                <NextLink href={`/account/${user.wallet.address}?tab=sales`} onClick={closeMenu}>
                  <div className={styles.col}>
                    <span>
                      <FontAwesomeIcon icon={faDollarSign} />
                    </span>
                    <span className="ms-2">Sales</span>
                  </div>
                </NextLink>
                <NextLink href={`/account/${user.wallet.address}?tab=favorites`} onClick={closeMenu}>
                  <div className={styles.col}>
                    <span>
                      <FontAwesomeIcon icon={faHeart} />
                    </span>
                    <span className="ms-2">Favorites</span>
                  </div>
                </NextLink>
                <Box as='span' onClick={toggleTheme}>
                  <Box className={styles.col}>
                    <span>
                      <FontAwesomeIcon icon={user.theme === 'dark' ? faMoon : faSun} />
                    </span>
                    <span className="ms-2">Dark mode</span>
                  </Box>
                </Box>
              </SimpleGrid>

              <Heading as="h3" size="md" className="mt-4 mb-3">
                <FontAwesomeIcon icon={faWallet} className="me-2"/>
                <span>Wallet Info</span>
              </Heading>

              <div className="d-flex">
                <div className="flex-fill">
                  <div className="text-muted">$Fortune</div>
                  <div>
                    {!user.initializing ? (
                      <span className="d-wallet-value">
                        <div className="d-flex">
                          <FortuneIcon boxSize={6} />
                          <span className="ms-1">
                            {ethers.utils.commify(round(user.balances.frtn))}
                          </span>
                        </div>
                      </span>
                    ) : (
                      <span>
                        <Spinner size='sm' />
                      </span>
                    )}
                  </div>
                </div>
                <div className="my-auto">
                  <PrimaryButton onClick={handleBuyFortune}>
                    Buy $Fortune
                  </PrimaryButton>
                </div>
              </div>
              <div className="d-flex mt-2">
                <div className="flex-fill">
                  <div className="text-muted">CRO Balance</div>
                  <div>
                    {!user.initializing ? (
                      <span className="d-wallet-value">
                      {user.balances ? (
                        <div className="d-flex">
                          <CronosIconBlue boxSize={6} />
                          <span className="ms-1">
                            {ethers.utils.commify(round(user.balances.cro, 2))}
                          </span>
                        </div>
                      ) : (
                        <>N/A</>
                      )}
                    </span>
                    ) : (
                      <span>
                        <Spinner size='sm' />
                      </span>
                    )}
                  </div>
                </div>
                <div className="my-auto">
                  <Button type="legacy"
                          onClick={handleBuyCro}>
                    <CronosIconFlat boxSize={4} />
                    <Text ms={1}>Buy CRO</Text>
                  </Button>
                </div>
              </div>
              <div className="d-flex mt-2">
                <div className="flex-fill">
                  <div className="text-muted">Market Escrow</div>
                  {!user.initializing ? (
                    <div>
                      {user.escrow.balance ? (
                        <>
                          <div className="d-flex">
                            <CronosIconBlue boxSize={6} />
                            <span className="ms-1">
                              {ethers.utils.commify(round(user.escrow.balance, 2))}
                            </span>
                          </div>
                        </>
                      ) : (
                        <span className="d-wallet-value">0.0 CRO</span>
                      )}
                    </div>
                  ) : (
                    <span>
                      <Spinner size='sm' />
                    </span>
                  )}
                </div>
                <div className="my-auto">
                  {!user.initializing && (
                    <>
                      <Wrap>
                        {Number(user.escrow.balance) > 0 && (
                          <FunctionButton
                            title='Claim'
                            fn={withdrawBalance}
                          />
                        )}
                        {user.escrow.enabled ? (
                          <FunctionButton
                            title='Opt-Out'
                            fn={() => toggleEscrowOptIn(false)}
                          />
                        ) : (
                          <FunctionButton
                            title='Opt-In to Escrow'
                            fn={() => toggleEscrowOptIn(true)}
                          />
                        )}
                      </Wrap>
                    </>
                  )}
                </div>
              </div>
              <Text fontSize={'xs'}>
                {user.escrow.enabled ? <>Sales and royalties must be claimed from escrow. Opt-out to receive payments directly</>
                  : <>Sales and royalties go directly to your wallet. If you prefer claiming from escrow, opt-in above</>
                }
              </Text>
              <div className="d-flex mt-2">
                <div className="flex-fill">
                  <div className="text-muted">CRO Staking Rewards</div>
                  <div className="">
                    {!user.initializing ? (
                      <>
                        {user.balances.staking ? (
                          <>
                          <span className="d-wallet-value">
                            {ethers.utils.commify(round(user.balances.staking, 2))} CRO
                          </span>
                          </>
                        ) : (
                          <span className="d-wallet-value">0.0 CRO</span>
                        )}
                      </>
                    ) : (
                      <span>
                        <Spinner size='sm' />
                      </span>
                    )}
                  </div>
                </div>
                <div className="my-auto">
                  {user.balances.staking > 0 && (
                    <FunctionButton
                      title='Harvest'
                      fn={harvestStakingRewards}
                    />
                  )}
                </div>
              </div>
              <Text fontSize={'xs'}>
                From 13 Dec 2023, staking rewards are now issued in <strong>$FRTN</strong>. Visit the <Link as={NextLink} href='/ryoshi' className='color' color='auto' fontWeight='bold'>Ryoshi Dynasties Bank</Link> to claim
              </Text>
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
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
};

export default memo(Index);

const FunctionButton = ({title, fn}: {title: string, fn: () => Promise<void>}) => {
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecution = async () => {
    try {
      setIsExecuting(true);
      await fn();
    } catch (e) {
      console.log(e);
      Sentry.captureException(e);
      toast.error(parseErrorMessage(e));
    } finally {
      setIsExecuting(false);
    }
  }

  return (
    <PrimaryButton
      onClick={handleExecution}
      isLoading={isExecuting}
      isDisabled={isExecuting}
      loadingText={title}
    >
      {title}
    </PrimaryButton>
  )
}
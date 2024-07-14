import React, {memo, useEffect, useState} from 'react';
import Blockies from 'react-blockies';
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
import {createSuccessfulTransactionToastContent, round, shortAddress, username} from '@market/helpers/utils';
import styles from './accountmenu.module.scss';
import {useWeb3Modal} from '@web3modal/wagmi/react'
import {appConfig} from '@src/Config';
import classnames from "classnames";
import Button from "@src/Components/components/Button";
import {
  Box,
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
  useDisclosure,
  VStack,
  Wrap
} from "@chakra-ui/react";
import CronosIconFlat from "@src/components-v2/shared/icons/cronos";
import ImageService from "@src/core/services/image";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import CronosIconBlue from "@src/components-v2/shared/icons/cronos-blue";
import FortuneIcon from "@src/components-v2/shared/icons/fortune";
import {getTheme} from "@src/global/theme/theme";
import {useContractService, useUser} from "@src/components-v2/useUser";
import {parseErrorMessage} from "@src/helpers/validator";
import {GasWriter} from "@src/core/chain/gas-writer";
import * as Sentry from "@sentry/nextjs";

const config = appConfig();

const Index = function () {
  const user = useUser();
  const { open: openWeb3Modal, close: closeWeb3Modal } = useWeb3Modal();
  const contractService = useContractService();
  const { isOpen: isLoginWizardOpen, onOpen: onLoginWizardOpen, onClose: onLoginWizardClose } = useDisclosure()

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
  const isMobile = useBreakpointValue({ base: true, sm: false });

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

  const toggleTheme = () => {
    const newTheme = user.theme === 'light' ? 'dark' : 'light';
    user.toggleTheme(newTheme);
  };

  const handleOpenLoginWizard = () => {
    if (isMobile) {
      onLoginWizardOpen();
    } else {
      openWeb3Modal();
    }
  }

  const handleLoginWizardComplete = () => {
    onLoginWizardClose();
    openWeb3Modal();
  }

  return (
    <div>
      {!user.address && (
        <div className="de-menu-notification" onClick={handleOpenLoginWizard} style={{background: '#218cff', marginLeft:'5px'}}>
          <FontAwesomeIcon icon={faWallet} color="white" />
        </div>
      )}
      {user.wallet.isConnected && !user.wallet.correctChain && (
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

      <Modal onClose={onLoginWizardClose} isOpen={isLoginWizardOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className="text-center">
            Mobile Pro Tip:
          </ModalHeader>
          <ModalCloseButton color={getTheme(user.theme)!.colors.textColor4} />
          <ModalBody >
            <VStack spacing={4}>
              <Text align='center'>
                If you are having trouble connecting with DeFi Wallet or MetaMask, click <strong>"Browser Wallet"</strong> for better success.
              </Text>
              <Image
                src={ImageService.translate('/img/login-wizard.webp').convert()}
                maxW={400}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <PrimaryButton w='full' onClick={handleLoginWizardComplete}>
              Ok, Got it
            </PrimaryButton>
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
import React, {ReactNode, useEffect, useState} from 'react';
import {BigNumber, constants, Contract, ethers} from 'ethers';
import Countdown, {zeroPad} from 'react-countdown';
import {keyframes} from '@emotion/react';
import Reveal from 'react-awesome-reveal';
import {useRouter} from 'next/router';
import ReactPlayer from 'react-player';
import * as Sentry from '@sentry/react';
import styled from 'styled-components';
import {
  createSuccessfulTransactionToastContent,
  isFounderDrop,
  newlineText,
  percentage
} from '@market/helpers/utils';
import {useInterval} from "@market/hooks/use-interval";
import {DropState, DropState as statuses} from '@src/core/api/enums';
import SocialsBar from '@src/Components/Collection/SocialsBar';
import {appConfig} from "@src/config";
import {hostedImage} from "@src/helpers/image";
import {CollectionVerificationRow} from "@src/Components/components/CollectionVerificationRow";
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Image,
  Input,
  Progress,
  Stack,
  Tag,
  Text,
  useNumberInput,
  VStack
} from "@chakra-ui/react";
import {Drop} from "@src/core/models/drop";
import ImageService from "@src/core/services/image";
import {getTheme} from "@src/global/theme/theme";
import {commify, parseUnits} from "ethers/lib/utils";
import {toast} from "react-toastify";
import {getAnalytics, logEvent} from "@firebase/analytics";
import Fortune from "@src/global/contracts/Fortune.json";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import Link from "next/link";
import {parseErrorMessage} from "@src/helpers/validator";
import FortuneIcon from "@src/components-v2/shared/icons/fortune";
import {useContractService, useUser} from "@src/components-v2/useUser";
import useAuthedFunction from "@market/hooks/useAuthedFunction";
import {ApiService} from "@src/core/services/api-service";
import useEnforceSigner from "@src/Components/Account/Settings/hooks/useEnforceSigner";

const config = appConfig();

const fadeInUp = keyframes`
  0% {
    opacity: 0;
    -webkit-transform: translateY(40px);
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
`

const HeroSection = styled.section`
  border-radius: 0;
  margin: 0;
  padding: 0 0;
  background-size: cover;
  width: 100%;
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;

  .h-vh {
    height: 100vh;
    display: flex;
    align-items: center;
    background-position: center;
    background-size: cover;
  }
`;

const tabs = {
  description: 'description',
  shop: 'shop'
};

interface LandDropProps {
  drop: Drop;
}

interface PhaseData {
  mintCost: number;
  redeemCost: number;
  mitamaAmount: number;
  startTime: number;
  endTime: number;
  maxMintAmount: number;
}

enum FundingType {
  NATIVE = 'native',
  FORTUNE = 'fortune',
  REWARDS = 'rewards',
}

const Vip2Drop = ({drop}: LandDropProps) => {
  const router = useRouter();
  const { slug } = router.query;
  const user = useUser();
  const [runAuthedFunction] = useAuthedFunction();
  const {requestSignature} = useEnforceSigner();

  const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);

  const [mintingWithType, setMintingWithType] = useState<FundingType>();
  const [status, setStatus] = useState(statuses.UNSET);

  const [abi, setAbi] = useState<any>(null);
  const [maxSupply, setMaxSupply] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [canMintQuantity, setCanMintQuantity] = useState(0);

  const [phaseData, setPhaseData] = useState<PhaseData[]>([]);
  const contractService = useContractService();
  const [openMenu, setOpenMenu] = useState(tabs.shop);

  const handleBtnClick = (key: string) => (element: any) => {
    setOpenMenu(key);
  };

  useEffect(() => {
    async function fetchData() {
      await retrieveDropInfo();
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.address]);

  const retrieveDropInfo = async () => {
    // Don't do any contract stuff if the drop does not have an address
    if (!drop.address || drop.complete) {
      setDropInfo(drop, 0);
      calculateStatus(drop, drop.complete ? drop.totalSupply : 0, drop.totalSupply);
      return;
    }

    const abiJson = require(`@market/assets/abis/ryoshi-tales-vip-2.json`);
    let abi = abiJson;
    setAbi(abiJson);

    try {
      let readContract = await new ethers.Contract(drop.address, abi, readProvider);
      const infos = await readContract.getInfo();
      const canMint = user.address ? await readContract.canMint(user.address) : 0;

      setDropInfoFromContract(infos, canMint, Number(infos.publicStartTime));
      calculateStatus(drop, infos.totalSupply, infos.maxSupply);
    } catch (error) {
      console.log(error);
      Sentry.captureException(error);
    }
  };

  const setDropInfo = (drop: any, supply: number) => {
    setMaxSupply(drop.totalSupply);
    setTotalSupply(supply);
    setCanMintQuantity(drop.maxMintPerTx);
    const costPerPhase = [2000,2150,2200,2300,2350,2400,3000];
    const mitamaPerPhase = [200000,100000,75000,25000,10000,5000,0];
    const maxMintAmounts = [50,150,150,150,300,500,0];

    const phaseLength = 60 * 10; // 10 minutes
    const startTimePerPhase = [drop.start];
    for (let i = 0; i < costPerPhase.length - 1; i++) {
      startTimePerPhase.push(startTimePerPhase[i] + (phaseLength * 1000));
    }

    const phaseData = costPerPhase.map((cost: number, index: number) => {
      const endTime = index === costPerPhase.length - 1 ? startTimePerPhase[index] + (phaseLength * 1000) : startTimePerPhase[index + 1];

      return {
        mintCost: cost,
        redeemCost: cost + 200,
        mitamaAmount: mitamaPerPhase[index],
        startTime: startTimePerPhase[index],
        endTime,
        maxMintAmount: maxMintAmounts[index]
      }
    });
    setPhaseData(phaseData);
  };

  const setDropInfoFromContract = (infos: any, canMint: number, presaleStart: number) => {
    setMaxSupply(infos.maxSupply);
    setTotalSupply(infos.totalSupply);
    setCanMintQuantity(Math.min(canMint, infos.maxMintPerTx));

    const costPerPhase = infos.costs.map((cost: BigNumber) => Number(ethers.utils.formatEther(cost)));
    const mitamaPerPhase = infos.mitamaAmounts.map((amount: BigNumber) => Number(amount));
    const phaseLength = 60 * 10; // 10 minutes
    const startTimePerPhase = [presaleStart * 1000];
    for (let i = 0; i < costPerPhase.length - 1; i++) {
      startTimePerPhase.push(startTimePerPhase[i] + (phaseLength * 1000));
    }
    const rewardIncrease = Number(ethers.utils.formatEther(infos.rewardIncrease));
    const maxMintAmounts = infos.maxMintAmounts.map((amount: BigNumber) => Number(amount));

    const phaseData = costPerPhase.map((cost: number, index: number) => {
      const endTime = index === costPerPhase.length - 1 ? startTimePerPhase[index] + (phaseLength * 1000) : startTimePerPhase[index + 1];

      return {
        mintCost: cost,
        redeemCost: cost + rewardIncrease,
        mitamaAmount: mitamaPerPhase[index],
        startTime: startTimePerPhase[index],
        endTime,
        maxMintAmount: maxMintAmounts[index]
      }
    });

    setPhaseData(phaseData);
  };

  const calculateStatus = (drop: any, totalSupply: number, maxSupply: number) => {
    const sTime = new Date(drop.start);
    const eTime = new Date(drop.end);
    const now = new Date();

    if (!drop.start || !drop.address || sTime > now) setStatus(statuses.NOT_STARTED);
    else if (parseInt(totalSupply.toString()) >= parseInt(maxSupply.toString()) && !isFounderDrop(drop.address))
      setStatus(statuses.SOLD_OUT);
    else if (!drop.end || eTime > now) setStatus(statuses.LIVE);
    else if (drop.end && eTime < now) setStatus(statuses.EXPIRED);
    else setStatus(statuses.NOT_STARTED);
  };

  const handleMint = async (fundingType: FundingType, numToMint: number, phase: PhaseData) => {
    runAuthedFunction(async() => {
      setMintingWithType(fundingType);
      const mintContract = await new ethers.Contract(drop.address, abi, user.provider.getSigner());
      try {
        let finalCost = phase.mintCost * numToMint;

        let response;
        if (fundingType === FundingType.REWARDS) {
          finalCost = phase.redeemCost * numToMint;
          response = await mintWithRewards(numToMint, finalCost);
        } else if (fundingType === FundingType.FORTUNE) {
          finalCost = phase.mintCost * numToMint;
          response = await mintWithFortune(numToMint, finalCost);
        } else {
          throw new Error('Invalid funding type');
        }

        const receipt = await response.wait();
        toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));

        {
          const purchaseAnalyticParams = {
            value: Number(ethers.utils.formatEther(finalCost)),
            currency: 'FRTN',
            transaction_id: receipt.transactionHash,
            drop_name: drop.title.toString(),
            drop_slug: drop.slug.toString(),
            drop_address: drop.address.toString(),
            items: [{
              item_id: drop.slug,
              item_name: drop.title,
              item_brand: drop.author.name,
              price: drop.cost,
              discount: Number(drop.cost),
              quantity: numToMint
            }]
          };

          logEvent(getAnalytics(), 'purchase', purchaseAnalyticParams);
        }

        await retrieveDropInfo();
      } catch (error: any) {
        console.log(error);
        Sentry.captureException(error);
        toast.error(parseErrorMessage(error));
      } finally {
        setMintingWithType(undefined);
      }
    });
  };

  const mintWithFortune = async (numToMint: number, finalCost: number) => {
    const fortuneContract = new Contract(config.contracts.fortune, Fortune, user.provider.getSigner());
    const allowance = await fortuneContract.allowance(user.address, drop.address);
    if (allowance.sub(finalCost) <= 0) {
      const approvalTx = await fortuneContract.approve(drop.address, constants.MaxUint256);
      await approvalTx.wait();
    }

    const actualContract = new Contract(drop.address, abi, user.provider.getSigner());
    const gasPrice = parseUnits('12000', 'gwei');
    const gasEstimate = await actualContract.estimateGas.mintWithToken(numToMint);
    const gasLimit = gasEstimate.mul(2);
    let extra = {
      gasPrice,
      gasLimit
    };

    return await actualContract.mintWithToken(numToMint, extra);
  }

  const mintWithRewards = async (numToMint: number, finalCost: number) => {
    const signature = await requestSignature();
    const finalCostEth = ethers.utils.formatEther(finalCost);
    const authorization = await ApiService.withoutKey().ryoshiDynasties.requestRewardsSpendAuthorization(
      finalCost,
      numToMint,
      `Drop: ${drop.title}`,
      user.address!,
      signature
    );

    const gasPrice = parseUnits('12000', 'gwei');
    const actualContract = contractService!.custom(drop.address, abi);
    const gasEstimate = await actualContract.estimateGas.mintWithRewards(numToMint, authorization.reward, authorization.signature);
    const gasLimit = gasEstimate.mul(2);
    let extra = {
      gasPrice,
      gasLimit
    };

    return await actualContract.mintWithRewards(numToMint, authorization.reward, authorization.signature, extra);
  }

  return (
    <div>
      <HeroSection
        className={`jumbotron h-vh tint`}
        style={{
          backgroundImage: `url(${ImageService.translate(drop.images.banner ?? hostedImage('/img/background/banner-default.webp')).banner()})`
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className={`col-lg-6 mb-4 mb-sm-0 ${drop.mediaPosition === 'left' ? 'order-1' : 'order-2'}`}>
            </div>
            <div className={`col-lg-6 ${drop.mediaPosition === 'left' ? 'order-2' : 'order-1'}`}>
              <div className="spacer-single"></div>
              <div className="spacer-double"></div>

              {status === statuses.LIVE && drop.end && (
                <Reveal className="onStep" keyframes={fadeInUp} delay={600} duration={900} triggerOnce>
                  <p className="lead col-white">
                    Ends in: <Countdown date={drop.end} />
                  </p>
                </Reveal>
              )}
              {status === statuses.NOT_STARTED && drop.start && (
                <Reveal className="onStep" keyframes={fadeInUp} delay={600} duration={900} triggerOnce>
                  <Heading as="h4" size="md" className="col-white">
                    Starts in:{' '}
                    <span className="text-uppercase color">
                      <Countdown date={drop.start} />
                    </span>
                  </Heading>
                </Reveal>
              )}
              <Reveal className="onStep" keyframes={fadeInUp} delay={300} duration={900} triggerOnce>
                <Heading as="h1" size="2xl" className="col-white mb-4">{drop.title}</Heading>
              </Reveal>
              <Reveal className="onStep" keyframes={fadeInUp} delay={300} duration={900} triggerOnce>
                <div className="lead col-white mb-4">{newlineText(drop.subtitle)}</div>
              </Reveal>
              <Reveal className="onStep" keyframes={fadeInUp} delay={300} duration={900} triggerOnce>
                <div>
                  <a href="#drop_detail" className="btn-main">
                    View Drop
                  </a>
                </div>
              </Reveal>
              <div className="spacer-10"></div>
            </div>
          </div>
        </div>
      </HeroSection>

      <section id="drop_detail" className="gl-legacy container no-top">
        <div className="row mt-md-5 pt-md-4">
          <div className="col-md-6 text-center mt-4 md-md-0">
            {!!drop.images.drop && (
              <img src={hostedImage(drop.images.drop)} className="img-fluid img-rounded mb-sm-30" alt={drop.title}/>
            )}
          </div>
          <div className="col-md-6 mt-4 mt-md-0">
            <Flex justify={{base: 'center', md: 'start'}} mb={4}>
              <Stack direction={{base: 'column', md: 'row'}} className="profile_avatar" alignItems='center'>
                <Image src={hostedImage(drop.images.avatar)} alt={drop.author.name} />
                <Box className="profile_name" textAlign={{base: 'center', md: 'start'}}>
                  <Heading as="h4" size="md">
                    <Box ms={2}>{drop.title}</Box>
                    <Box mt={2}>
                      <SocialsBar address={drop.address} socials={drop.author} />
                    </Box>
                  </Heading>
                </Box>
              </Stack>
            </Flex>

            <Flex justify={{base: 'center', md: 'start'}}>
              <CollectionVerificationRow
                doxx={drop.verification.doxx}
                kyc={drop.verification.kyc}
                escrow={drop.verification.escrow}
                creativeCommons={drop.verification.creativeCommons}
              />

            </Flex>

            <div className="de_tab mt-2">
              <ul className="de_nav mb-2 text-center">
                <li className={`tab ${openMenu === tabs.shop ? 'active' : ''} my-1`}>
                  <span onClick={handleBtnClick(tabs.shop)}>Mint</span>
                </li>
                <li className={`tab ${openMenu === tabs.description ? 'active' : ''} my-1`}>
                  <span onClick={handleBtnClick(tabs.description)}>Description</span>
                </li>
              </ul>
              <div className="de_tab_content">
                {openMenu === tabs.shop && (
                  <>
                    {(status === statuses.UNSET || status === statuses.NOT_STARTED || drop.complete) && (
                      <Flex justify='space-between' fontSize='sm' fontWeight='semibold'>
                        <Box>Supply:</Box>
                        <Box>{ethers.utils.commify(maxSupply.toString())}</Box>
                      </Flex>
                    )}
                    {status >= statuses.LIVE && !drop.complete && (
                      <Box>
                        <Flex justify='space-between' mt={3} mb={1}>
                          <Box fontWeight='bold'>{percentage(totalSupply.toString(), maxSupply.toString())}% minted</Box>
                          <Box>{ethers.utils.commify(totalSupply.toString())} / {ethers.utils.commify(maxSupply.toString())}</Box>
                        </Flex>
                        <Progress
                          size='xs'
                          value={percentage(totalSupply.toString(), maxSupply.toString())}
                          bg='white'
                        />
                      </Box>
                    )}

                    {phaseData.map((phase, index) => (
                      <MintPhase
                        title={`Round ${index + 1}`}
                        description={
                          <>
                            {phase.mitamaAmount > 0 ? (
                              <>
                                For users with <strong>{commify(phase.mitamaAmount)}+ Mitama</strong>. Earn Mitama by staking FRTN in the <Link href='/ryoshi/bank' className='color fw-bold'>Ryoshi Dynasties Bank</Link>
                              </>
                            ) : (
                              <>
                                Open to all users
                              </>
                            )}
                          </>
                        }
                        phase={phase}
                        onMint={handleMint}
                        maxMintQuantity={canMintQuantity}
                        mintingWithType={mintingWithType}
                        isDropComplete={drop.complete || status > DropState.LIVE}
                        dropStatus={status}
                        currentSupply={Number(totalSupply)}
                        maxSupply={Number(maxSupply)}
                        onRefreshDropStatus={() => calculateStatus(drop, totalSupply, maxSupply)}
                        isLastPhase={index === phaseData.length - 1}
                      />
                    ))}
                  </>
                )}

                {openMenu === tabs.description && (
                  <div className="mt-3 mb-4">{newlineText(drop.description)}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Vip2Drop;


interface MintPhaseProps {
  title: string;
  description?: ReactNode;
  phase: PhaseData;
  onMint: (fundingType: FundingType, numToMint: number, phase: PhaseData) => void;
  maxMintQuantity: number;
  mintingWithType: FundingType | undefined;
  isDropComplete: boolean;
  dropStatus: number;
  currentSupply: number;
  maxSupply: number;
  onRefreshDropStatus: () => void;
  isLastPhase: boolean;
}

const MintPhase = ({ title, description, phase, onMint, maxMintQuantity, mintingWithType, isDropComplete, dropStatus, currentSupply, maxSupply, onRefreshDropStatus, isLastPhase }: MintPhaseProps) => {
  const user = useUser();
  const [numToMint, setNumToMint] = useState(1);
  const [phaseStatus, setPhaseStatus] = useState(DropState.UNSET);
  const [countdownFinished, setCountdownFinished] = useState(false);

  async function syncStatus() {
    if (dropStatus < DropState.LIVE) {
      setPhaseStatus(statuses.NOT_STARTED);
    } else if (dropStatus > DropState.LIVE || isDropComplete) {
      setPhaseStatus(statuses.EXPIRED);
    } else {
      const now = Date.now();

      if (phase.startTime > now) setPhaseStatus(statuses.NOT_STARTED);
      else if (currentSupply >= maxSupply || phase.maxMintAmount < 1) setPhaseStatus(statuses.SOLD_OUT);
      else if (!phase.endTime || phase.endTime > now) setPhaseStatus(statuses.LIVE);
      else if (phase.endTime && phase.endTime < now) setPhaseStatus(statuses.EXPIRED);
      else setPhaseStatus(statuses.NOT_STARTED);
    }
  }

  useEffect(() => {
    syncStatus();
  }, [phase.startTime]);

  useInterval(() => {
    async function func() {
      syncStatus();
    }
    func();
  }, 1000);

  const startTimeRenderer = ({ days, hours, minutes, seconds, completed }: { days:number, hours:number, minutes:number, seconds: number, completed:boolean}) => {
    if (completed) {
      return <>Live!</>;
    } else {
      // Render a countdown
      return <span>Starts in: {zeroPad(days)}:{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}</span>;
    }
  };

  const endTimeRenderer = ({ days, hours, minutes, seconds, completed }: { days:number, hours:number, minutes:number, seconds: number, completed:boolean}) => {
    if (completed) {
      return <>Ended</>;
    } else {
      // Render a countdown
      return <span>Ends in: {zeroPad(days)}:{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}</span>;
    }
  };

  const handleTimerComplete = () => {
    if (!countdownFinished) {
      onRefreshDropStatus();
      setCountdownFinished(true);
    }
  }

  const connectWalletPressed = () => {
    user.connect();
  };

  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      defaultValue: numToMint,
      min: 1,
      max: maxMintQuantity,
      precision: 0,
      onChange(valueAsString, valueAsNumber) {
        setNumToMint(valueAsNumber);
      }
    })
  const inc = getIncrementButtonProps()
  const dec = getDecrementButtonProps()
  const input = getInputProps()

  return (
    <Box
      className="card shadow"
      mt={2}
      borderColor={phaseStatus === statuses.LIVE ? getTheme(user.theme).colors.borderColor3 : getTheme(user.theme).colors.borderColor2}
      borderWidth={phaseStatus === statuses.LIVE ? 2 : 1}
      bgColor={getTheme(user.theme).colors.bgColor5}
      p={4}
      rounded='2xl'
    >
      <Flex justify='space-between'>
        <Box fontSize="xl" fontWeight='bold' className="mb-1">{title}</Box>
        <VStack alignItems='end'>
          {phaseStatus === statuses.LIVE ? (
            <Tag size='sm' variant='solid' colorScheme='blue'>
              {isLastPhase ? (
                <Countdown
                  date={phase.endTime}
                  renderer={endTimeRenderer}
                  onComplete={handleTimerComplete}
                />
              ) : (
                <>Live!</>
              )}
            </Tag>
          ) : phaseStatus > statuses.LIVE ? (
            <Tag size='sm'>Ended</Tag>
          ) : (
            <Tag size='sm' variant='solid'>
              <Countdown
                date={phase.startTime}
                renderer={startTimeRenderer}
                onComplete={handleTimerComplete}
              />
            </Tag>
          )}
          {phaseStatus <= statuses.LIVE && (
            <Tag size='sm' variant='solid' colorScheme='blue'>Remaining: {phase.maxMintAmount > 0 ? phase.maxMintAmount : commify(maxSupply - currentSupply)}</Tag>
          )}
        </VStack>
      </Flex>
      <HStack spacing={0}>
        <FortuneIcon boxSize={6} />
        <span className="ms-2">{phase.mintCost ? commify(phase.mintCost) : 'TBA'}</span>
      </HStack>
      {phase.redeemCost && (
        <HStack mt={2} fontSize='sm'>
          <Text>From rewards:</Text>
          <HStack spacing={0}>
            <FortuneIcon boxSize={4} />
            <span className="ms-2">{commify(phase.redeemCost)}</span>
          </HStack>
        </HStack>
      )}

      {phaseStatus === statuses.LIVE ? (
        <Box mt={2}>
          {maxMintQuantity > 0 && (
            <Stack direction={{base:'column', lg:'row'}} spacing={2}>
              <HStack minW="150px">
                <Button {...dec}>-</Button>
                <Input {...input} />
                <Button {...inc}>+</Button>
              </HStack>
              {(!mintingWithType || mintingWithType === FundingType.FORTUNE) && (
                <PrimaryButton
                  w='full'
                  onClick={() => onMint(FundingType.FORTUNE, numToMint, phase)}
                  disabled={mintingWithType === FundingType.FORTUNE}
                  isLoading={mintingWithType === FundingType.FORTUNE}
                  loadingText='Minting...'
                >
                  Mint
                </PrimaryButton>
              )}
              {(!mintingWithType || mintingWithType === FundingType.REWARDS) && (
                <PrimaryButton
                  w='full'
                  onClick={() => onMint(FundingType.REWARDS, numToMint, phase)}
                  disabled={mintingWithType === FundingType.REWARDS}
                  isLoading={mintingWithType === FundingType.REWARDS}
                  loadingText='Minting from FRTN rewards'
                  whiteSpace='initial'
                >
                  Mint from FRTN rewards
                </PrimaryButton>
              )}
            </Stack>
          )}
          {maxMintQuantity === 0 && !user.address && (
            <PrimaryButton onClick={connectWalletPressed}>
              Connect Wallet
            </PrimaryButton>
          )}
          <Box textAlign='center' fontSize='sm' mt={4}>{description}</Box>
        </Box>
      ) : phaseStatus === statuses.SOLD_OUT ? (
        <Box textAlign='center' mt={4}>SOLD OUT</Box>
      ) : phaseStatus === statuses.EXPIRED ? (
        <Box textAlign='center' mt={4}>ENDED</Box>
      ) : (
        <Box textAlign='center' fontSize='sm' mt={4}>{description}</Box>
      )}
    </Box>
  )
}
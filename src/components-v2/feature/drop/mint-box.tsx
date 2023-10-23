import {getTheme} from "@src/Theme/theme";
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  Progress,
  Skeleton,
  Stack,
  Text,
  useNumberInput
} from "@chakra-ui/react";
import {dropState as statuses} from "@src/core/api/enums";
import {constants, Contract, ethers} from "ethers";
import {createSuccessfulTransactionToastContent, percentage, round} from "@src/utils";
import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import MetaMaskOnboarding from "@metamask/onboarding";
import {chainConnect, connectAccount} from "@src/GlobalState/User";
import {commify, parseUnits} from "ethers/lib/utils";
import {toast} from "react-toastify";
import {getAnalytics, logEvent} from "@firebase/analytics";
import * as Sentry from "@sentry/react";
import {appConfig} from "@src/Config";
import {useAppSelector} from "@src/Store/hooks";
import {Drop} from "@src/core/models/drop";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import CronosIconBlue from "@src/components-v2/shared/icons/cronos-blue";
import DynamicCurrencyIcon from "@src/components-v2/shared/dynamic-currency-icon";
import Link from "next/link";
import {ApiService} from "@src/core/services/api-service";
import useEnforceSigner from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import {parseErrorMessage} from "@src/helpers/validator";

const config = appConfig();
const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
enum FundingType {
  NATIVE = 'native',
  ERC20 = 'erc20',
  REWARDS = 'rewards',
}

interface MintBoxProps {
  drop: Drop;
  abi: any;
  status: number;
  totalSupply: number;
  maxSupply: number;
  priceDescription?: string;
  onMintSuccess: () => void;
  canMintQuantity: number;
  regularCost: number;
  memberCost: number;
  whitelistCost: number;
  specialWhitelist: any;
  maxMintPerTx: number;
  maxMintPerAddress: number;
}

export const MintBox = ({drop, abi, status, totalSupply, maxSupply, priceDescription, onMintSuccess, canMintQuantity, regularCost, memberCost, whitelistCost, specialWhitelist, maxMintPerTx, maxMintPerAddress}: MintBoxProps) => {
  const dispatch = useDispatch();
  const user = useAppSelector((state) => {
    return state.user;
  });
  const userTheme = useAppSelector((state) => {
    return state.user.theme;
  });
  const {requestSignature} = useEnforceSigner();

  const [mintingWithType, setMintingWithType] = useState<FundingType>();
  const [numToMint, setNumToMint] = useState(1);
  const isReady = !!maxSupply;
  const [erc20Token, setErc20Token] = useState<{name: string, symbol: string, address: string} | null>(null);

  const connectWalletPressed = () => {
    if (user.needsOnboard) {
      const onboarding = new MetaMaskOnboarding();
      onboarding.startOnboarding();
    } else if (!user.address) {
      dispatch(connectAccount());
    } else if (!user.correctChain) {
      dispatch(chainConnect());
    }
  };
  
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      defaultValue: numToMint,
      min: 1,
      max: canMintQuantity,
      precision: 0,
      onChange(valueAsString, valueAsNumber) {
        setNumToMint(valueAsNumber);
      }
    })
  const inc = getIncrementButtonProps()
  const dec = getDecrementButtonProps()
  const input = getInputProps()

  const isUsingAbiFile = (dropAbi: any) => {
    return typeof dropAbi === 'string' && dropAbi.length > 0;
  };

  const isUsingDefaultDropAbi = (dropAbi: any) => {
    return typeof dropAbi === 'undefined' || dropAbi.length === 0;
  };
  
  const calculateCost = async (user: any) => {
    if (isUsingDefaultDropAbi(drop.abi) || isUsingAbiFile(drop.abi)) {
      let readContract = await new ethers.Contract(drop.address, abi, readProvider);
      if (abi.find((m: any) => m.name === 'cost')) {
        return await readContract.cost(user.address);
      }
      return await readContract.mintCost(user.address);
    }
    const regCost = ethers.utils.parseEther(regularCost.toString() ?? '0');
    const mbrCost = ethers.utils.parseEther(memberCost?.toString() ?? '0');
    return user.isMember && !!memberCost ? mbrCost : regCost;
  };

  const convertTime = (time: any) => {
    let date = new Date(time);
    const fullDateString = date.toLocaleString('default', { timeZone: 'UTC' });
    const month = date.toLocaleString('default', { month: 'long', timeZone: 'UTC' });
    return `${fullDateString.split(', ')[1]} ${date.getUTCDate()} ${month} ${date.getUTCFullYear()} UTC`;
  };

  const mintNow = async (fundingType: FundingType) => {
    if (user.address) {
      if (!drop.writeContract) {
        console.log('missing write contract')
        return;
      }

      setMintingWithType(fundingType)
      const contract = drop.writeContract;
      try {
        const cost = await calculateCost(user);
        let finalCost = cost.mul(numToMint);

        if (!isUsingDefaultDropAbi(drop.abi) && !isUsingAbiFile(drop.abi)) {
          toast.error('Invalid ABI');
          return;
        }

        let response;
        if (fundingType === FundingType.REWARDS) {
          response = await mintWithRewards(contract, finalCost);
        } else if (fundingType === FundingType.ERC20) {
          response = await mintWithErc20(contract, finalCost);
        } else {
          response = await mintWithCro(contract, finalCost);
        }

        const receipt = await response.wait();
        toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));

        {
          const purchaseAnalyticParams = {
            value: Number(ethers.utils.formatEther(finalCost)),
            currency: 'CRO',
            transaction_id: receipt.transactionHash,
            drop_name: drop.title.toString(),
            drop_slug: drop.slug.toString(),
            drop_address: drop.address.toString(),
            items: [{
              item_id: drop.slug,
              item_name: drop.title,
              item_brand: drop.author.name,
              price: regularCost,
              discount: regularCost - Number(ethers.utils.formatEther(finalCost)),
              quantity: numToMint
            }]
          };

          logEvent(getAnalytics(), 'purchase', purchaseAnalyticParams);
        }

        onMintSuccess();
      } catch (error: any) {
        Sentry.captureException(error);
        console.log(error);
        toast.error(parseErrorMessage(error));
      } finally {
        setMintingWithType(undefined);
      }
    } else {
      dispatch(connectAccount());
    }
  };

  const mintWithCro = async (contract: Contract, finalCost: number) => {
    const gasPrice = parseUnits('5000', 'gwei');
    const gasEstimate = await contract.estimateGas.mint(numToMint, {value: finalCost});
    const gasLimit = gasEstimate.mul(2);
    let extra = {
      value: finalCost,
      gasPrice,
      gasLimit
    };

    await contract.mint(numToMint, extra);
  }

  const mintWithErc20 = async (contract: Contract, finalCost: number) => {
    const allowance = await drop.erc20ReadContract.allowance(user.address, drop.address);
    if (allowance.sub(finalCost) <= 0) {
      const approvalTx = await drop.erc20Contract.approve(drop.address, constants.MaxUint256);
      await approvalTx.wait();
    }

    const gasPrice = parseUnits('5000', 'gwei');
    const gasEstimate = await contract.estimateGas.mintWithToken(numToMint);
    const gasLimit = gasEstimate.mul(2);
    let extra = {
      gasPrice,
      gasLimit
    };

    return await contract.mintWithToken(numToMint, extra);
  }

  const mintWithRewards = async (contract: Contract, finalCost: number) => {
    const signature = await requestSignature();
    const finalCostEth = ethers.utils.formatEther(finalCost);
    const authorization = await ApiService.withoutKey().ryoshiDynasties.requestRewardsSpendAuthorization(finalCostEth, user.address!, signature);

    const gasPrice = parseUnits('5000', 'gwei');
    const gasEstimate = await contract.estimateGas.mintWithRewards(numToMint, authorization.reward, authorization.signature);
    const gasLimit = gasEstimate.mul(2);
    let extra = {
      gasPrice,
      gasLimit
    };

    return await contract.mintWithRewards(numToMint, authorization.reward, authorization.signature, extra);
  }

  useEffect(() => {
    const tokenKey = drop.erc20Token?.toLowerCase();
    const tokenValue = config.tokens[tokenKey ?? ''];

    if (tokenValue) {
      setErc20Token(tokenValue);
    }
  }, [drop]);

  return (
    <div className="card h-100 shadow mt-2" style={{
      borderColor:getTheme(userTheme).colors.borderColor3,
      borderWidth:'2px',
      backgroundColor:getTheme(userTheme).colors.bgColor5
    }}>
      <div className="card-body d-flex flex-column">
        {isReady ? (
          <>
            <Flex justify='center'>
              <HStack spacing={4}>
                <Box textAlign="center">
                  <Heading as="h6" size="sm" className="mb-1">Mint Price</Heading>
                  {drop.freeMint ? (
                    <Heading as="h5" size="md">Free Mint</Heading>
                  ) : (
                    <>
                      {!regularCost && !drop.erc20Cost && (
                        <Heading as="h5" size="md">TBA</Heading>
                      )}
                      {!!regularCost && !drop.erc20Only && (
                        <Heading as="h5" size="md">
                          <Flex alignItems='center'>
                            <CronosIconBlue boxSize={5} />
                            <span className="ms-2">{ethers.utils.commify(round(regularCost))}</span>
                          </Flex>
                        </Heading>
                      )}
                      {drop.erc20Cost && drop.erc20Token && erc20Token && (
                        <Heading as="h5" size="md" mt={1}>
                          <Flex alignItems='center'>
                            <DynamicCurrencyIcon address={erc20Token.address} boxSize={6} />
                            <span className="ms-2">{ethers.utils.commify(round(drop.erc20Cost))}</span>
                          </Flex>
                        </Heading>
                      )}
                    </>
                  )}
                </Box>
                {(!!memberCost || (drop.erc20MemberCost && drop.erc20Cost !== drop.erc20MemberCost)) && (
                  <Box>
                    <Heading as="h6" size="sm" className="mb-1">
                      {drop.memberMitama > 0 ? 'Mitama Price' : 'Member Price'}
                    </Heading>
                    {!!memberCost && !drop.erc20Only && (
                      <Heading as="h5" size="md">
                        <Flex alignItems='center'>
                          <CronosIconBlue boxSize={5} />
                          <span className="ms-2">{ethers.utils.commify(round(memberCost))}</span>
                        </Flex>
                      </Heading>
                    )}
                    {!!drop.erc20Token && !!drop.erc20MemberCost && drop.erc20Cost !== drop.erc20MemberCost && erc20Token && (
                      <Heading as="h5" size="md" mt={1}>
                        <Flex alignItems='center'>
                          <DynamicCurrencyIcon address={erc20Token.address} boxSize={6} />
                          <span className="ms-2">{ethers.utils.commify(round(drop.erc20MemberCost))}</span>
                        </Flex>
                      </Heading>
                    )}
                  </Box>
                )}

                {whitelistCost > 0 && (
                  <Box>
                    <Heading as="h6" size="sm" className="mb-1">Whitelist Price</Heading>
                    <Heading as="h5" size="md">
                      <Flex alignItems='center'>
                        <CronosIconBlue boxSize={5} />
                        <span className="ms-2">{ethers.utils.commify(round(whitelistCost))}</span>
                      </Flex>
                    </Heading>
                    {!!drop.erc20Token && !!drop.erc20WhitelistCost && drop.erc20Cost !== drop.erc20WhitelistCost && erc20Token && (
                      <Heading as="h5" size="md" mt={1}>
                        <Flex alignItems='center'>
                          <DynamicCurrencyIcon address={erc20Token.address} boxSize={6} />
                          <span className="ms-2">{ethers.utils.commify(round(drop.erc20WhitelistCost))}</span>
                        </Flex>
                      </Heading>
                    )}
                  </Box>
                )}

                {specialWhitelist && (
                  <Box>
                    <Heading as="h6" size="sm" className="mb-1">{specialWhitelist.name}</Heading>
                    <Heading as="h5" size="md">
                      <Flex alignItems='center'>
                        <CronosIconBlue boxSize={5} />
                        <span className="ms-2">{ethers.utils.commify(round(specialWhitelist.value))}</span>
                      </Flex>
                    </Heading>
                  </Box>
                )}
              </HStack>
            </Flex>
            {!!maxMintPerAddress && maxMintPerAddress < 20 && (
              <Text align="center" fontSize="sm" fontWeight="semibold" mt={4}>
                Limit: {maxMintPerAddress} per wallet
              </Text>
            )}
            {drop.collection === 'ryoshi-playing-cards' && drop.memberMitama > 0 && (
              <Text align="center" fontSize="sm" fontWeight="semibold" mt={4}>
                Users must have {commify(drop.memberMitama)} Mitama for Mitama price. Earn more by staking $Fortune in <Link href='/ryoshi' className='color'>Ryoshi Dynasties</Link>
              </Text>
            )}
            {(status === statuses.UNSET || status === statuses.NOT_STARTED || drop.complete) && (
              <Text align="center" fontSize="sm" fontWeight="semibold" mt={4}>
                Supply: {ethers.utils.commify(maxSupply.toString())}
              </Text>
            )}
            {status >= statuses.LIVE && !drop.complete && (
              <div>
                <div className="fs-6 fw-bold mb-1 mt-3 text-start text-md-end">
                  {percentage(totalSupply.toString(), maxSupply.toString())}% minted (
                  {ethers.utils.commify(totalSupply.toString())} / {ethers.utils.commify(maxSupply.toString())})
                </div>
                <Progress
                  size='xs'
                  value={percentage(totalSupply.toString(), maxSupply.toString())}
                  bg='white'
                />
              </div>
            )}

            {priceDescription && (
              <Text fontSize="sm" my={2} align="center">{priceDescription}</Text>
            )}

            {status === statuses.LIVE && !drop.complete && (
              <Box mt={2}>
                {canMintQuantity > 0 && (
                  <Stack direction={{base:'column', xl:'row'}} spacing={2}>
                    <HStack minW="150px">
                      <Button {...dec}>-</Button>
                      <Input {...input} />
                      <Button {...inc}>+</Button>
                    </HStack>
                    {(!!regularCost || drop.freeMint) && !drop.erc20Only && (!mintingWithType || mintingWithType === FundingType.NATIVE) && (
                      <PrimaryButton
                        w='full'
                        onClick={() => mintNow(FundingType.NATIVE)}
                        disabled={mintingWithType === FundingType.NATIVE}
                        isLoading={mintingWithType === FundingType.NATIVE}
                        loadingText='Minting...'
                      >
                        Mint
                      </PrimaryButton>
                    )}
                    {!!drop.erc20Cost && !!drop.erc20Token && (!mintingWithType || mintingWithType === FundingType.ERC20) && (
                      <PrimaryButton
                        w='full'
                        onClick={() => mintNow(FundingType.ERC20)}
                        disabled={mintingWithType === FundingType.ERC20}
                        isLoading={mintingWithType === FundingType.ERC20}
                        loadingText={`Minting with ${config.tokens[drop.erc20Token!].symbol}`}
                        whiteSpace='initial'
                      >
                        Mint with {config.tokens[drop.erc20Token!].symbol}
                      </PrimaryButton>
                    )}
                    {drop.collection === 'ryoshi-playing-cards' && (!mintingWithType || mintingWithType === FundingType.REWARDS) && (
                      <PrimaryButton
                        w='full'
                        onClick={() => mintNow(FundingType.REWARDS)}
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
                {canMintQuantity === 0 && !user.address && !drop.complete && (
                  <button className="btn-main lead w-100" onClick={connectWalletPressed}>
                    Connect Wallet
                  </button>
                )}
              </Box>
            )}
            {status === statuses.SOLD_OUT && <Text align="center" mt={2}>MINT HAS ENDED</Text>}
            {status === statuses.EXPIRED && <Text align="center" mt={2}>MINT HAS ENDED</Text>}

            {status === statuses.LIVE && !!drop.end && (
              <div className="me-4">
                <Heading as="h6" size="sm" className="mb-1">{status === statuses.EXPIRED ? <>Minting Ended</> : <>Minting Ends</>}</Heading>
                <Heading as="h3" size="md">{convertTime(drop.end)}</Heading>
              </div>
            )}
            {status === statuses.NOT_STARTED && !!drop.start && (
              <div className="mt-4 text-center">
                <Heading as="h6" size="sm" className="mb-1">Minting Starts</Heading>
                <Heading as="h3" size="md">
                  {new Date(drop.start).toDateString()}, {new Date(drop.start).toTimeString()}
                </Heading>
              </div>
            )}
            {status === statuses.NOT_STARTED && !drop.start && (
              <div className="me-4 mt-4 text-center">
                <Heading as="h6" size="sm" className="mb-1">Minting Starts</Heading>
                <Heading as="h3" size="md">TBA</Heading>
              </div>
            )}
          </>
        ) : (
          <Stack>
            <Skeleton height='20px' />
            <Skeleton height='20px' />
            <Skeleton height='20px' />
          </Stack>
        )}
      </div>
    </div>
  )
}
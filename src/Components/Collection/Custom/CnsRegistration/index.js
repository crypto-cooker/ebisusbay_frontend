import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {appConfig} from "@src/Config";
import {CNS, CNSNameAvailability, CNSPriceCurrency, constants} from "@cnsdomains/core";
import Button from "@src/Components/components/common/Button";
import {ethers} from "ethers";
import {devLog} from "@src/utils";
import {
  Alert,
  AlertIcon,
  Box, Collapse,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  Select,
  Skeleton,
  Text
} from "@chakra-ui/react";
import styled from 'styled-components';
import Link from "next/link";
import {useUser} from "@src/components-v2/useUser";

const config = appConfig();
const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
const readKit = new CNS(config.chain.id, readProvider);
const referral = 'ebisusbay.cro';

const StyledLink = styled.a`
  text-decoration: none !important;

  &:focus, &:hover, &:visited, &:link, &:active {
    text-decoration: none !important;
    color: inherit;
  }
`;

export const CnsRegistration = () => {
  const user = useUser();

  const [searchTerms, setSearchTerms] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  const [targetDomain, setTargetDomain] = useState(null);
  const [executingSearch, setExecutingSearch] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  // Manually create SVG component to preserve theme styles
  const SvgComponent = (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={181}
      height={50}
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

  const onSearch = async (terms) => {
    if (!terms) return;
    try {
      setExecutingSearch(true);
    } finally {
      const lcTerms = terms.toLowerCase();
      const domain = `${lcTerms}.cro`;
      const results = await readKit.register.isAvailable(domain);
      setTargetDomain(lcTerms);
      setSearchResult(results);
      setExecutingSearch(false);
    }
  };

  const domainName = () => {
    return `${targetDomain}.cro`;
  };

  const reset = ()  => {
    setRegistrationComplete(false);
    setSearchTerms(null);
    setTargetDomain(null);
    setSearchResult(null);
  }

  return (
    <div className="container-fluid mt-3" style={{maxWidth: 600}}>
      <div className="row mb-4 text-center">
        <StyledLink href={`https://www.cronos.domains`} target="_blank">
          <Box align="center">
            <SvgComponent />
          </Box>
        </StyledLink>
      </div>
      <div className="row">
        <div className="col mx-auto">
          {registrationComplete ? (
            <div className="text-center">
              <Heading as="h3" size="md" mb={4}>Registration Complete!</Heading>
              <span>
                {domainName()} has successfully been registered. To link your new domain to your Ebisu's Bay profile, first set it as a{' '}
                <span className="color fw-bold">
                  <a href={`https://www.cronos.domains/profile/${user.address}/settings`} target="_blank">
                    Primary CNS Name
                  </a>
                </span>
                , then sync it from your{' '}
                <span className="color fw-bold">
                  <Link href="/account/settings/profile">
                    Edit Account
                  </Link>
                </span>
                {' '}page
              </span>
              <Flex direction={{base:'column', sm:'row'}} justify="center" mt={4}>
                {user.address && (
                  <Box my="auto" className="color" fontWeight="bold">
                    <a href={`https://www.cronos.domains/profile/${user.address}/domains`} target="_blank">
                      Manage your domains
                    </a>
                  </Box>
                )}
                <Box ms={{base:0, sm:4}}>
                  <Button
                    type="legacy"
                    className="mx-auto mt-2"
                    onClick={reset}
                  >
                    Register another domain
                  </Button>
                </Box>
              </Flex>
            </div>
          ) : (
            <>
              <Heading as="h3" size="md" className="mb-2">Find Your Domain</Heading>
              <div className="d-flex justify-content-start">
                <Input
                  className="mb-0"
                  type="text"
                  placeholder="Search Domain Here"
                  onChange={(event) => setSearchTerms(event.target.value)}
                />
                <Button
                  type="legacy"
                  className="ms-2"
                  onClick={() => onSearch(searchTerms)}
                  isLoading={executingSearch}
                  disabled={executingSearch}
                >
                  Search
                </Button>
              </div>

              <div className="my-1">
                {searchResult === CNSNameAvailability.AVAIL && (
                  <Alert status="success">
                    <AlertIcon />
                    <Text as='span'>This name is available!</Text>
                    {!user.address && (
                      <Text as='span' ms={1}>Connect your wallet to register.</Text>
                    )}
                    <Text as='span' ms={1}>
                      <Link href={`https://www.cronos.domains/domains/${targetDomain}/register`} target="_blank">
                        Details
                      </Link>
                    </Text>
                  </Alert>
                )}
                {searchResult === CNSNameAvailability.NOT_AVAIL && (
                  <Alert status="danger">
                    <AlertIcon />
                    This name is not available
                  </Alert>
                )}
                {searchResult === CNSNameAvailability.INVALID && (
                  <Alert status="danger">
                    <AlertIcon />
                    Invalid
                  </Alert>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <Collapse in={searchResult === CNSNameAvailability.AVAIL && !!user.address}>
        <div>
          <Registration domain={targetDomain} readKit={readKit} onRegistrationComplete={() => setRegistrationComplete(true)}/>
        </div>
      </Collapse>
    </div>
  )
}

const registrationStage = {
  approval: 'Approving token for spending',
  commitment: 'Making commitment',
  registration: 'Registering domain',
};

const Registration = ({domain, readKit, onRegistrationComplete}) => {
  const user = useUser();
  const [error, setError] = useState(null);

  // Workflow
  const [executingWorkflow, setExecutingWorkflow] = useState(false);
  const [executingApproval, setExecutingApproval] = useState(false);
  const [executingCommitment, setExecutingCommitment] = useState(false);
  const [executingRegistration, setExecutingRegistration] = useState(false);
  const [executingCalculate, setExecutingCalculate] = useState(false);

  // Form Values
  const [registrationPeriod, setRegistrationPeriod] = useState(1);
  const [feeToken, setFeeToken] = useState(CNSPriceCurrency.USDC);
  const [registrationPrice, setRegistrationPrice] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);

  const delay = ms => new Promise(res => setTimeout(res, ms));

  const approveToken = async (token, duration) => {
    devLog('approveToken', domain, duration, referral, token);
    try {
      setExecutingApproval(true);
      const writeKit = new CNS(config.chain.id, user.provider.getSigner());
      const approveTx = await writeKit.register.approveFeeTransfer(
        domain,
        duration,
        referral,
        token,
      )
      if (approveTx) {
        const approveReceipt = await approveTx.wait()
      }
    } finally {
      setExecutingApproval(false);
    }
  };

  const registerDomain = async () => {
    const writeKit = new CNS(config.chain.id, user.provider.getSigner());
    const duration = constants.SECONDS_PER_YEAR.mul(registrationPeriod);

    try {
      setExecutingCommitment(true);
      const registerOpts = {
        duration,
        name: domain,
        owner: user.address,
        resolver: undefined,
        setReverseRecord: false,
      }

      devLog('makeCommitment', registerOpts, feeToken);
      const { commitment, tx, secret, beforeLives, untilDies } =
        await writeKit.register.makeCommitment(registerOpts, feeToken)

      if (tx) {
        const receipt = await tx.wait()
        devLog(`Commitment ${commitment} committed, txHash-${receipt.transactionHash}`)
      } else {
        devLog(`Commitment ${commitment} is already live, and will expires in ${untilDies}`)
      }

      setExecutingCommitment(false);
      setExecutingRegistration(true);

      await delay(20000);

      devLog('register', registerOpts, secret, referral, feeToken);
      const finalTx = await writeKit.register.register(
        registerOpts,
        secret,
        referral,
        feeToken
      )
      await finalTx.wait();
      onRegistrationComplete();
      devLog('finalTx', finalTx);
    } finally {
      setExecutingRegistration(false);
      setExecutingCommitment(false);
    }
  }

  const onRegister = async (name) => {
    if (!user.address) return;
    const duration = constants.SECONDS_PER_YEAR.mul(registrationPeriod);

    try {
      setExecutingWorkflow(true);
      const { balance, rentPrice, sufficient } = await readKit.register.checkUserBalance(
        domain,
        duration,
        user.address,
        true,
        referral,
        feeToken
      );

      if (!sufficient) {
        setError('Not enough funds');
        return;
      }

      await approveToken(feeToken, duration);
      await registerDomain();

    } catch (error) {
      console.log(error)
      setError(error.message)
    } finally {
      setExecutingWorkflow(false);
    }
  };

  const onSelectRegistrationPeriod = async (e) => {
    const {value} = e.target;
    setRegistrationPeriod(value);
  };

  const onSelectFeeToken = async (e) => {
    const {value} = e.target;
    setFeeToken(value);
  };

  const calculatePrice = async () => {
    try {
      setExecutingCalculate(true);

      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      });

      let registrationCost;
      if (!user.address) {
        const rentPrice = await readKit.register.rentPrice(
          domain,
          constants.SECONDS_PER_YEAR.mul(registrationPeriod),
          referral,
          feeToken
        );
        registrationCost = rentPrice.total;
      } else {
        const { balance, rentPrice, sufficient } = await readKit.register.checkUserBalance(
          domain,
          constants.SECONDS_PER_YEAR.mul(registrationPeriod),
          user.address,
          false,
          referral,
          feeToken
        );

        if (!sufficient) {
          setError('Not enough funds');
        }

        registrationCost = rentPrice;

        const walletBalance = Math.floor(ethers.utils.formatEther(balance) * 100) / 100;
        setWalletBalance({balance: formatter.format(walletBalance), sufficient: sufficient});
      }

      const price = Math.floor(ethers.utils.formatEther(registrationCost) * 100) / 100;
      setRegistrationPrice(formatter.format(price));
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setExecutingCalculate(false);
    }
  };

  useEffect(() => {
    setError(null);
    if (domain && (registrationPeriod || feeToken)) {
      calculatePrice();
    }
  }, [registrationPeriod, feeToken, domain, user.address]);

  return (
    <div className="row nftSaleForm">
      <div className="col">
        <FormControl isInvalid={!!error}>
          <div>
            <Heading as="h3" size="md">Register {domain}.cro</Heading>
            <hr />
            <Flex mt={2}>
              <span>Registration Period: </span>
              <Select
                aria-label="Choose Registration Period"
                onChange={onSelectRegistrationPeriod}
              >
                <option value="1">1 Year</option>
                <option value="2">2 Year</option>
                <option value="3">3 Year</option>
                <option value="4">4 Year</option>
                <option value="5">5 Year</option>
                <option value="10">10 Year</option>
              </Select>
            </Flex>
            <Flex mt={2}>
              <span>Fee Token: </span>
              <Select
                aria-label="Choose Fee Token"
                onChange={onSelectFeeToken}
              >
                <option value={CNSPriceCurrency.USDC}>USDC</option>
                <option value={CNSPriceCurrency.CNSUSD}>CNSUSD</option>
              </Select>
            </Flex>
            <div className="fee">
              <span className='label'>Registration Cost: </span>
              <Skeleton width="130px" isLoaded={!executingCalculate}>
                <Text align="right">{registrationPrice} {feeToken}</Text>
              </Skeleton>
            </div>
            {user.address && (
              <div className="fee">
                <span className='label'>Wallet Balance ({feeToken}): </span>
                <Skeleton width="130px" isLoaded={!executingCalculate}>
                  <Text align="right">{walletBalance?.balance} {feeToken}</Text>
                </Skeleton>
              </div>
            )}
          </div>
          <div className="d-flex justify-content-end">
            <div className="my-auto fst-italic" style={{fontSize: '13px'}}>
              {executingApproval && (
                <>{registrationStage.approval}</>
              )}
              {executingCommitment && (
                <>{registrationStage.commitment}</>
              )}
              {executingRegistration && (
                <>{registrationStage.registration}</>
              )}
            </div>
            {walletBalance?.sufficient && (
              <Button
                type="legacy"
                className="ms-2"
                onClick={() => onRegister(domain)}
                isLoading={executingWorkflow}
                disabled={executingWorkflow}
              >
                Register
              </Button>
            )}
          </div>
          <FormErrorMessage className="field-description textError">
            {error}
          </FormErrorMessage>
        </FormControl>
      </div>
    </div>
  )
}
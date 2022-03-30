import React, {useEffect, useState} from 'react';
import { Helmet } from 'react-helmet';
import Footer from '../components/Footer';
import {createSuccessfulTransactionToastContent} from 'src/utils';
import {FormControl, InputGroup, Spinner} from "react-bootstrap";
import {Contract, ethers} from "ethers";
import config from "../../Assets/networks/rpc_config.json";
import {
    getSlothty721NftsFromIds,
    getSlothty721NftsFromWallet
} from "../../core/api/chain";
import styled from "styled-components";
import RugsuranceAbi from '../../Contracts/SlothtyRugsurance.json';
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import MetaMaskOnboarding from "@metamask/onboarding";
import {chainConnect, connectAccount} from "../../GlobalState/User";
import {ERC721} from "../../Contracts/Abis";

const knownContracts = config.known_contracts;
const readProvider = new ethers.providers.JsonRpcProvider(config.read_rpc);

const GreyscaleImg = styled.img`
  -webkit-filter: grayscale(100%); /* Safari 6.0 - 9.0 */
  filter: grayscale(100%);
`;
const rugContractAddress = '0x99F3960E8219384BF0624D388cAD698d5A54AE6C';

const txExtras = {
  gasPrice: ethers.utils.parseUnits('5000', 'gwei'),
}


const Rugsurance = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [nfts, setNfts] = useState([]);
  const [nonRefundableNfts, setNonRefundableNfts] = useState([]);
  const [selectedNfts, setSelectedNfts] = useState([]);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const checkBurnList = async (address) => {
    const readContract = new Contract(rugContractAddress, RugsuranceAbi.abi, readProvider);

    try {
      const result = await readContract.getRefundInfo(address);
      return result.Ids.map((i) => i.toNumber());
    } catch (e) {
      return [];
    }
  }

  const connectWallet = async () => {
    if (!user.address) {
      if (user.needsOnboard) {
        const onboarding = new MetaMaskOnboarding();
        onboarding.startOnboarding();
      } else if (!user.address) {
        dispatch(connectAccount());
      } else if (!user.correctChain) {
        dispatch(chainConnect());
      }
    }
  };

  const calculateBurnEligibility = async () => {
      setNonRefundableNfts([]);
      setNfts([]);

      const slothtyAddress = knownContracts.find((c) => c.slug === '3d-slothty').address;
      try {
          const eligibleIds = await checkBurnList(user.address) ?? [];
          const nftsFromWallet = await getSlothty721NftsFromWallet(slothtyAddress, user.address);
          const nftsFromCsv = await getSlothty721NftsFromIds(slothtyAddress, eligibleIds);
          const allNfts = nftsFromWallet
            .map((n) => {
              // Will catch tokens that are in user wallet but not eligible ID list
              n.isEligible = eligibleIds.includes(n.id);
              if (!n.isEligible) {
                n.reason = "Airdrop or Not original owner"
              }

              return n;
            })
            .concat(nftsFromCsv.map((n) => {
              // Will catch tokens not in user wallet but in eligible ID list
              n.isEligible = nftsFromWallet.map(a => a.id).includes(n.id);
              if (!n.isEligible) {
                n.reason = "Must be present in your wallet"
              }

              return n;
            }))
            .filter((v,i,a)=>a.findIndex(v2=>(v2.id===v.id))===i)
            .sort((a, b) => (a.id > b.id ? 1 : -1));

          setNfts(allNfts.filter((n) => n.isEligible));
          setNonRefundableNfts(allNfts.filter((n) => !n.isEligible));
      } catch (error) {
        console.log(error);
      }
  }

  const selectNft = (nftId) => {
      let currentSelectedNfts;
      if (selectedNfts.includes(nftId)) {
          currentSelectedNfts = selectedNfts.filter((n) => n !== nftId);
      } else {
          currentSelectedNfts = [...selectedNfts, nftId];
      }
      setSelectedNfts(currentSelectedNfts);
  };

  const executeBurn = () => async () => {
    const writeContract = new Contract(rugContractAddress, RugsuranceAbi.abi, user.provider.getSigner());

    try {
        console.log('burning...', user.address, selectedNfts);
        const tx = await writeContract.claimRefund(user.address, selectedNfts);
        const receipt = await tx.wait();
        toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
    } catch (error) {
        if (error.data) {
            toast.error(error.data.message);
        } else if (error.message) {
            toast.error(error.message);
        } else {
            console.log(error);
            toast.error('Unknown Error');
        }
    }
  };

  const setApprovalForAll = async () => {
    const slothtyAddress = knownContracts.find((c) => c.slug === '3d-slothty').address;
    const slothtyContract = new Contract(slothtyAddress, ERC721, user.provider.getSigner());
    const isApproved = await slothtyContract.isApprovedForAll(user.address, rugContractAddress);
    if (!isApproved) {
      let tx = await slothtyContract.setApprovalForAll(rugContractAddress, true, txExtras);
      await tx.wait();
    }
  };

  const approve = async () => {
    try {
      await setApprovalForAll();
      setIsApproved(true);
    } catch (error) {
      if (error.data) {
        toast.error(error.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Unknown Error');
      }
    }
  }

  useEffect(async () => {
    if (!user.connectingWallet && user.membershipContract) {
      try {
        const slothtyAddress = knownContracts.find((c) => c.slug === '3d-slothty').address;
        const slothtyContract = new Contract(slothtyAddress, ERC721, user.provider.getSigner());
        const isApproved = await slothtyContract.isApprovedForAll(user.address, rugContractAddress);
        setIsApproved(isApproved);
      } catch (e) {
        console.log(e);
      } finally {
        setIsInitializing(false);
      }
    }
  }, [user.connectingWallet]);

  return (
    <div>
      <Helmet>
        <title>Slothty Rugsurance | Ebisu's Bay Marketplace</title>
        <meta name="description" content="Peace of mind minting on Ebisu's Bay Marketplace" />
        <meta name="title" content="Slothty Rugsurance | Ebisu's Bay Marketplace" />
        <meta property="og:title" content="Slothty Rugsurance | Ebisu's Bay Marketplace" />
        <meta property="og:url" content={`https://app.ebisusbay.com/slothty-rugsurance`} />
        <meta name="twitter:title" content="Slothty Rugsurance | Ebisu's Bay Marketplace" />
      </Helmet>
      <section className="jumbotron breadcumb no-bg tint">
        <div className="mainbreadcumb">
          <div className="container">
            <div className="row m-10-hor">
              <div className="col-12">
                <h1 className="text-center">Slothty Rugsurance</h1>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="container">
        <div className="row">
          <div className="col-lg-12">
            <p className="text-center">Slothty NFTs can only be refunded to the wallet they were originally minted from. Any unselectable NFTs below must be returned to the original wallet to process a refund.</p>
            {!isInitializing ? (
              <>
                {user.address ? (
                  <>
                    {isApproved && (
                      <ActionButton
                        title="Check My Eligibility"
                        workingTitle="Checking"
                        style="mx-auto"
                        onClick={() => calculateBurnEligibility()}
                      />
                    )}
                    {!isApproved && (
                      <>
                        <p className="text-center">Please approve the contract to proceed</p>
                        <ActionButton
                          title="Approve"
                          workingTitle="Approving"
                          style="mx-auto"
                          onClick={approve}
                        />
                      </>
                    )}
                  </>
                ) : (
                  <ActionButton
                    title="Connect Wallet"
                    workingTitle="Connecting"
                    style="mx-auto"
                    onClick={() => connectWallet()}
                  />
                )}
              </>
            ) : (
              <div className="text-center">
                <Spinner animation="border" role="status" className="ms-1">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            )}
          </div>
        </div>
        {nfts.length > 0 && (
          <>
            <div className="row">
              <div className="col">
                  <h3>Tokens Refundable</h3>
                  <p>{nfts.length} results found</p>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="card-group">
                  {nfts.map((nft, index) => (
                    <div key={index} className="d-item col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4 px-2">
                      <div className="card eb-nft__card h-100 shadow">
                          {nft.isEligible ? (
                              <img
                                  src={nft.image}
                                  className={`card-img-top`}
                                  alt={nft.name}
                              />
                          ) : (
                              <GreyscaleImg
                                  src={nft.image}
                                  className={`card-img-top`}
                                  alt={nft.name}
                              />
                          )}
                        <div className="card-body d-flex flex-column">
                          {!nft.isEligible && (
                            <span className="fw-bold" style={{color:'red', fontSize:'0.7rem'}}>{nft.reason.toUpperCase()}</span>
                          )}
                          <h6 className="card-title mt-auto">{nft.name}</h6>
                          {nft.isEligible ? (
                            <div className="nft__item_action">
                              <span style={{cursor:'pointer'}} onClick={() => selectNft(nft.id)}>
                                  {selectedNfts.includes(nft.id) ? (
                                      <>Unselect</>
                                  ) : (
                                      <>Select for Burn</>
                                  )}
                              </span>
                            </div>
                          ) : (
                            <span className="text-grey" style={{fontSize:'14px'}}>Cannot be selected for Burn</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
              <div className="row">
                  <div className="col d-flex flex-row justify-content-end">
                      <span className="my-auto fst-italic">{selectedNfts.length} selected</span>
                      <button className="btn-main lead mr15 ms-4 my-auto" onClick={() => setOpenConfirmationDialog(true)} disabled={selectedNfts < 1}>
                          Process Refund
                      </button>
                  </div>
              </div>
          </>
        )}
        {nonRefundableNfts.length > 0 && (
          <>
            <div className="row">
              <div className="col">
                <h3>Tokens NOT Refundable</h3>
                <p>{nonRefundableNfts.length} results found</p>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="card-group">
                  {nonRefundableNfts.map((nft, index) => (
                    <div key={index} className="d-item col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4 px-2">
                      <div className="card eb-nft__card h-100 shadow">
                        <GreyscaleImg
                          src={nft.image}
                          className={`card-img-top`}
                          alt={nft.name}
                        />
                        <div className="card-body d-flex flex-column">
                          <span className="fw-bold" style={{color:'red', fontSize:'0.7rem'}}>{nft.reason.toUpperCase()}</span>
                          <h6 className="card-title mt-auto">{nft.name}</h6>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </section>

      {openConfirmationDialog && (
        <div className="checkout">
            <div className="maincheckout">
                <button className="btn-close" onClick={() => setOpenConfirmationDialog(false)}>
                    x
                </button>
                <div className="heading">
                    <h3>Are you sure you want to burn Slothty?</h3>
                </div>
                <p>To burn and receive your refund, please follow the prompts in your</p>

                <ActionButton
                  title="Burn Slothty"
                  workingTitle="Burning Slothty"
                  onClick={executeBurn()}
                  onComplete={() => {setOpenConfirmationDialog(false)}}
                />
            </div>
        </div>
      )}

      <Footer />
    </div>
  );
};
export default Rugsurance;

const ActionButton = ({onClick, title, workingTitle, style, onComplete = null}) => {

  const [isWorking, setIsWorking] = useState(false);

  const doWork = async () => {
    setIsWorking(true);
    await onClick();
    setIsWorking(false);
    if (onComplete) {
      onComplete();
    }
  }

  return (
    <button className={`btn-main lead mb-5 ${style}`} onClick={doWork} disabled={isWorking}>
      {isWorking ? (
        <>
          {workingTitle}...
          <Spinner animation="border" role="status" size="sm" className="ms-1">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </>
      ) : (
        <>{title}</>
      )}
    </button>
  )
}
import React, {useCallback, useEffect, useState} from 'react';
import styled from 'styled-components';
import {specialImageTransform} from "@market/helpers/hacks";
import {AnyMedia} from "@src/components-v2/shared/media/any-media";
import {Contract, ethers} from "ethers";
import {getCollectionMetadata} from "@src/core/api";
import {toast} from "react-toastify";
import {ERC721} from "@src/global/contracts/Abis";
import {createSuccessfulTransactionToastContent, isBundle, isNftBlacklisted} from "@market/helpers/utils";
import {appConfig} from "@src/config";
import Select, {SingleValue} from "react-select";
import {getTheme} from "@src/global/theme/theme";
import {collectionRoyaltyPercent} from "@src/core/chain";
import {Box, BoxProps, Center, Flex, Spinner, Stack, Text, useBreakpointValue} from "@chakra-ui/react";
import {commify} from "ethers/lib/utils";
import ImagesContainer from "@src/Components/Bundle/ImagesContainer";
import {useQuery} from "@tanstack/react-query";
import {getNft} from "@src/core/api/endpoints/nft";
import ImageService from "@src/core/services/image";
import CronosIconBlue from "@src/components-v2/shared/icons/cronos-blue";
import NextApiService from "@src/core/services/api-service/next";
import {useContractService, useUser} from "@src/components-v2/useUser";
import {parseErrorMessage} from "@src/helpers/validator";
import {ResponsiveDialogComponents, useResponsiveDialog} from "@src/components-v2/foundation/responsive-dialog";
import WalletNft from "@src/core/models/wallet-nft";
import {PrimaryButton, SecondaryButton} from "@src/components-v2/foundation/button";

const config = appConfig();
const floorThreshold = 5;

type AcceptOfferDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  collection: any;
  isCollectionOffer: boolean;
  offer: any;
}

export const ResponsiveAcceptOfferDialog = ({ isOpen, collection, isCollectionOffer, offer, onClose, ...props }: AcceptOfferDialogProps & BoxProps) => {
  const { DialogComponent, DialogHeader, DialogBody, DialogFooter } = useResponsiveDialog();

  const title = () => {
    if (isCollectionOffer) return `Accept Collection Offer`;
    return `Accept Offer`;
  }

  return (
    <DialogComponent isOpen={isOpen} onClose={onClose} title={title()} {...props}>
      <DialogContent
        isOpen={isOpen}
        onClose={onClose}
        collection={collection}
        isCollectionOffer={isCollectionOffer}
        offer={offer}
        DialogHeader={DialogHeader}
        DialogBody={DialogBody}
        DialogFooter={DialogFooter}
        {...props}
      />
    </DialogComponent>
  );
};

const DialogContent = ({isOpen, onClose, collection, isCollectionOffer, offer, DialogBody, DialogFooter}: Pick<ResponsiveDialogComponents, 'DialogHeader' | 'DialogBody' | 'DialogFooter'> & AcceptOfferDialogProps) => {

  const [salePrice, setSalePrice] = useState<number>();
  const [floorPrice, setFloorPrice] = useState(0);
  const [fee, setFee] = useState(0);
  const [royalty, setRoyalty] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [isTransferApproved, setIsTransferApproved] = useState(false);
  const [executingApproval, setExecutingApproval] = useState(false);
  const [executingAcceptOffer, setExecutingAcceptOffer] = useState(false);

  const [showConfirmButton, setShowConfirmButton] = useState(false);

  // Collection Offer state
  const [collectionNfts, setCollectionNfts] = useState<WalletNft[]>([]);
  const [chosenCollectionNft, setChosenCollectionNft] = useState<WalletNft>();

  const user = useUser();
  const contractService = useContractService();
  const isMobile = useBreakpointValue({ base: true, sm: false }, { fallback: 'sm' });

  const isBelowFloorPrice = (price: number) => {
    return (floorPrice !== 0 && ((floorPrice - Number(price)) / floorPrice) * 100 > floorThreshold);
  };

  const getYouReceiveViewValue = () => {
    if (!salePrice) return 0;

    const youReceive = salePrice - (fee / 100) * salePrice - (royalty / 100) * salePrice;
    try {
      return ethers.utils.commify(youReceive.toFixed(2));
    } catch (e) {
      return youReceive
    }
  };

  const fetchNft = async () => {
    if (isCollectionOffer) return null;

    const tmpNft = await getNft(offer.nftAddress, offer.nftId);
    return tmpNft.nft;
  }

  const { error, data: nft, status } = useQuery({
    queryKey: ['AcceptOffer', user.address, offer.nftAddress, offer.nftId],
    queryFn: fetchNft,
    enabled: user.wallet.isConnected && !!offer.nftAddress && (isCollectionOffer || !!offer.nftId),
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    async function asyncFunc() {
      await getInitialProps();
    }
    if (contractService) {
      asyncFunc();
    }
  }, [nft, contractService]);

  const getInitialProps = async () => {
    try {
      setIsLoading(true);
      const nftAddress = offer.nftAddress;
      const marketContractAddress = config.contracts.market;
      const marketContract = contractService!.market;
      setSalePrice(offer ? Math.round(offer.price) : undefined)

      const floorPrice = await getCollectionMetadata(nftAddress);
      if (floorPrice.collections.length > 0) {
        setFloorPrice(floorPrice.collections[0].floorPrice ?? 0);
      }

      if (isCollectionOffer) {
        const walletNfts = await NextApiService.getWallet(user.address!, {pageSize: 100, collection:collection.address, sortBy: 'rank', direction: 'desc'});
        setCollectionNfts(walletNfts.data.filter((nft) => !isNftBlacklisted(nft.nftAddress, nft.nftId)));
        await chooseCollectionNft(walletNfts.data[0])
      } else {
        const royalties = await collectionRoyaltyPercent(nftAddress, offer.nftId);
        setRoyalty(royalties);
      }

      const fees = await marketContract.fee(user.address);
      setFee((fees / 10000) * 100);

      const contract = new Contract(nftAddress, ERC721, user.provider.getSigner());
      const transferEnabled = await contract.isApprovedForAll(user.address, marketContractAddress);

      if (transferEnabled) {
        setIsTransferApproved(true);
      } else {
        setIsTransferApproved(false);
      }

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast.error(parseErrorMessage(error));
    }
  };

  const handleApproval = async () => {
    try {
      const nftAddress = collection.address;
      const marketContractAddress = config.contracts.market;
      const contract = new Contract(nftAddress, ERC721, user.provider.getSigner());
      setExecutingApproval(true);
      const tx = await contract.setApprovalForAll(marketContractAddress, true);
      let receipt = await tx.wait();
      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      setIsTransferApproved(true);

    } catch (error) {
      console.log(error);
      toast.error(parseErrorMessage(error));
    } finally {
      setExecutingApproval(false);
    }
  };

  const handleAcceptOffer = async () => {
    try {
      setShowConfirmButton(false);
      setExecutingAcceptOffer(true);
      let tx;
      if (isCollectionOffer) {
        if (!chosenCollectionNft) throw new Error('Please choose an NFT');
        // Sentry.captureEvent({message: 'handleAcceptOffer', extra: {nftAddress, price}});
        tx = await contractService!.offer.acceptCollectionOffer(offer.nftAddress, offer.offerIndex, chosenCollectionNft.nftId);
      } else {
        const nftId = nft.id ?? nft.nftId;
        // Sentry.captureEvent({message: 'handleAcceptOffer', extra: {nftAddress, nftId, price}});
        tx = await contractService!.offer.acceptOffer(offer.hash, offer.offerIndex);
      }
      let receipt = await tx.wait();
      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      setExecutingAcceptOffer(false);
      onClose();
    } catch (error) {
      console.log(error);
      toast.error(parseErrorMessage(error));
    } finally {
      setExecutingAcceptOffer(false);
    }
  };

  const processAcceptOfferRequest = async () => {
    if (isBelowFloorPrice(salePrice ?? 0)) {
      setShowConfirmButton(true);
    } else {
      await handleAcceptOffer()
    }
  }

  const chooseCollectionNft = async (nft: WalletNft) => {
    setChosenCollectionNft(nft);
    const royalties = await collectionRoyaltyPercent(nft.nftAddress, nft.nftId);
    setRoyalty(royalties);
  }

  const Fees: React.FC = () => {
    return (
      <Box>
        <Box fontWeight='bold' fontSize='18px'>Fees</Box>
        <hr />
        <Flex justify='space-between' my={2}>
          <span>Service Fee: </span>
          <span>{fee} %</span>
        </Flex>
        <Flex justify='space-between' my={2}>
          <span>Royalty Fee: </span>
          <span>{royalty} %</span>
        </Flex>
        <Flex justify='space-between' my={2}>
          <span className='label'>You receive: </span>
          <span>{getYouReceiveViewValue()} CRO</span>
        </Flex>
      </Box>
    )
  }

  return (
    <>
      {status === 'pending' || isLoading ? (
        <Flex h='200px' justify='center'>
          <Center>
            <Spinner />
          </Center>
        </Flex>
      ) : status === "error" ? (
        <Box textAlign='center'>Error: {error.message}</Box>
      ) : (
        <>
          <DialogBody>
            {isMobile && (
              <Text mb={2} textAlign='center' fontWeight='bold'>
                {isCollectionOffer ? <>{collection.name}</> : <>{nft?.name}</>}
              </Text>
            )}
            <Stack direction={{base: 'column-reverse', sm: 'row'}} spacing={4} align={{base: 'center', sm: 'normal'}}>
              <Box w='full'>
                {!isMobile && (
                  <Text mb={2} textAlign='center' fontWeight='bold'>
                    {isCollectionOffer ? <>{collection.name}</> : <>{nft?.name}</>}
                  </Text>
                )}
                {isCollectionOffer ? (
                  <NftPicker
                    collectionAddress={collection.address}
                    nfts={collectionNfts}
                    initialNft={chosenCollectionNft}
                    onSelect={(n) => chooseCollectionNft(n)}
                  />
                ) : isBundle(nft.address ?? nft.nftAddress) ? (
                  <ImagesContainer nft={nft} />
                ) : (
                  <AnyMedia
                    image={specialImageTransform(nft.address ?? nft.nftAddress, nft.image)}
                    video={nft.video ?? nft.animation_url}
                    videoProps={{ height: 'auto', autoPlay: true }}
                    title={nft.name}
                    usePlaceholder={false}
                    className="img-fluid img-rounded"
                  />
                )}
              </Box>
              <Box w='full'>
                <Box mb={{base: 0, sm: 4}} mt={{base: 4, sm: 0}} textAlign='center'>
                  <Box>Offer Price</Box>
                  <Box fontSize='3xl' fontWeight='bold'>
                    <Flex justify='center' alignItems='center'>
                      <CronosIconBlue boxSize={10} />
                      <Box as='span' ms={1}>
                        {commify(offer.price)}
                      </Box>
                    </Flex>
                  </Box>
                </Box>

                {!isMobile && (
                  <Fees />
                )}
              </Box>
            </Stack>

            {isMobile && (
              <Box mt={4}>
                <Fees />
              </Box>
            )}
          </DialogBody>
          <DialogFooter className="border-0">
            <Box w='full'>
              {isTransferApproved ? (
                <>
                  {showConfirmButton ? (
                    <>
                      <div className="alert alert-danger my-auto mb-2 fw-bold text-center">
                        This offer is {(100 - ((salePrice ?? 0) * 100 / floorPrice)).toFixed(1)}% below the current floor price of {floorPrice} CRO. Are you sure?
                      </div>
                      {executingAcceptOffer && (
                        <div className="mb-2 text-center fst-italic">Please check your wallet for confirmation</div>
                      )}
                      <Flex>
                        <PrimaryButton
                          onClick={() => setShowConfirmButton(false)}
                          className="me-2 flex-fill"
                        >
                          Go Back
                        </PrimaryButton>
                        <SecondaryButton
                          onClick={handleAcceptOffer}
                          isLoading={executingAcceptOffer}
                          isDisabled={executingAcceptOffer}
                          className='flex-fill'
                        >
                          I understand, continue
                        </SecondaryButton>
                      </Flex>
                    </>
                  ) : (
                    <>
                      {executingAcceptOffer && (
                        <Box mb={2} textAlign='center'>
                          <Text as='i' fontSize='sm'>Please check your wallet for confirmation</Text>
                        </Box>
                      )}
                      <Flex>
                        <PrimaryButton
                          onClick={processAcceptOfferRequest}
                          isLoading={executingAcceptOffer}
                          isDisabled={(isCollectionOffer && !chosenCollectionNft) || executingAcceptOffer}
                          className='flex-fill'
                          loadingText='Accept Offer'
                        >
                          Accept Offer
                        </PrimaryButton>
                      </Flex>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Box mb={2} textAlign='center' className="mb-2 text-center fst-italic">
                    <Text as='i' fontSize='sm'>Ebisu's Bay needs approval to transfer this NFT on your behalf upon accepting</Text>
                  </Box>
                  <Flex>
                    <PrimaryButton
                      onClick={handleApproval}
                      isLoading={executingApproval}
                      isDisabled={executingApproval}
                      className='flex-fill'
                      loadingText='Approve'
                    >
                      Approve
                    </PrimaryButton>
                  </Flex>
                </>
              )}
            </Box>
          </DialogFooter>
        </>
      )}
    </>
  )
}



const ImageContainer = styled.div`
  height: auto;
  margin-top: 6px;
  text-align: center;

  img {
    width: 100%;
    border-radius: 6px;
  }

  @media only screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: auto;
    margin-bottom: 10px;
  }
`;

interface NftPickerProps {
  collectionAddress: string;
  nfts: WalletNft[];
  onSelect: (nft: WalletNft) => void;
  initialNft?: WalletNft;
}

const NftPicker = ({collectionAddress, nfts, onSelect, initialNft}: NftPickerProps) => {
  const {theme: userTheme} = useUser();
  const [chosenNft, setChosenNft] = useState<WalletNft | undefined>(initialNft);

  const handleNftChange = useCallback((chosenNft: SingleValue<WalletNft>) => {
    setChosenNft(chosenNft as WalletNft);
    onSelect(chosenNft as WalletNft);
  }, [chosenNft]);

  const customStyles = {
    option: (base: any, state: any) => ({
      ...base,
      background: getTheme(userTheme).colors.bgColor2,
      color: getTheme(userTheme).colors.textColor3,
      borderRadius: state.isFocused ? '0' : 0,
      '&:hover': {
        background: '#eee',
        color: '#000',
      },
    }),
    menu: (base: any) => ({
      ...base,
      borderRadius: 0,
      marginTop: 0,
    }),
    menuList: (base: any) => ({
      ...base,
      padding: 0,
    }),
    singleValue: (base: any, state: any) => ({
      ...base,
      background: getTheme(userTheme).colors.bgColor2,
      color: getTheme(userTheme).colors.textColor3
    }),
    control: (base: any, state: any) => ({
      ...base,
      background: getTheme(userTheme).colors.bgColor2,
      color: getTheme(userTheme).colors.textColor3,
      padding: 2,
    }),
    input: (base: any, state: any) => ({
      ...base,
      color: getTheme(userTheme).colors.textColor3,
      padding: 2,
    }),
    noOptionsMessage: (base: any, state: any) => ({
      ...base,
      background: getTheme(userTheme).colors.bgColor2,
      color: getTheme(userTheme).colors.textColor3,
    })
  };

  return (
    <>
      {!!chosenNft && (
        <>
          {isBundle(chosenNft.nftAddress) ? (
            <ImageContainer className="mx-auto">
              <img src={ImageService.translate('/img/logos/bundle.webp').fixedWidth(250, 250)} alt={chosenNft.name} />
            </ImageContainer>
          ) : (
            <ImageContainer className="mx-auto">
              <img src={specialImageTransform(collectionAddress, chosenNft.image)} alt={chosenNft.name} />
            </ImageContainer>
          )}
        </>
      )}
      <h3 className="feeTitle mt-2">Choose NFT</h3>
      <Select
        menuPlacement="top"
        maxMenuHeight={200}
        styles={customStyles}
        placeholder="Choose NFT"
        options={nfts.sort((a, b) => (a.name ?? a.nftId) > (b.name ?? b.nftId) ? 1 : -1)}
        getOptionLabel={(option) => option.name ?? option.nftId}
        getOptionValue={(option: any) => option}
        value={chosenNft}
        defaultValue={nfts[0]}
        onChange={handleNftChange}
      />
    </>
  );

}
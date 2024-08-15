import {
  Box,
  Button as ChakraButton,
  Center,
  CloseButton,
  Flex,
  Grid,
  GridItem,
  GridProps,
  Skeleton,
  Spacer,
  Text,
  useColorModeValue,
  VStack
} from "@chakra-ui/react";
import React, {useCallback, useEffect, useState} from "react";
import {AnyMedia} from "@src/components-v2/shared/media/any-media";
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {toast} from "react-toastify";
import {
  BatchExtras,
  clearCart,
  removeFromCart,
  setApproval,
  setExtras
} from "@market/state/redux/slices/ryoshi-staking-cart-slice";
import {Contract} from "ethers";
import {ERC721} from "@src/global/contracts/Abis";
import {appConfig} from "@src/config";
import {createSuccessfulTransactionToastContent, pluralize} from "@market/helpers/utils";
import {getCollectionMetadata} from "@src/core/api";
import {collectionRoyaltyPercent} from "@src/core/chain";
import {parseUnits} from "ethers/lib/utils";
import {useAppDispatch, useAppSelector} from "@market/state/redux/store/hooks";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import ImageService from "@src/core/services/image";
import {useContractService, useUser} from "@src/components-v2/useUser";
import * as Sentry from "@sentry/nextjs";
import {parseErrorMessage} from "@src/helpers/validator";

const config = appConfig();

interface BatchStakingDrawer {
  onClose: () => void;
}

export const BatchStakingDrawer = ({onClose, ...gridProps}: BatchStakingDrawer & GridProps) => {
  const dispatch = useAppDispatch();
  const ryoshiStakingCart = useAppSelector((state) => state.ryoshiStakingCart);
  const user = useUser();
  const contractService = useContractService();
  const [executingAction, setExecutingAction] = useState(false);
  const [showConfirmButton, setShowConfirmButton] = useState(false);

  const handleClose = () => {
    onClose();
  };
  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const executeAction = async () => {
    try {
      setExecutingAction(true);
      const filteredCartNfts = ryoshiStakingCart.nfts.filter((o) => {
        return ryoshiStakingCart.extras[o.nft.nftAddress.toLowerCase()]?.approval;
      });
      const nftAddresses = filteredCartNfts.map((o) => o.nft.nftId);

      const gasPrice = parseUnits('5000', 'gwei');
      let tx;
      if (ryoshiStakingCart.context === 'stake') {
        const gasEstimate = await contractService!.staking.estimateGas.stakeRyoshi(nftAddresses);
        const gasLimit = gasEstimate.mul(2);
        let extra = {
          gasPrice,
          gasLimit
        };
        tx = await contractService!.staking.stakeRyoshi(nftAddresses);
      } else {
        const gasEstimate = await contractService!.staking.estimateGas.unstakeRyoshi(nftAddresses);
        const gasLimit = gasEstimate.mul(2);
        let extra = {
          gasPrice,
          gasLimit
        };
        tx = await contractService!.staking.unstakeRyoshi(nftAddresses);
      }
      let receipt = await tx.wait();
      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      handleClearCart();
    } finally {
      setExecutingAction(false);
    }
  }

  const prepareListing = async () => {
    try {
      await executeAction();
    } catch (error: any) {
      Sentry.captureException(error);
      toast.error(parseErrorMessage(error));
    }
  }

  const canSubmit = () => {
    return !executingAction &&
      ryoshiStakingCart.nfts.length > 0 &&
      !Object.values(ryoshiStakingCart.extras).some((o) => !o.approval);
  }

  return (
    <Grid templateRows="80px 1fr auto" {...gridProps}>
      <GridItem px={6} py={4}>
        <Flex align="center">
          <Text fontSize="xl" fontWeight="semibold">
            Items to {ryoshiStakingCart.context === 'stake' ? 'stake' : 'unstake'}
          </Text>
          <Spacer />
          <CloseButton onClick={handleClose}/>
        </Flex>
      </GridItem>
      <GridItem px={6} py={4} overflowY="auto">
        <Flex mb={2}>
          <Text fontWeight="bold">{ryoshiStakingCart.nfts.length} {ryoshiStakingCart.nfts.length === 1 ? 'Item' : 'Items'}</Text>
          <Spacer />
          <Text fontWeight="bold" onClick={handleClearCart} cursor="pointer">Clear all</Text>
        </Flex>
        {ryoshiStakingCart.nfts.length > 0 ? (
          <>
            {ryoshiStakingCart.nfts.map((item, key) => (
              <BatchStakingDrawerItem
                item={item}
                disabled={executingAction}
              />
            ))}
          </>
        ) : (
          <Box py={8}>
            <Center>
              <Text className="text-muted">Add items to get started</Text>
            </Center>
          </Box>
        )}
      </GridItem>
      <GridItem px={6} py={4}>
        <PrimaryButton
          w='full'
          onClick={prepareListing}
          disabled={!canSubmit()}
          isLoading={executingAction}
          loadingText={ryoshiStakingCart.context === 'stake' ? 'Staking' : 'Unstaking'}
        >
          {ryoshiStakingCart.context === 'stake' ? 'Stake' : 'Unstake'} {pluralize(ryoshiStakingCart.nfts.length, 'NFT')}
        </PrimaryButton>
      </GridItem>
    </Grid>
  )
}

interface BatchStakingDrawerItemProps {
  item: any;
  disabled: boolean;
}

const BatchStakingDrawerItem = ({item, disabled}: BatchStakingDrawerItemProps) => {
  const dispatch = useAppDispatch();
  const user = useUser();
  const hoverBackground = useColorModeValue('gray.100', '#424242');

  // Approvals
  const extras = useAppSelector((state) => state.ryoshiStakingCart.extras[item.nft.nftAddress.toLowerCase()] ?? {});
  const approvalStatus = extras.approval;
  const [executingApproval, setExecutingApproval] = useState(false);

  const handleRemoveItem = () => {
    dispatch(removeFromCart(item.nft));
  };

  const checkApproval = async () => {
    if (!user.wallet.isConnected) return false;
    const contract = new Contract(item.nft.nftAddress, ERC721, user.provider.getSigner());
    return await contract.isApprovedForAll(user.address, config.contracts.stake);
  };

  const approveContract = useCallback(async () => {
    try {
      setExecutingApproval(true);
      const contract = new Contract(item.nft.nftAddress, ERC721, user.provider.getSigner());
      const tx = await contract.setApprovalForAll(config.contracts.stake, true);
      let receipt = await tx.wait();
      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      dispatch(setApproval({address: item.nft.nftAddress, status: true}));

    } catch (error: any) {
      if (error.data) {
        toast.error(error.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Unknown Error');
      }
      console.log(error);
    } finally {
      setExecutingApproval(false);
    }
  }, [item.nft, user.address, user.provider.signer]);

  useEffect(() => {
    async function func() {
      if (!extras[item.nft.nftAddress.toLowerCase() as keyof BatchExtras]) {
        const extras: BatchExtras = {address: item.nft.nftAddress, approval: false};

        extras.approval = await checkApproval();

        const metadata = await getCollectionMetadata(item.nft.nftAddress);
        if (metadata.collections.length > 0) {
          extras.floorPrice = metadata.collections[0].floorPrice;
        }

        extras.royalty = await collectionRoyaltyPercent(item.nft.nftAddress, item.nft.nftId);

        dispatch(setExtras(extras));
      }
    }
    func();
  }, []);

  return (
    <Box
      key={`${item.nft.nftAddress}-${item.nft.nftId}`}
      _hover={{background: hoverBackground}}
      p={2}
      rounded="lg"
    >
      <Flex>
        <Box
          width={50}
          height={50}
          style={{borderRadius: '20px'}}
        >
          <AnyMedia
            image={ImageService.translate(item.nft.image).avatar()}
            title={item.nft.name}
            usePlaceholder={false}
            className="img-rounded-8"
          />
        </Box>
        <Box flex='1' ms={2} fontSize="14px">
          <VStack align="left" spacing={0}>
            <Link href={`/collection/${item.nft.nftAddress}/${item.nft.nftId}`}>
              <Text fontWeight="bold" noOfLines={1} cursor="pointer">{item.nft.name}</Text>
            </Link>
            <Skeleton isLoaded={typeof approvalStatus === 'boolean'}>
              {approvalStatus ? (
                <>
                  {item.nft.rank && (
                    <Flex w="100%">
                      <Text>Rank</Text>
                      <Spacer/>
                      <Text fontWeight="bold">{item.nft.rank}</Text>
                    </Flex>
                  )}
                </>
              ) : (
                <ChakraButton
                  size='xs'
                  colorScheme='blue'
                  onClick={approveContract}
                  isLoading={executingApproval}
                  loadingText="Approving..."
                >
                  Approve Contract
                </ChakraButton>
              )}
            </Skeleton>
          </VStack>
        </Box>
        <Box ms={2} cursor="pointer" onClick={handleRemoveItem}>
          <FontAwesomeIcon icon={faTrash}/>
        </Box>
      </Flex>
    </Box>
  )
}
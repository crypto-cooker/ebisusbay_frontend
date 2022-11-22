import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button as ChakraButton,
  Center,
  CloseButton,
  Flex,
  Grid,
  GridItem,
  Skeleton,
  Spacer,
  Text,
  useColorModeValue,
  VStack
} from "@chakra-ui/react";
import Button from "@src/Components/components/Button";
import {Spinner} from "react-bootstrap";
import React, {useCallback, useEffect, useState} from "react";
import {AnyMedia} from "@src/Components/components/AnyMedia";
import {ImageKitService} from "@src/helpers/image";
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {clearCart, removeFromCart, setApproval, setExtras} from "@src/GlobalState/ryoshiStakingCartSlice";
import {Contract} from "ethers";
import {ERC721} from "@src/Contracts/Abis";
import {appConfig} from "@src/Config";
import {createSuccessfulTransactionToastContent, pluralize} from "@src/utils";
import {getCollectionMetadata} from "@src/core/api";
import {collectionRoyaltyPercent} from "@src/core/chain";
import {parseUnits} from "ethers/lib/utils";

const config = appConfig();

export const BatchStakingDrawer = ({onClose, ...gridProps}) => {
  const dispatch = useDispatch();
  const ryoshiStakingCart = useSelector((state) => state.ryoshiStakingCart);
  const user = useSelector((state) => state.user);
  const [executingAction, setExecutingAction] = useState(false);
  const [showConfirmButton, setShowConfirmButton] = useState(false);

  const handleClose = () => {
    setShowConfirmButton(false);
    onClose();
  };
  const handleClearCart = () => {
    setShowConfirmButton(false);
    dispatch(clearCart());
  };

  const executeAction = async () => {
    try {
      setExecutingAction(true);
      const filteredCartNfts = ryoshiStakingCart.nfts.filter((o) => {
        return ryoshiStakingCart.extras[o.nft.address.toLowerCase()]?.approval;
      });
      const nftAddresses = filteredCartNfts.map((o) => o.nft.id);

      const gasPrice = parseUnits('5000', 'gwei');
      let tx;
      if (ryoshiStakingCart.context === 'stake') {
        const gasEstimate = await user.contractService.staking.estimateGas.stakeRyoshi(nftAddresses);
        const gasLimit = gasEstimate.mul(2);
        let extra = {
          gasPrice,
          gasLimit
        };
        tx = await user.contractService.staking.stakeRyoshi(nftAddresses, extra);
      } else {
        const gasEstimate = await user.contractService.staking.estimateGas.unstakeRyoshi(nftAddresses);
        const gasLimit = gasEstimate.mul(2);
        let extra = {
          gasPrice,
          gasLimit
        };
        tx = await user.contractService.staking.unstakeRyoshi(nftAddresses, extra);
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
                disabled={showConfirmButton || executingAction}
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
        {showConfirmButton ? (
          <>
            {!executingAction && (
              <Alert status="error" mb={2}>
                <AlertIcon />
                <AlertDescription>Some items above are below their current floor price. Are you sure?</AlertDescription>
              </Alert>
            )}
            {executingAction && (
              <Text mb={2} fontStyle="italic" fontSize="sm" align="center">
                Please check your wallet for confirmation
              </Text>
            )}
            <Flex>
              <Button type="legacy"
                      onClick={() => setShowConfirmButton(false)}
                      disabled={executingAction}
                      className="me-2 flex-fill">
                Go Back
              </Button>
              <Button type="legacy-outlined"
                      onClick={executeAction}
                      isLoading={executingAction}
                      disabled={executingAction}
                      className="flex-fill">
                I understand, continue
              </Button>
            </Flex>
          </>
        ) : (
          <Button
            type="legacy"
            className="w-100"
            onClick={prepareListing}
            disabled={!canSubmit()}
          >
            {executingAction ? (
              <>
                Staking {pluralize(ryoshiStakingCart.nfts.length, 'NFT')}...
                <Spinner animation="border" role="status" size="sm" className="ms-1">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </>
            ) : (
              <>{ryoshiStakingCart.context === 'stake' ? 'Stake' : 'Unstake'} {pluralize(ryoshiStakingCart.nfts.length, 'NFT')}</>
            )}
          </Button>
        )}
      </GridItem>
    </Grid>
  )
}

const BatchStakingDrawerItem = ({item, disabled}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const hoverBackground = useColorModeValue('gray.100', '#424242');
  const [invalid, setInvalid] = useState(false);

  // Approvals
  const extras = useSelector((state) => state.ryoshiStakingCart.extras[item.nft.address.toLowerCase()] ?? {});
  const approvalStatus = extras.approval;
  const [executingApproval, setExecutingApproval] = useState(false);

  const handleRemoveItem = () => {
    dispatch(removeFromCart(item.nft));
  };

  const checkApproval = async () => {
    if (!user.provider) return false;
    const contract = new Contract(item.nft.address, ERC721, user.provider.getSigner());
    return await contract.isApprovedForAll(user.address, config.contracts.stake);
  };

  const approveContract = useCallback(async () => {
    try {
      setExecutingApproval(true);
      const contract = new Contract(item.nft.address, ERC721, user.provider.getSigner());
      const tx = await contract.setApprovalForAll(config.contracts.stake, true);
      let receipt = await tx.wait();
      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      dispatch(setApproval({address: item.nft.address, status: true}));

    } catch (error) {
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
  }, [item.nft, user]);

  useEffect(() => {
    async function func() {
      if (!extras[item.nft.address.toLowerCase()]) {
        const extras = {address: item.nft.address};

        extras.approval = await checkApproval();

        const metadata = await getCollectionMetadata(item.nft.address);
        if (metadata.collections.length > 0) {
          extras.floorPrice = metadata.collections[0].floorPrice;
        }

        extras.royalty = await collectionRoyaltyPercent(item.nft.address, item.nft.id);

        dispatch(setExtras(extras));
      }
    }
    func();
  }, []);

  return (
    <Box
      key={`${item.nft.address}-${item.nft.id}`}
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
            image={ImageKitService.buildAvatarUrl(item.nft.image)}
            title={item.nft.name}
            usePlaceholder={false}
            className="img-rounded-8"
          />
        </Box>
        <Box flex='1' ms={2} fontSize="14px">
          <VStack align="left" spacing={0}>
            <Link href={`/collection/${item.nft.address}/${item.nft.id}`}>
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
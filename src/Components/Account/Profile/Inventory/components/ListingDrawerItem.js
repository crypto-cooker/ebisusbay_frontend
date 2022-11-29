import {useDispatch, useSelector} from "react-redux";
import {
  Badge,
  Box, Collapse,
  Flex,
  FormControl, FormErrorMessage,
  Input,
  Menu,
  MenuButton, MenuItem, MenuList,
  Skeleton, Spacer,
  Stack,
  Text,
  useColorModeValue,
  VStack
} from "@chakra-ui/react";
import React, {useCallback, useEffect, useState} from "react";
import {removeFromBatchListingCart, setApproval, setExtras, updatePrice} from "@src/GlobalState/batchListingSlice";
import {Contract} from "ethers";
import {ERC721} from "@src/Contracts/Abis";
import {toast} from "react-toastify";
import {createSuccessfulTransactionToastContent} from "@src/utils";
import {getCollectionMetadata} from "@src/core/api";
import {collectionRoyaltyPercent} from "@src/core/chain";
import {AnyMedia} from "@src/Components/components/AnyMedia";
import {ImageKitService} from "@src/helpers/image";
import Link from "next/link";
import {Button as ChakraButton} from "@chakra-ui/button";
import {ChevronDownIcon, ChevronUpIcon} from "@chakra-ui/icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEllipsisH, faTrash} from "@fortawesome/free-solid-svg-icons";
import {appConfig} from "@src/Config";

const config = appConfig();
const numberRegexValidation = /^[1-9]+[0-9]*$/;

export const ListingDrawerItem = ({ item, onCascadePriceSelected, onApplyAllSelected, disabled }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const hoverBackground = useColorModeValue('gray.100', '#424242');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [price, setPrice] = useState('');
  const [invalid, setInvalid] = useState(false);

  // Approvals
  const extras = useSelector((state) => state.batchListing.extras[item.nft.address.toLowerCase()] ?? {});
  const { approval: approvalStatus, canList } = extras;
  const [executingApproval, setExecutingApproval] = useState(false);
  const [initializing, setInitializing] = useState(false);

  const handleRemoveItem = () => {
    dispatch(removeFromBatchListingCart(item.nft));
  };

  const handlePriceChange = useCallback((e) => {
    const newSalePrice = e.target.value;
    if (numberRegexValidation.test(newSalePrice) || newSalePrice === '') {
      setInvalid(false);
      dispatch(updatePrice({ nft: item.nft, price: newSalePrice }));
    } else {
      setInvalid(true);
    }
  }, [dispatch, item.nft, price]);

  useEffect(() => {
    setPrice(item.price);
  }, [item.price]);

  const checkApproval = async () => {
    const contract = new Contract(item.nft.address, ERC721, user.provider.getSigner());
    return await contract.isApprovedForAll(user.address, config.contracts.market);
  };

  const approveContract = useCallback(async () => {
    try {
      setExecutingApproval(true);
      const contract = new Contract(item.nft.address, ERC721, user.provider.getSigner());
      const tx = await contract.setApprovalForAll(config.contracts.market, true);
      let receipt = await tx.wait();
      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      dispatch(setApproval({ address: item.nft.address, status: true }));

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
      try {
        setInitializing(true);
        if (!extras[item.nft.address.toLowerCase()]) {
          const extras = { address: item.nft.address };

          extras.approval = await checkApproval();

          const metadata = await getCollectionMetadata(item.nft.address);
          if (metadata.collections.length > 0) {
            extras.floorPrice = metadata.collections[0].floorPrice;
          }

          extras.royalty = await collectionRoyaltyPercent(item.nft.address, item.nft.id);
          extras.canList = item.nft.listable && !item.nft.isStaked;

          dispatch(setExtras(extras));
        }
      } finally {
        setInitializing(false);
      }
    }
    func();
  }, []);

  return (
    <Box
      key={`${item.nft.address}-${item.nft.id}`}
      _hover={{ background: hoverBackground }}
      p={2}
      rounded="lg"
    >
      <Flex>
        <Box
          width={50}
          height={50}
          style={{ borderRadius: '20px' }}
        > 
        { item.nft.symbol && item.nft.symbol === 'Bundle'?(
          <AnyMedia
          image={ImageKitService.buildAvatarUrl(item.nft.nfts[0].image)}
          title={item.nft.name}
          usePlaceholder={false}
          className="img-rounded-8"
          />
        )
        :
          (<AnyMedia
            image={ImageKitService.buildAvatarUrl(item.nft.image)}
            title={item.nft.name}
            usePlaceholder={false}
            className="img-rounded-8"
          />)}
        </Box>
        <Box flex='1' ms={2} fontSize="14px">
          <VStack align="left" spacing={0}>
            <Link href={`/collection/${item.nft.address}/${item.nft.id}`}>
              <Text fontWeight="bold" noOfLines={1} cursor="pointer">{item.nft.name}</Text>
            </Link>
            <Skeleton isLoaded={!initializing}>
              {approvalStatus && canList ? (
                <FormControl isInvalid={invalid}>
                  <Stack direction="row">
                    <Input
                      placeholder="Enter Price"
                      type="numeric"
                      size="xs"
                      value={price}
                      onChange={handlePriceChange}
                      disabled={disabled}
                    />
                    <ChakraButton
                      size='xs'
                      transition='all 0.2s'
                      borderRadius='md'
                      borderWidth='1px'
                      onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                    >
                      {isDetailsOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    </ChakraButton>
                    <Menu>
                      <MenuButton
                        px={2}
                        transition='all 0.2s'
                        borderRadius='md'
                        borderWidth='1px'
                        height={6}
                      >
                        <FontAwesomeIcon icon={faEllipsisH} />
                      </MenuButton>
                      <MenuList textAlign="right">
                        <MenuItem onClick={() => onApplyAllSelected(price)}>Apply price to all</MenuItem>
                        <MenuItem onClick={() => onCascadePriceSelected(item, price)}>Cascade price</MenuItem>
                        <MenuItem onClick={handleRemoveItem}>Remove</MenuItem>
                      </MenuList>
                    </Menu>
                  </Stack>
                  <FormErrorMessage fontSize='xs' mt={1}>Enter a valid number.</FormErrorMessage>
                </FormControl>
              ) : !canList ? (
                <Box>
                  <Badge variant='outline' colorScheme='red'>
                    Not Listable
                  </Badge>
                </Box>
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
            <Collapse in={isDetailsOpen} animateOpacity>
              <VStack spacing={0} mt={1}>
                {item.nft.rank && (
                  <Flex w="100%">
                    <Text>Rank</Text>
                    <Spacer />
                    <Text fontWeight="bold">{item.nft.rank}</Text>
                  </Flex>
                )}
                <Flex w="100%">
                  <>
                    <Text>Floor</Text>
                    <Spacer />
                    <Text fontWeight="bold">{extras.floorPrice ?? 0} CRO</Text>
                  </>
                </Flex>
                <Flex w="100%">
                  <>
                    <Text>Royalty</Text>
                    <Spacer />
                    <Text fontWeight="bold">{extras.royalty ?? 'N/A'} %</Text>
                  </>
                </Flex>
              </VStack>
            </Collapse>
          </VStack>
        </Box>
        <Box ms={2} cursor="pointer" onClick={handleRemoveItem}>
          <FontAwesomeIcon icon={faTrash} />
        </Box>
      </Flex>
    </Box>
  )
}
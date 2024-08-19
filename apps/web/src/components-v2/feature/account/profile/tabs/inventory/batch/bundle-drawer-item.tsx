import {
  Badge,
  Box,
  Button,
  Button as ChakraButton,
  Collapse,
  Flex,
  FormControl,
  FormErrorMessage,
  HStack,
  Image,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  Spacer,
  Stack,
  Text,
  useColorModeValue,
  useNumberInput,
  VStack,
} from "@chakra-ui/react";

import React, {useCallback, useEffect, useState} from "react";
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEllipsisH, faTrash} from "@fortawesome/free-solid-svg-icons";
import {toast} from "react-toastify";
import {
  removeFromBatchListingCart,
  setApproval,
  setExtras,
  update1155Quantity,
  UserBatchExtras,
  UserBatchItem
} from "@market/state/redux/slices/user-batch";
import {Contract} from "ethers";
import {ERC721} from "@src/global/contracts/Abis";
import {appConfig} from "@src/config";
import {createSuccessfulTransactionToastContent, isBundle, isKoban} from "@market/helpers/utils";
import {MultimediaImage} from "@src/components-v2/shared/media/any-media";
import {specialImageTransform} from "@market/helpers/hacks";
import {useAppDispatch, useAppSelector} from "@market/state/redux/store/hooks";
import ImageService from "@src/core/services/image";
import {useUser} from "@src/components-v2/useUser";

const config = appConfig();
const numberRegexValidation = /^[1-9]+[0-9]*$/;

interface BundleDrawerItemProps {
  item: UserBatchItem;
  disabled: boolean;
  onAddCollection: (address: string) => void;
}

const BundleDrawerItem = ({ item, disabled, onAddCollection }: BundleDrawerItemProps) => {
  const dispatch = useAppDispatch();
  const user = useUser();
  const hoverBackground = useColorModeValue('gray.100', '#424242');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [invalid, setInvalid] = useState(false);

  // Approvals
  const extras = useAppSelector((state) => state.batchListing.extras[item.nft.nftAddress.toLowerCase()] ?? {});
  const { approval: approvalStatus, canList } = extras;
  
  const [executingApproval, setExecutingApproval] = useState(false);
  const [initializing, setInitializing] = useState(false);

  const handleRemoveItem = () => {
    dispatch(removeFromBatchListingCart(item.nft));
  };

  useEffect(() => {
    setQuantity(item.quantity.toString());
  }, [item.quantity]);

  const checkApproval = async () => {
    const contract = new Contract(item.nft.nftAddress, ERC721, user.provider.getSigner());
    return await contract.isApprovedForAll(user.address, config.contracts.market);
  };

  const approveContract = useCallback(async () => {
    try {
      setExecutingApproval(true);
      const contract = new Contract(item.nft.nftAddress, ERC721, user.provider.getSigner());
      const tx = await contract.setApprovalForAll(config.contracts.market, true);
      let receipt = await tx.wait();
      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      dispatch(setApproval({ address: item.nft.nftAddress, status: true }));

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
  }, [item.nft, user.address]);

  useEffect(() => {
    async function func() {
      try {
        setInitializing(true);
        const newExtras: UserBatchExtras = { address: item.nft.nftAddress, approval: false };

        newExtras.approval = await checkApproval();
        newExtras.canList = !item.nft.isStaked && !isKoban(item.nft.nftAddress, item.nft.nftId);

        dispatch(setExtras(newExtras));
      } finally {
        setInitializing(false);
      }
    }
    func();
  }, []);

  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      defaultValue: 1,
      min: 1,
      max: 10,
      precision: 0,
      isDisabled: disabled,
      onChange(valueAsString, valueAsNumber) {
        if (numberRegexValidation.test(valueAsString) || valueAsString === '') {
          setInvalid(false);
          dispatch(update1155Quantity({ nft: item.nft, quantity: valueAsNumber }));
        } else {
          setInvalid(true);
        }
      }
    })
  const inc = getIncrementButtonProps()
  const dec = getDecrementButtonProps()
  const input = getInputProps()

  return (
    <Box
      key={`${item.nft.nftAddress}-${item.nft.nftId}`}
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
          {isBundle(item.nft.nftAddress) ? (
            <Image
              src={ImageService.translate('/img/logos/bundle.webp').avatar()}
              alt={item.nft.name}
              rounded="md"
            />
          ) : (
            <MultimediaImage
              source={ImageService.translate(specialImageTransform(item.nft.nftAddress, item.nft.image)).fixedWidth(100, 100)}
              fallbackSource={ImageService.translate(ImageService.translate(item.nft.image).thumbnail()).fixedWidth(100, 100)}
              title={item.nft.name}
              className="img-fluid img-rounded-5"
            />
          )}
        </Box>
        <Box flex='1' ms={2} fontSize="14px">
          <VStack align="left" spacing={0}>
            <Link href={`/collection/${item.nft.chain}/${item.nft.nftAddress}/${item.nft.nftId}`}>
              <Text fontWeight="bold" noOfLines={1} cursor="pointer">{item.nft.name}</Text>
            </Link>
            <Skeleton isLoaded={!initializing}>
              {approvalStatus ? (
                <>
                  {isBundle(item.nft.nftAddress) ? (
                    <Box>
                      <Badge variant='outline' colorScheme='red'>
                        Can't Nest Bundles
                      </Badge>
                    </Box>
                  ) : (!canList) ? (
                    <Box>
                      <Badge variant='outline' colorScheme='red'>
                        Not Listable
                      </Badge>
                    </Box>
                  ) : (item.nft.multiToken) && (
                    <FormControl isInvalid={invalid}>
                      <Stack direction="row">
                        <HStack>
                          <Text>Qty:</Text>
                          <Button size="xs" {...dec}>-</Button>
                          <Input
                            placeholder="Enter Quantity"
                            size="xs"
                            {...input}
                          />
                          <Button size="xs" {...inc}>+</Button>
                        </HStack>
                      </Stack>
                      <FormErrorMessage fontSize='xs' mt={1}>Enter a valid number.</FormErrorMessage>
                    </FormControl>
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
        <Stack direction='row' ms={2} align="start">
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
            <MenuList textAlign="right" fontSize="14px">
              <MenuItem onClick={() => onAddCollection(item.nft.nftAddress)}>Add entire collection</MenuItem>
              <MenuItem onClick={handleRemoveItem}>Remove</MenuItem>
            </MenuList>
          </Menu>
          <Box ms={2} cursor="pointer" onClick={handleRemoveItem}>
            <FontAwesomeIcon icon={faTrash} />
          </Box>
        </Stack>
      </Flex>
    </Box>
  )
}

export default BundleDrawerItem;

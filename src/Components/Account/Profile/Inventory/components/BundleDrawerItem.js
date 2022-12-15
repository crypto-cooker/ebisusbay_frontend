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
  Skeleton,
  Spacer,
  Stack,
  Text,
  useColorModeValue,
  useNumberInput,
  VStack,
} from "@chakra-ui/react";

import React, {useCallback, useEffect, useState} from "react";
import {ImageKitService} from "@src/helpers/image";
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {
  removeFromBatchListingCart,
  setApproval,
  setExtras,
  update1155Quantity
} from "@src/GlobalState/batchListingSlice";
import {Contract} from "ethers";
import {ERC721} from "@src/Contracts/Abis";
import {appConfig} from "@src/Config";
import {createSuccessfulTransactionToastContent, isBundle} from "@src/utils";
import {AnyMedia} from "@src/Components/components/AnyMedia";
import {specialImageTransform} from "@src/hacks";

const config = appConfig();
const numberRegexValidation = /^[1-9]+[0-9]*$/;

const BundleDrawerItem = ({ item, disabled }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const hoverBackground = useColorModeValue('gray.100', '#424242');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [invalid, setInvalid] = useState(false);

  // Approvals
  const extras = useSelector((state) => state.batchListing.extras[item.nft.address.toLowerCase()] ?? {});
  const { approval: approvalStatus, canList } = extras;
  const [executingApproval, setExecutingApproval] = useState(false);
  const [initializing, setInitializing] = useState(false);

  const handleRemoveItem = () => {
    dispatch(removeFromBatchListingCart(item.nft));
  };

  useEffect(() => {
    setQuantity(item.quantity);
  }, [item.quantity]);

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
          extras.canList = !item.nft.isStaked;

          dispatch(setExtras(extras));
        }
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
        const newQuantity = valueAsNumber;
        if (numberRegexValidation.test(newQuantity) || newQuantity === '') {
          setInvalid(false);
          dispatch(update1155Quantity({ nft: item.nft, quantity: newQuantity }));
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
          {isBundle(item.nft.address) ? (
            <Image
              src={ImageKitService.buildAvatarUrl('/img/logos/bundle.webp')}
              alt={item.nft.name}
              rounded="md"
            />
          ) : (
            <AnyMedia
              image={specialImageTransform(item.nft.address, ImageKitService.buildAvatarUrl(item.nft.image))}
              title={item.nft.name}
              usePlaceholder={true}
              className="img-fluid img-rounded-5"
            />
          )}
        </Box>
        <Box flex='1' ms={2} fontSize="14px">
          <VStack align="left" spacing={0}>
            <Link href={`/collection/${item.nft.address}/${item.nft.id}`}>
              <Text fontWeight="bold" noOfLines={1} cursor="pointer">{item.nft.name}</Text>
            </Link>
            <Skeleton isLoaded={!initializing}>
              {approvalStatus ? (
                <>
                  {isBundle(item.nft.address) ? (
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
        <Box ms={2} cursor="pointer" onClick={handleRemoveItem}>
          <FontAwesomeIcon icon={faTrash} />
        </Box>
      </Flex>
    </Box>
  )
}

export default BundleDrawerItem;

import {
  Badge,
  Box,
  Button as ChakraButton,
  Flex,
  FormControl,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Skeleton,
  Stack,
  Text,
  useColorModeValue,
  VStack
} from "@chakra-ui/react";
import React, {useCallback, useEffect, useState} from "react";
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
import {toast} from "react-toastify";
import {createSuccessfulTransactionToastContent, isBundle} from "@market/helpers/utils";
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEllipsisH, faTrash} from "@fortawesome/free-solid-svg-icons";
import {appConfig} from "@src/config";
import {MultimediaImage} from "@src/components-v2/shared/media/any-media";
import {specialImageTransform} from "@market/helpers/hacks";
import {useAppDispatch, useAppSelector} from "@market/state/redux/store/hooks";
import ImageService from "@src/core/services/image";
import {useUser} from "@src/components-v2/useUser";

const config = appConfig();
const numberRegexValidation = /^[1-9]+[0-9]*$/;

interface TransferDrawerItemProps {
  item: UserBatchItem;
  onAddCollection: (address: string) => void;
}

const TransferDrawerItem = ({ item, onAddCollection }: TransferDrawerItemProps) => {
  const dispatch = useAppDispatch();
  const user = useUser();
  const hoverBackground = useColorModeValue('gray.100', '#424242');

  // Approvals
  const extras: UserBatchExtras = useAppSelector((state) => state.batchListing.extras[item.nft.nftAddress.toLowerCase()] ?? {});
  const { approval: approvalStatus, canTransfer} = extras;
  const [executingApproval, setExecutingApproval] = useState(false);
  const [initializing, setInitializing] = useState(false);

  // Form values
  const [invalid, setInvalid] = useState<string | boolean>(false);
  const [quantity, setQuantity] = useState('1');

  const handleRemoveItem = () => {
    dispatch(removeFromBatchListingCart(item.nft));
  };

  const handleQuantityChange = useCallback((newQuantity: string) => {
    if (!numberRegexValidation.test(newQuantity)) {
      setInvalid('quantity');
      return;
    } else if (item.nft.balance && Number(newQuantity) > Number(item.nft.balance)) {
      setInvalid('quantity');
      return;
    }
    setInvalid(false);
    dispatch(update1155Quantity({ nft: item.nft, quantity: Number(newQuantity || 1) }));
  }, [dispatch, item.nft, quantity]);

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
      setInitializing(true);
      try {
        const newExtras: UserBatchExtras = { address: item.nft.nftAddress, approval: false };

        newExtras.approval = await checkApproval();
        newExtras.canTransfer = !item.nft.isStaked;

        dispatch(setExtras(newExtras));
      } finally {
        setInitializing(false);
      }
    }
    func();
  }, []);

  useEffect(() => {
    setQuantity(item.quantity?.toString() ?? '');
  }, [item.quantity]);

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
              {approvalStatus && canTransfer ? (
                <FormControl isInvalid={invalid === 'quantity'} mt={1}>
                  {item.nft.balance && item.nft.balance > 1 && (
                    <Box fontSize='xs'>
                      <Box>Qty</Box>
                      <NumberInput
                        size="xs"
                        value={quantity}
                        min={1}
                        max={item.nft.balance ?? 1}
                        step={1}
                        maxW='100px'
                        onChange={(valueString) => handleQuantityChange(valueString)}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </Box>
                  )}
                </FormControl>
              ) : !canTransfer ? (
                <Box>
                  <Badge variant='outline' colorScheme='red'>
                    Staked, Cannot Transfer
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

export default TransferDrawerItem;
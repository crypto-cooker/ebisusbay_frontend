import {useDispatch} from "react-redux";
import {
  Badge,
  Box,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
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
  UserBatchExtras,
  UserBatchItem
} from "@src/GlobalState/user-batch";
import {Contract} from "ethers";
import {ERC721} from "@src/Contracts/Abis";
import {toast} from "react-toastify";
import {createSuccessfulTransactionToastContent, isBundle} from "@src/utils";
import {ImageKitService} from "@src/helpers/image";
import Link from "next/link";
import {Button as ChakraButton} from "@chakra-ui/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEllipsisH, faTrash} from "@fortawesome/free-solid-svg-icons";
import {appConfig} from "@src/Config";
import {AnyMedia} from "@src/Components/components/AnyMedia";
import {specialImageTransform} from "@src/hacks";
import {useAppSelector} from "@src/Store/hooks";

const config = appConfig();

interface TransferDrawerItemProps {
  item: UserBatchItem;
  onAddCollection: (address: string) => void;
}

const TransferDrawerItem = ({ item, onAddCollection }: TransferDrawerItemProps) => {
  const dispatch = useDispatch();
  const user = useAppSelector((state) => state.user);
  const hoverBackground = useColorModeValue('gray.100', '#424242');

  // Approvals
  const extras: UserBatchExtras = useAppSelector((state) => state.batchListing.extras[item.nft.nftAddress.toLowerCase()] ?? {});
  const { approval: approvalStatus, canTransfer} = extras;
  const [executingApproval, setExecutingApproval] = useState(false);
  const [initializing, setInitializing] = useState(false);

  const handleRemoveItem = () => {
    dispatch(removeFromBatchListingCart(item.nft));
  };

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
  }, [item.nft, user]);

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
              src={ImageKitService.buildAvatarUrl('/img/logos/bundle.webp')}
              alt={item.nft.name}
              rounded="md"
            />
          ) : (
            <AnyMedia
              image={specialImageTransform(item.nft.nftAddress, ImageKitService.buildAvatarUrl(item.nft.image))}
              video={null}
              title={item.nft.name}
              usePlaceholder={true}
              className="img-fluid img-rounded-5"
            />
          )}
        </Box>
        <Box flex='1' ms={2} fontSize="14px">
          <VStack align="left" spacing={0}>
            <Link href={`/collection/${item.nft.nftAddress}/${item.nft.nftId}`}>
              <Text fontWeight="bold" noOfLines={1} cursor="pointer">{item.nft.name}</Text>
            </Link>
            <Skeleton isLoaded={!initializing}>
              {approvalStatus && canTransfer ? (
                <></>
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
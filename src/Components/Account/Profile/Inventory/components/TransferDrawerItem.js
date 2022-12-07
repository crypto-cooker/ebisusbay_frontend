import {useDispatch, useSelector} from "react-redux";
import {
  Badge,
  Box, Collapse,
  Flex,
  FormControl, FormErrorMessage, Image,
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
import {createSuccessfulTransactionToastContent, isBundle} from "@src/utils";
import {getCollectionMetadata} from "@src/core/api";
import {collectionRoyaltyPercent} from "@src/core/chain";
import {AnyMedia} from "@src/Components/components/AnyMedia";
import {ImageKitService} from "@src/helpers/image";
import Link from "next/link";
import {Button as ChakraButton} from "@chakra-ui/button";
import {ChevronDownIcon, ChevronUpIcon} from "@chakra-ui/icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBoxOpen, faEllipsisH, faTrash} from "@fortawesome/free-solid-svg-icons";
import {appConfig} from "@src/Config";

const config = appConfig();

export const TransferDrawerItem = ({ item }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const hoverBackground = useColorModeValue('gray.100', '#424242');

  // Approvals
  const extras = useSelector((state) => state.batchListing.extras[item.nft.address.toLowerCase()] ?? {});
  const { approval: approvalStatus, canTransfer} = extras;
  const [executingApproval, setExecutingApproval] = useState(false);
  const [initializing, setInitializing] = useState(false);

  const handleRemoveItem = () => {
    dispatch(removeFromBatchListingCart(item.nft));
  };

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
      setInitializing(true);
      try {
        if (!extras[item.nft.address.toLowerCase()]) {
          const extras = { address: item.nft.address };

          extras.approval = await checkApproval();
          extras.canTransfer = !item.nft.isStaked;

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
          {isBundle(item.nft.address) ? (
            <FontAwesomeIcon icon={faBoxOpen} size="2x"/>
          ) : (
            <Image
              src={ImageKitService.buildAvatarUrl(item.nft.image)}
              alt={item.nft.name}
              rounded="md"
            />
          )}
        </Box>
        <Box flex='1' ms={2} fontSize="14px">
          <VStack align="left" spacing={0}>
            <Link href={`/collection/${item.nft.address}/${item.nft.id}`}>
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
        <Box ms={2} cursor="pointer" onClick={handleRemoveItem}>
          <FontAwesomeIcon icon={faTrash} />
        </Box>
      </Flex>
    </Box>
  )
}
import {
  Box,
  Button as ChakraButton,
  Collapse,
  Flex, 
  Skeleton,
  Spacer,
  Stack,
  Text,
  useColorModeValue,
  VStack,

} from "@chakra-ui/react";

import React, { useCallback, useEffect, useState } from "react";
import { AnyMedia } from "@src/Components/components/AnyMedia";
import { ImageKitService } from "@src/helpers/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  removeFromBatchListingCart,
  updatePrice,
  setApprovalBundle,
  setExtrasBundle
} from "@src/GlobalState/batchListingSlice";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Contract, ethers } from "ethers";
import { ERC721 } from "@src/Contracts/Abis";
import { appConfig } from "@src/Config";
import { caseInsensitiveCompare, createSuccessfulTransactionToastContent } from "@src/utils";

import { getCollectionMetadata } from "@src/core/api";
import { collectionRoyaltyPercent } from "@src/core/chain";

const config = appConfig();
const numberRegexValidation = /^[1-9]+[0-9]*$/;

const BundleDrawerItem = ({ item, onCascadePriceSelected, onApplyAllSelected, disabled }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const hoverBackground = useColorModeValue('gray.100', '#424242');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [price, setPrice] = useState('');
  const [invalid, setInvalid] = useState(false);

  // Approvals
  const extras = useSelector((state) => state.batchListing.extrasBundle[item.nft.address.toLowerCase()] ?? {});
  const approvalStatus = extras.approval;
  const [executingApproval, setExecutingApproval] = useState(false);

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
    return await contract.isApprovedForAll(user.address, config.contracts.bundle);
  };

  const approveContract = useCallback(async () => {
    try {
      setExecutingApproval(true);
      const contract = new Contract(item.nft.address, ERC721, user.provider.getSigner());
      const tx = await contract.setApprovalForAll(config.contracts.bundle, true);
      let receipt = await tx.wait();
      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      dispatch(setApprovalBundle({ address: item.nft.address, status: true }));

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
        const extrasBundle = { address: item.nft.address };

        extrasBundle.approval = await checkApproval();

        const metadata = await getCollectionMetadata(item.nft.address);
        if (metadata.collections.length > 0) {
          extrasBundle.floorPrice = metadata.collections[0].floorPrice;
        }

        extrasBundle.royalty = await collectionRoyaltyPercent(item.nft.address, item.nft.id);

        dispatch(setExtrasBundle(extrasBundle));
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
                <></>
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

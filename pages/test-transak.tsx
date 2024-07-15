import {useMemo, useState} from "react";
import {Contract, ethers} from "ethers";
import {Box, Button, HStack, Input, SimpleGrid, Stack, Text, Textarea, useClipboard, VStack} from "@chakra-ui/react";
import {toast} from "react-toastify";
import {appConfig} from "@src/Config";
import {ERC721} from "@src/global/contracts/Abis";
import {parseErrorMessage} from "@src/helpers/validator";
import {useUser} from "@src/components-v2/useUser";
import {useQuery} from "@tanstack/react-query";
import {ApiService} from "@src/core/services/api-service";
import {ciEquals, shortAddress} from "@market/helpers/utils";
import {getServerSignature} from "@src/core/cms/endpoints/gaslessListing";
import {PrimaryButton} from "@src/components-v2/foundation/button";

const readProvider = new ethers.providers.JsonRpcProvider(appConfig().rpc.read);
const ShipAbi = [
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "offerer",
            "type": "address"
          },
          {
            "components": [
              {
                "internalType": "enum TradeshipCrates.ItemType",
                "name": "itemType",
                "type": "uint8"
              },
              {
                "internalType": "address",
                "name": "token",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "identifierOrCriteria",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "startAmount",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "endAmount",
                "type": "uint256"
              }
            ],
            "internalType": "struct TradeshipCrates.OfferItem[]",
            "name": "offerings",
            "type": "tuple[]"
          },
          {
            "components": [
              {
                "internalType": "enum TradeshipCrates.ItemType",
                "name": "itemType",
                "type": "uint8"
              },
              {
                "internalType": "address",
                "name": "token",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "identifierOrCriteria",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "startAmount",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "endAmount",
                "type": "uint256"
              }
            ],
            "internalType": "struct TradeshipCrates.OfferItem[]",
            "name": "considerations",
            "type": "tuple[]"
          },
          {
            "internalType": "enum TradeshipCrates.OrderType",
            "name": "orderType",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "startAt",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "endAt",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "salt",
            "type": "uint256"
          }
        ],
        "internalType": "struct TradeshipCrates.Order[]",
        "name": "_orders",
        "type": "tuple[]"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "expire",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "feeAmount",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "feeToken",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "filler",
            "type": "address"
          },
          {
            "internalType": "bytes[]",
            "name": "sigs",
            "type": "bytes[]"
          }
        ],
        "internalType": "struct TradeshipCrates.Approval",
        "name": "_approval",
        "type": "tuple"
      },
      {
        "internalType": "bytes",
        "name": "_serverSig",
        "type": "bytes"
      }
    ],
    "name": "fillOrders",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

function Test() {
  return (
    <Box m={4}>
      <VStack align='start'>
        <Transak />
      </VStack>
    </Box>
  )
}

export default Test;

const Transak = () => {
  const user = useUser();
  const [isExecuting, setIsExecuting] = useState(false);
  const [callData, setCallData] = useState<string | number>();
  const [selectedListings, setSelectedListings] = useState<any[]>([]);
  const { onCopy, value, setValue, hasCopied } = useClipboard('');
  const { onCopy: onCopyCroValue, setValue: setCroValue, hasCopied: hasCopiedCroValue } = useClipboard('');
  const [croPaymentValue, setCroPaymentValue] = useState<string>('');

  const {data} = useQuery({
    queryKey: ['transakGetListings'],
    queryFn: async () => {
      return ApiService.withoutKey().getListings({
        sortBy: 'listingTime',
        direction: 'desc',
    });
  }});

  const handleToggleListing = (listing: any) => {
    if (selectedListings?.findIndex((l) => l.listingId === listing.listingId) !== -1) {
      setSelectedListings(selectedListings?.filter((l) => l.listingId !== listing.listingId));
    } else {
      setSelectedListings([...selectedListings, listing]);
    }
  }

  const handleGenerateCallData = async () => {
    if (!user.address) {
      toast.error('Please connect your wallet to continue');
      return;
    }

    const contract = new Contract(
      '0x4F410976c6687193dDC0da9C4F3ca1Dfd0ba0209',
      ERC721,
      readProvider
    )

    try {
      setIsExecuting(true);

      const croTotal = selectedListings
        .filter((purchase) => !purchase.currency || purchase.currency === ethers.constants.AddressZero)
        .reduce((acc, curr) => acc + Number(curr.price), 0);
      const price = ethers.utils.parseEther(`${croTotal}`);
      const { data: serverSig } = await getServerSignature(
        user.address,
        selectedListings.map((purchase) => purchase.listingId),
        recipientAddress
      );
      const { signature, orderData, ...sigData } = serverSig;
      const total = price.add(sigData.feeAmount);

      let iface = new ethers.utils.Interface(ShipAbi);
      const rawCallData = iface.encodeFunctionData('fillOrders', [
        orderData,
        sigData,
        signature
      ]);
      setValue(rawCallData);
      setCallData(rawCallData);
      setCroPaymentValue(total.toString());
      setCroValue(total.toString());
    } catch (e: any) {
      console.log(e);
      toast.error(parseErrorMessage(e));
    } finally {
      setIsExecuting(false);
    }
  }

  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const handleRecipientAddressChange = (e: any) => {
    setRecipientAddress(e.target.value);
  }

  return (
    <Box>
      <Box>
        <Stack direction={{base: 'column', md: 'row'}}>
          <Box>
            <Text fontSize='lg' fontWeight='bold'>Available FRTN listings</Text>
            <SimpleGrid columns={2} gap={2} h='500px' overflowY='scroll'>
              {data && data.data.filter((listing: any) => listing.price === '10' && ciEquals(listing.currency, '0x119adb5e05e85d55690bc4da7b37c06bfecf2071')).map((listing: any) => (
                <ListingBox
                  key={listing.id}
                  listing={listing}
                  symbol='FRTN'
                  isSelected={selectedListings?.findIndex((l) => l.listingId === listing.listingId) !== -1}
                  onToggle={() => handleToggleListing(listing)}
                />
              ))}
            </SimpleGrid>
          </Box>
          <Box>
            <Text fontSize='lg' fontWeight='bold'>Available CRO listings</Text>
            <SimpleGrid columns={2} gap={2} h='500px' overflowY='scroll'>
              {data && data.data.filter((listing: any) => listing.price === '10' && ciEquals(listing.currency, ethers.constants.AddressZero)).map((listing: any) => (
                <ListingBox
                  key={listing.id}
                  listing={listing}
                  symbol='CRO'
                  isSelected={selectedListings?.findIndex((l) => l.listingId === listing.listingId) !== -1}
                  onToggle={() => handleToggleListing(listing)}
                />
              ))}
            </SimpleGrid>
          </Box>
        </Stack>
      </Box>
      <Input
        mt={4}
        placeholder='Enter a recipient address'
        value={recipientAddress}
        onChange={handleRecipientAddressChange}
      />
      <PrimaryButton
        mt={4}
        isLoading={isExecuting}
        isDisabled={isExecuting}
        onClick={handleGenerateCallData}
        loadingText='Generating...'
      >
        Generate Call Data
      </PrimaryButton>
      {!!callData && (
        <VStack mt={2} align='start'>
          <Text fontSize='lg' fontWeight='bold'>Call Data:</Text>
          <Box onClick={onCopyCroValue} cursor='pointer'>Value: {croPaymentValue.toString()}</Box>
          <Button onClick={onCopy}>{hasCopied ? "Copied!" : "Copy Call Data"}</Button>
          <Textarea mt={2} rows={5}>
            {callData}
          </Textarea>
        </VStack>
      )}
    </Box>
  )
}

interface ListingBoxProps {
  listing: any;
  symbol: string;
  isSelected: boolean;
  onToggle: (listing: any) => void;
}

const ListingBox = ({listing, symbol, isSelected, onToggle}: ListingBoxProps) => {
  const { onCopy, value, setValue, hasCopied } = useClipboard(listing.nftAddress);
  const currencyForListing = useMemo(() => {
    if (listing.currency === ethers.constants.AddressZero) {
      return 'CRO';
    } else if (ciEquals(listing.currency, '0x119adb5e05e85d55690bc4da7b37c06bfecf2071')) {
      return 'FRTN'
    }
  }, [listing.currency]);

  return (
    <Box
      borderStyle='solid'
      borderColor={isSelected ? '#218cff' : 'auto'}
      borderWidth={isSelected ? '2px' : '1px'}
      rounded='lg'
      p={1}
    >
      <Box fontSize='sm'>
        ID: {shortAddress(listing.listingId)}
      </Box>
      <Box fontSize='sm'>
        Collection: {listing.nftAddress}
      </Box>
      <Box fontSize='sm'>
        Token ID: {listing.nftId}
      </Box>
      <Box fontSize='sm'>
        Price: {listing.price} {symbol}
      </Box>
      <HStack spacing={2} justify='center'>
        <Button
          onClick={() => onToggle(listing)}
          colorScheme={isSelected ? 'green' : 'gray'}
        >
          {isSelected ? 'Selected' : 'Select'}
        </Button>
        <Button onClick={onCopy}>{hasCopied ? "Copied!" : "Copy Address"}</Button>
      </HStack>
    </Box>
  )
}
// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   if (!context.req.headers.host?.startsWith('localhost') || process.env.NODE_ENV !== 'development') {
//     return {
//       destination: `/`,
//       permanent: false,
//     }
//   }
//
//   return { props: { } }
// }
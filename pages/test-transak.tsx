import {useState} from "react";
import {Contract, ethers} from "ethers";
import {Box, Button, Text, useClipboard, VStack, Wrap} from "@chakra-ui/react";
import {toast} from "react-toastify";
import {GetServerSidePropsContext} from "next";
import * as process from "process";
import {appConfig} from "@src/Config";
import {ERC721} from "@src/Contracts/Abis";
import {JsonRpcProvider} from "@ethersproject/providers";
import {parseErrorMessage} from "@src/helpers/validator";
import {useUser} from "@src/components-v2/useUser";
import {useQuery} from "@tanstack/react-query";
import {ApiService} from "@src/core/services/api-service";
import {shortAddress} from "@src/utils";
import {getServerSignature} from "@src/core/cms/endpoints/gaslessListing";

const readProvider = new JsonRpcProvider(appConfig().rpc.read);
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
  const { onCopy, value, setValue, hasCopied } = useClipboard("");

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
      const { data: serverSig } = await getServerSignature((user.address), selectedListings.map((purchase) => purchase.listingId));
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
    } catch (e: any) {
      console.log(e);
      toast.error(parseErrorMessage(e));
    } finally {
      setIsExecuting(false);
    }
  }

  return (
    <Box>
      <Box>
        <Text>Available listings</Text>
        <Wrap>
          {data && data.data.map((listing: any) => (
            <Box key={listing.id}>
              <Button
                onClick={() => handleToggleListing(listing)}
                colorScheme={selectedListings?.findIndex((l) => l.listingId === listing.listingId) !== -1 ? 'green' : 'gray'}
              >
                {shortAddress(listing.listingId)} <br /> {listing.price} CRO
              </Button>
            </Box>
          ))}
        </Wrap>
      </Box>
      <Button mt={4} isLoading={isExecuting} isDisabled={isExecuting} onClick={handleGenerateCallData}>
        Generate Call Data
      </Button>
      {!!callData && (
        <Box mt={2}>
          <Text fontSize='lg'>Call Data</Text>
          <Button onClick={onCopy}>{hasCopied ? "Copied!" : "Copy Call Data"}</Button>
          <Box w='500px'>{callData}</Box>
        </Box>
      )}
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
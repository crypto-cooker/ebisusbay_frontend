import {useState} from "react";
import {Contract} from "ethers";
import { Box, Button, Text, VStack, Wrap } from '@chakra-ui/react';
import {toast} from "react-toastify";
import {GetServerSidePropsContext} from "next";
import * as process from "process";
import {appConfig} from "@src/Config";
import {ERC721} from "@src/global/contracts/Abis";
import {JsonRpcProvider} from "@ethersproject/providers";
import {parseErrorMessage} from "@src/helpers/validator";
import {useUser} from "@src/components-v2/useUser";
import { useDisconnect } from 'wagmi';
import * as Sentry from "@sentry/nextjs";

const readProvider = new JsonRpcProvider(appConfig().rpc.read);

function Test() {
  return (
    <Box m={4}>
      <VStack align='start'>
        {/*<Metadata />*/}
        <WalletDebug />
      </VStack>
    </Box>
  )
}

export default Test;

const WalletDebug = () => {
  const user = useUser();
  const [isExecuting, setIsExecuting] = useState(false);
  const [value, setValue] = useState<any>();
  const { connectors, disconnect } = useDisconnect();

  const handleGetMetadata = async () => {
    user.requestTelemetry();
    toast.success('Telemetry requested')
  }

  const renderData = async ()  => {
    const _value = {
      connectors,
    }
    // setValue({ _value });
    Sentry.captureEvent({ message: 'requestTelemetry--UI', extra: _value});
  };

  return (
    <Box>
      <Wrap spacing={2}>
        <Button isLoading={isExecuting} isDisabled={isExecuting} onClick={handleGetMetadata}>
          Request Telemetry
        </Button>
        <Button isLoading={isExecuting} isDisabled={isExecuting} onClick={renderData}>
          Render Telemetry
        </Button>
      </Wrap>
      <Box>
        <Text>{value}</Text>
      </Box>
    </Box>
  )
}
// const Metadata = () => {
//   const user = useUser();
//   const [isExecuting, setIsExecuting] = useState(false);
//   const [value, setValue] = useState<string | number>();
//
//   const handleGetMetadata = async () => {
//     if (!user.address) {
//       toast.error('Please connect your wallet to continue');
//       return;
//     }
//
//     const contract = new Contract(
//       '0x4F410976c6687193dDC0da9C4F3ca1Dfd0ba0209',
//       ERC721,
//       readProvider
//     )
//
//     try {
//       setIsExecuting(true);
//       const tokenURI = await contract.tokenURI(10);
//       setValue(tokenURI);
//     } catch (e: any) {
//       console.log(e);
//       toast.error(parseErrorMessage(e));
//     } finally {
//       setIsExecuting(false);
//     }
//   }
//
//   return (
//     <Box>
//       <Button isLoading={isExecuting} isDisabled={isExecuting} onClick={handleGetMetadata}>
//         Get Metadata
//       </Button>
//       <Box>
//         <Text>{value}</Text>
//       </Box>
//     </Box>
//   )
//
// }

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // if (!context.req.headers.host?.startsWith('localhost') || process.env.NODE_ENV !== 'development') {
  //   return {
  //     destination: `/`,
  //     permanent: false,
  //   }
  // }

  return { props: { } }
}
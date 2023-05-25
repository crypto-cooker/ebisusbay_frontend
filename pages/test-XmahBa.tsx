import {useEffect, useState} from "react";
import {useAppSelector} from "@src/Store/hooks";
import {Contract} from "ethers";
import {Box, Button, Text, VStack} from "@chakra-ui/react";
import {toast} from "react-toastify";

function Test() {
  return (
    <Box m={4}>
      <VStack align='start'>
        <SeasonIncrementor />
      </VStack>
    </Box>
  )
}

export default Test;


const SeasonIncrementor = () => {
  const user = useAppSelector((state) => state.user);
  const [isExecuting, setIsExecuting] = useState(false);
  const [gameLoopContract, setGameLoopContract] = useState<Contract | null>(null);
  const [curSeason, setCurSeason] = useState<number>();

  const handleIncrementSeason = async () => {
    if (!user.address) {
      toast.error('Please connect your wallet to continue');
      return;
    }

    if (!gameLoopContract) {
      toast.error('GameLoop contract not initialized');
      return;
    }

    try {
      setIsExecuting(true);
      const tx = await gameLoopContract.newSeason();
      const receipt = await tx.wait();
      toast.success('Success!');
      await getSeason(gameLoopContract);
    } catch (e: any) {
      console.log(e);
      toast.error(e.message);
    } finally {
      setIsExecuting(false);
    }

  }

  const getSeason = async (contract: Contract) => {
    const season = await contract.curSeason();
    setCurSeason(season);
  }

  useEffect(() => {


    if (!!user.address) {
      const contract = new Contract(
        '0xC101d78F14d0840619b22B857eB131b402265D3e',
        gameLoopAbi,
        user.provider.getSigner()
      )
      setGameLoopContract(contract);
      getSeason(contract);
    }
  }, [user.address]);

  return (
    <Box>
      <Text fontWeight='bold'>Current Season: {curSeason}</Text>
      <Button isLoading={isExecuting} isDisabled={isExecuting} onClick={handleIncrementSeason}>
        Increment Season
      </Button>
    </Box>
  )
};

const gameLoopAbi = [
  "function curSeason() view returns (uint16)",
  "function newSeason()"
];

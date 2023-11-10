import {NextPage} from "next";
import RdHero from "@src/components-v2/feature/ryoshi-dynasties/components/heroes/rd-hero";
import { Flex, Box } from "@chakra-ui/react";

const Hero: NextPage = () => {
  return (
  <>
  <Flex 
    justifyContent={'center'}
    alignItems={'center'}
    flexDirection={'column'}
    // padding={'200px'}
    padding={'20px'}
    >
    <Box
      minW={'200px'}
      minH={'200px'}
      >
      {/* <RdHeroFrame nftId={'6'}/> */}
      <RdHero nftId={"880"}/>
    </Box>
  </Flex>
  </>
  );
};

export default Hero;

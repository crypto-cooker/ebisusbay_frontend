import {NextPage} from "next";
import FactionDirectoryComponent from "@src/components-v2/feature/ryoshi-dynasties/components/faction-directory";
import RdHeroFrame from "@src/components-v2/feature/ryoshi-dynasties/components/rd-hero";
import { Flex, Box } from "@chakra-ui/react";

const FactionDirectory: NextPage = () => {
  return (
  <>
  <Flex 
    justifyContent={'center'}
    alignItems={'center'}
    flexDirection={'column'}
    // padding={'200px'}
    padding={'20px'}
    >
    <Box >
      <RdHeroFrame/>
    </Box>
  </Flex>
  </>
  );
};

export default FactionDirectory;

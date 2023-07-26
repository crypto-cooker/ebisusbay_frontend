import {Box, Flex, Spacer, Text, Progress, HStack, Tag, Image, SimpleGrid, Center,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  useMediaQuery,
  NumberInput,
  NumberInputField
} from "@chakra-ui/react";
import {useAppSelector} from "@src/Store/hooks";
import React, {useState, useEffect, useRef, useContext} from "react";
import ReturnToVillageButton from "@src/components-v2/feature/ryoshi-dynasties/components/return-button";
import ImageService from "@src/core/services/image";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";

//for showing koban
import {ApiService} from "@src/core/services/api-service";
import {ethers} from "ethers";
import {siPrefixedNumber} from "@src/utils";
import NextApiService from "@src/core/services/api-service/next";
import {appConfig} from "@src/Config";
import { RdButton } from "../../../components";

const config = appConfig();

interface BattleMapHUDProps {
  onBack: () => void;
  setElementToZoomTo : (value: any) => void;
}

export const LandsHUD = ({onBack, setElementToZoomTo}: BattleMapHUDProps) => {
    
  const user = useAppSelector((state) => state.user);
  const rdContext = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const {game: rdGameContext, user:rdUser } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;

  const [isNotMobile] = useMediaQuery("(max-width: 768px)") 

  const [value, setValue] = React.useState(0)
  const handleChange = (value:string) => setValue(Number(value))

  const [accordionIndex, setAccordionIndex] = useState(-1);
  useEffect(() => {
    if(isNotMobile){
      setAccordionIndex(0);
    }else{
      setAccordionIndex(-1);
    }
}, [isNotMobile]); 

  const validateEntry = () => {
     setElementToZoomTo((value-1).toString())
  }

  return (
    <Box position='absolute' top={0} left={0}  w='100%' pointerEvents='auto' >
      <Flex direction='row' justify='space-between' >
      <ReturnToVillageButton onBack={onBack} />
      <Spacer />

      <Box mb={4} mt={6} mr={2}
        justifyContent='right'
        bg={user.theme === 'dark' ? '#272523EE' : '#272523EE'}
        rounded='md' 
        w={{base: '250px', sm: '250px'}}
        >
      <Accordion defaultIndex={[0]} allowToggle paddingRight={0} justifyContent='right'>
        <AccordionItem border='none'>
          <AccordionButton pointerEvents='auto'>
            
          </AccordionButton>
        
          <AccordionPanel pb={4} alignItems={'right'}>


          <Flex justify="right" align="right">
          <NumberInput defaultValue={1} min={1} max={2500} w={300} mr={2}
              placeholder='Search for Plot'
              value={value}
              onChange={handleChange}
              
              >
                <NumberInputField />
            
              </NumberInput>
            <RdButton
              pointerEvents={'auto'}
              onClick={() => validateEntry()}
              h={10}
              fontSize={'sm'}
              >
              Search
            </RdButton>
          </Flex>

          </AccordionPanel>
        </AccordionItem>
      </Accordion>
          
        
        </Box>
      </Flex>
    </Box>
  )
}
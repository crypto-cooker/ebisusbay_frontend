import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Divider,
  Flex,
  NumberInput,
  NumberInputField,
  Select,
  Spacer,
  Text,
  useMediaQuery,
  VStack
} from "@chakra-ui/react";
import {useAppSelector} from "@market/state/redux/store/hooks";
import React, {useEffect, useState} from "react";
import ReturnToVillageButton from "@src/components-v2/feature/ryoshi-dynasties/components/return-button";
import {appConfig} from "@src/Config";
import {RdButton} from "../../../components";
import {useUser} from "@src/components-v2/useUser";

const config = appConfig();

interface BattleMapHUDProps {
  onBack: () => void;
  showBackButton: boolean;
  setElementToZoomTo : (value: any) => void;
  traitTypes: string[];
  FilterByTraitCallback: (value:string) => void;
}

export const LandsHUD = ({onBack, showBackButton, setElementToZoomTo, traitTypes, FilterByTraitCallback}: BattleMapHUDProps) => {
  const user = useUser();
  const [isNotMobile] = useMediaQuery("(max-width: 768px)") 
  const [value, setValue] = React.useState(0)
  const handleChange = (value:string) => setValue(Number(value))
  const [accordionIndex, setAccordionIndex] = useState(-1);
  useEffect(() => {
    traitTypes
  }, []); 

  useEffect(() => {
    if(isNotMobile){
      setAccordionIndex(0);
    }else{
      setAccordionIndex(-1);
    }
}, [isNotMobile]); 

  const validateEntry = () => {
     setElementToZoomTo((value).toString())
  }

  const handleChangeTrait = (event: any) => {
    // console.log(event?.target.value)
    if(traitTypes.includes(event.target.value)){
      FilterByTraitCallback(event.target.value)
    }
    else{
      console.log(value);
    }
  }

  return (
    <Box position='absolute' top={0} left={0}  w='100%' pointerEvents='auto' >
      <Flex direction='row' justify='space-between' >
        {showBackButton && 
      <ReturnToVillageButton onBack={onBack} />
    }
      <Spacer />

      <Box mb={4} mt={2} mr={2}
        justifyContent='right'
        bg={user.theme === 'dark' ? '#272523EE' : '#272523EE'}
        rounded='md' 
        w={{base: '240px', sm: '240px'}}
        >
      <Accordion defaultIndex={[0]} allowToggle paddingRight={0} justifyContent='right'>
        <AccordionItem border='none'>
          <AccordionButton pointerEvents='auto'>
          </AccordionButton>
          <AccordionPanel pb={4} alignItems={'right'}>

          <Flex justify="space-between" align="right">

            <VStack justifyContent={'center'}>
              <NumberInput 
                defaultValue={1} 
                min={1} 
                max={2500} 
                maxW={100} 
                mr={2}
                placeholder='Search for Plot'
                value={value}
                onChange={handleChange}
                  >
                <NumberInputField
                max={2500} />
              </NumberInput>

              <RdButton
                pointerEvents={'auto'}
                onClick={() => validateEntry()}
                h={10}
                fontSize={'sm'}
                >
                Search
              </RdButton>
            </VStack>

            <VStack spacing={0}>
              <Text
                textColor={'#aaa'}
                fontSize={'sm'}
                as='i'
                > Legend
              </Text>
              <Divider orientation="horizontal" />
              <Text
                textColor={'#D24547'}
                fontSize={'sm'}
                as='b'
                > Owned
              </Text>
              <Text
                textColor={'gold'}
                fontSize={'sm'}
                as='b'
                > For Sale
              </Text>
              <Text
                textColor={'white'}
                fontSize={'sm'}
                // as='b'
                > Make Offer
              </Text>
            </VStack>
          </Flex>
          <Flex mt={4}>
                {/* <Input placeholder="inputtest"></Input> */}
              <Select onChange={handleChangeTrait} placeholder="Select option">
              <option selected hidden disabled value="">Search</option>
                {traitTypes.length >= 0 ? (
                  traitTypes.map((trait, index) => (
                  <option 
                    style={{ background: '#272523' }} 
                    value={trait} 
                    key={index}>
                    {trait}
                  </option>
                  ))) : (<></>)}
              </Select>

            </Flex>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
          
        
        </Box>
      </Flex>
    </Box>
  )
}
import {
  Center,
  Flex,
  Text,
} from '@chakra-ui/react';

const HelpTab = () => {

  return (
    <>
      <Flex 
        marginTop='2'
        marginLeft='4'
        marginRight='4'
        marginBottom='4'
        >
        <Center>
          <Text
          textAlign={'center'}
          >
            When attacking, a D6 roll is made for both the attacker and the defender. 
            The lower roll (ties going to defender) loses a troop. This continues until one 
            side has run out of troops
          </Text>
        </Center>
      </Flex>
    </>
  )
}

export default HelpTab;
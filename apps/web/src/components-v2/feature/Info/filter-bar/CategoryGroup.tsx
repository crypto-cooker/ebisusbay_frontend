import { Container, Button, HStack } from '@chakra-ui/react';
import ChainSelector from '../components/chain-selector';
export default function CategoryGroup() {
  return (
    <Container>
      <HStack>
        <HStack gap='1px'>
          <Button roundedLeft='full' roundedRight={0}>Overview</Button>
          <Button rounded={0}>Pairs</Button>
          <Button roundedLeft={0} roundedRight='full'>Tokens</Button>
        </HStack>
        <ChainSelector />
      </HStack>
    </Container>
  );
}

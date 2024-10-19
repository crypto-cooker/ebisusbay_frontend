import { Container, Button, HStack } from '@chakra-ui/react';
import ChainSelector from '../components/chain-selector';
export default function CategoryGroup() {
  return (
    <Container>
      <HStack>
        <HStack gap={0}>
          <Button borderRadius={{ right: 'full', left: 0 }}>Overview</Button>
          <Button>Pairs</Button>
          <Button>Tokens</Button>
        </HStack>
        <ChainSelector />
      </HStack>
    </Container>
  );
}

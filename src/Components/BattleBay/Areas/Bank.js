import {
  Heading,
} from '@chakra-ui/react';

const Bank = ({onBack}) => {
  return (
    <section className="gl-legacy container">
      <button class="btn" onClick={onBack}>Back to Village Map</button>
      <Heading className="title text-center">Bank</Heading>
      <p className="text-center">The Bank provides Fortune Staking <br/> Stake your Fortune to obtain Mitama</p>
    </section>
  )
};


export default Bank;
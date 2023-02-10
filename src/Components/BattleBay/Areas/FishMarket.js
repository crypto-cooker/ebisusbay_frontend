import {
  Heading,
} from '@chakra-ui/react';

const FishMarket = ({onBack}) => {
  return (
    <section className="gl-legacy container">
      <button class="btn" onClick={onBack}>Back to Village Map</button>
      <Heading className="title text-center">FishMarket</Heading>
      <p className="text-center">The FishMarket allows for NFT Trading of Ryoshi items only</p>
    </section>
  )
};


export default FishMarket;
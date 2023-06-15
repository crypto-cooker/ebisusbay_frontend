import {
  Heading,
} from '@chakra-ui/react';
import ReturnToVillageButton from "@src/components-v2/feature/ryoshi-dynasties/components/return-button";

const FishMarket = ({onBack}) => {
  return (
    <section className="gl-legacy container">
      <ReturnToVillageButton onBack={onBack} />
      <Heading className="title text-center">FishMarket</Heading>
      <p className="text-center">The FishMarket allows for NFT Trading of Ryoshi items only</p>
    </section>
  )
};


export default FishMarket;
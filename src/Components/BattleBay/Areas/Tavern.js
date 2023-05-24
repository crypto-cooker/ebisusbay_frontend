import {
  Heading,
} from '@chakra-ui/react';
import ReturnToVillageButton from "@src/components-v2/feature/ryoshi-dynasties/components/return-button";

const Tavern = ({onBack}) => {
  return (
    <section className="gl-legacy container">
      <ReturnToVillageButton onBack={onBack} />
      <Heading className="title text-center">Tavern</Heading>
      <p className="text-center">The Tavern includes Ryoshi Quests</p>
    </section>
  )
};


export default Tavern;
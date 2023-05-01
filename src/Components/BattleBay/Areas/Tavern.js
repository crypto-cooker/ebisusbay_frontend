import {
  Heading,
} from '@chakra-ui/react';

const Tavern = ({onBack}) => {
  return (
    <section className="gl-legacy container">
      <button class="btn" onClick={onBack}>Back to Village Map</button>
      <Heading className="title text-center">Tavern</Heading>
      <p className="text-center">The Tavern includes Ryoshi Quests</p>
    </section>
  )
};


export default Tavern;
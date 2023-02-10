import {
  Heading,
} from '@chakra-ui/react';

const Barracks = ({onBack}) => {
  return (
    <section className="gl-legacy container">
      <button class="btn" onClick={onBack}>Back to Village Map</button>

      <Heading className="title text-center">Barracks</Heading>
      <p className="text-center">Stake Ryoshis for battle bonus</p>
    </section>
  )
};


export default Barracks;
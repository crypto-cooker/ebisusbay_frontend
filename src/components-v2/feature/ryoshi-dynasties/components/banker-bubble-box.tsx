import {BoxProps, Grid, GridItem, Image} from "@chakra-ui/react";
import React from "react";
import Typewriter from 'typewriter-effect';

const BankerBubbleBox = (props: BoxProps) => {
  return (
    <Grid
      templateAreas={`
              "tlc top trc"
              "left main right"
              "blc bottom brc"
            `}
      gridTemplateRows={'50px 1fr 50px'}
      gridTemplateColumns={'50px 1fr 50px'}
      gap={0}
      {...props}
    >
      <GridItem area={'tlc'}>
        <Image
          src='/img/ryoshi/bubble/cb_top_left.png'
        />
      </GridItem>
      <GridItem area={'top'}>
        <Image
          src='/img/ryoshi/bubble/cb_top.png'
          w='full'
          h='50px'
        />
      </GridItem>
      <GridItem area={'trc'}>
        <Image
          src='/img/ryoshi/bubble/cb_top_right.png'
        />
      </GridItem>
      <GridItem area={'left'}>
        <Image
          src='/img/ryoshi/bubble/cb_left.png'
          w='50px'
          h='full'
        />
      </GridItem>
      <GridItem area={'main'} bg='#403C39'>
        {props.children}
      </GridItem>
      <GridItem area={'right'}>
        <Image
          src='/img/ryoshi/bubble/cb_right.png'
          w='50px'
          h='full'
        />
      </GridItem>
      <GridItem area={'blc'}>
        <Image
          src='/img/ryoshi/bubble/cb_bottom_left.png'
        />
      </GridItem>
      <GridItem area={'bottom'}>
        <Image
          src='/img/ryoshi/bubble/cb_bottom.png'
          w='full'
          h='50px'
        />
      </GridItem>
      <GridItem area={'brc'}>
        <Image
          src='/img/ryoshi/bubble/cb_bottom_right.png'
        />
      </GridItem>
    </Grid>
  )
}

export default BankerBubbleBox;

interface TypewriterProps {
  text: string | string[];
  onComplete?: () => void;
}

export const TypewriterText = ({text, onComplete}: TypewriterProps) => {
  return (
    <Typewriter
      onInit={(typewriter) => {
        if (!Array.isArray(text)) {
          text = [text];
        }

        text.forEach((t) => {
          typewriter.typeString(t).pauseFor(800);
        });

        typewriter.callFunction(() => {
            if (!!onComplete) onComplete();
          }).start();
      }}
      options={{
        delay: 20,
        cursor: ''
      }}
    />
  )
}
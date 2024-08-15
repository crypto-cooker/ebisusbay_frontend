import {BoxProps, Grid, GridItem, Image} from "@chakra-ui/react";
import React from "react";
import Typewriter from 'typewriter-effect';
import ImageService from "@src/core/services/image";

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
          src={ImageService.translate('/img/ryoshi/bubble/cb_top_left.png').convert()}
        />
      </GridItem>
      <GridItem area={'top'}>
        <Image
          src={ImageService.translate('/img/ryoshi/bubble/cb_top.png').convert()}
          w='full'
          h='50px'
        />
      </GridItem>
      <GridItem area={'trc'}>
        <Image
          src={ImageService.translate('/img/ryoshi/bubble/cb_top_right.png').convert()}
        />
      </GridItem>
      <GridItem area={'left'}>
        <Image
          src={ImageService.translate('/img/ryoshi/bubble/cb_left.png').convert()}
          w='50px'
          h='full'
        />
      </GridItem>
      <GridItem area={'main'} bg='#403C39'>
        {props.children}
      </GridItem>
      <GridItem area={'right'}>
        <Image
          src={ImageService.translate('/img/ryoshi/bubble/cb_right.png').convert()}
          w='50px'
          h='full'
        />
      </GridItem>
      <GridItem area={'blc'}>
        <Image
          src={ImageService.translate('/img/ryoshi/bubble/cb_bottom_left.png').convert()}
        />
      </GridItem>
      <GridItem area={'bottom'}>
        <Image
          src={ImageService.translate('/img/ryoshi/bubble/cb_bottom.png').convert()}
          w='full'
          h='50px'
        />
      </GridItem>
      <GridItem area={'brc'}>
        <Image
          src={ImageService.translate('/img/ryoshi/bubble/cb_bottom_right.png').convert()}
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
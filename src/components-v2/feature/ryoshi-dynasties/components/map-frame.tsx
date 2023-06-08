import {Box, Grid, GridItem, Image} from "@chakra-ui/react";
import ImageService from "@src/core/services/image";
import styles from "@src/Components/BattleBay/Areas/BattleBay.module.scss";
import React, {ReactElement} from "react";
import {useAppSelector} from "@src/Store/hooks";

interface MapOutlineProps {
  children: ReactElement[] | ReactElement;
  gridHeight ?: string;
  gridWidth ?: string;
}
const MapFrame = ({children, gridHeight, gridWidth}: MapOutlineProps) => {
  const user = useAppSelector((state) => state.user);
  return (
    <Grid
      templateAreas={`
                      "top top top"
                      "left main right"
                      "bottom bottom bottom"
                    `}
      gridTemplateRows={gridHeight}
      gridTemplateColumns={gridWidth}
      gap={0}
    >
      <GridItem area={'left'}>
        <Image
          src={ImageService.translate(`/img/ryoshi-dynasties/village/frame-left-${user.theme}.png`).convert()}
          h={'100%'}
        />
      </GridItem>
      <GridItem area={'top'}>
        <Image
          src={ImageService.translate(`/img/ryoshi-dynasties/village/frame-top-${user.theme}.png`).convert()}
          w={'100%'}
        />
      </GridItem>
      <GridItem area={'right'}>
        <Image
          src={ImageService.translate(`/img/ryoshi-dynasties/village/frame-right-${user.theme}.png`).convert()}
          h={'100%'}
        />
      </GridItem>
      <GridItem area={'bottom'}>
        <Image
          src={ImageService.translate(`/img/ryoshi-dynasties/village/frame-bottom-${user.theme}.png`).convert()}
          w={'100%'}
        />
      </GridItem>
      <GridItem area={'main'} position='relative' display='flex'>
        {children}
      </GridItem>
    </Grid>
  )
}

export default MapFrame;
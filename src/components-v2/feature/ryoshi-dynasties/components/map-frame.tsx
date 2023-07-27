import {Box, BoxProps, Grid, GridItem, GridProps, Image} from "@chakra-ui/react";
import ImageService from "@src/core/services/image";
import styles from "@src/Components/BattleBay/Areas/BattleBay.module.scss";
import React, {ReactElement} from "react";
import {useAppSelector} from "@src/Store/hooks";

interface MapOutlineProps extends GridProps {
  children: ReactElement[] | ReactElement;
  gridHeight?: string;
  gridWidth?: string;
  topFrame?: string;
  rightFrame?: string;
  bottomFrame?: string;
  leftFrame?: string;
}

const MapFrame = ({children, gridHeight, topFrame, rightFrame, bottomFrame, leftFrame, gridWidth, ...props}: MapOutlineProps) => {
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
      {...props}
    >
      <GridItem area={'left'}>
        <Image
          src={leftFrame ?? ImageService.translate(`/img/ryoshi-dynasties/village/frame-left-${user.theme}.png`).convert()}
          h={'100%'}
        />
      </GridItem>
      <GridItem area={'top'}>
        <Image
          src={topFrame ?? ImageService.translate(`/img/ryoshi-dynasties/village/frame-top-${user.theme}.png`).convert()}
          w={'100%'}
        />
      </GridItem>
      <GridItem area={'right'}>
        <Image
          src={rightFrame ?? ImageService.translate(`/img/ryoshi-dynasties/village/frame-right-${user.theme}.png`).convert()}
          h={'100%'}
        />
      </GridItem>
      <GridItem area={'bottom'}>
        <Image
          src={bottomFrame ?? ImageService.translate(`/img/ryoshi-dynasties/village/frame-bottom-${user.theme}.png`).convert()}
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
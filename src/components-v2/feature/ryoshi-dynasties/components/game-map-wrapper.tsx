import React, {useEffect, useRef, useState} from "react";
import {Box, useBreakpointValue} from "@chakra-ui/react";
import BattleMap from "@src/components-v2/feature/ryoshi-dynasties/game/areas/battle-map";
import {MapProps} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/battle-map/index";

interface BattleMapWrapperProps {
  showActiveGame: boolean;
  height: string;
  blockDeployments: boolean;
}

const GameMapWrapper = ({showActiveGame, height, blockDeployments}: BattleMapWrapperProps) => {
  const [currentModalRef, setCurrentModalRef] = useState<React.RefObject<HTMLDivElement> | null>(null);
  const ref = useRef(null);

  const mapProps = useBreakpointValue<MapProps>(
    {
      base: {
        scale: 0.40,
        initialPosition: { x: -400, y: -127 },
        minScale: 0.25
      },
      sm: {
        scale: 0.41,
        initialPosition: { x: -335, y: -113 },
        minScale: 0.2
      },
      md: {
        scale: 0.42,
        initialPosition: { x: -185, y: -163 },
        minScale: 0.22
      },
      // lg: {
      //   scale: 0.43,
      //   initialPosition: { x: 281, y: -33 },
      //   minScale: 0.45
      // },
      // xl: {
      //   scale: 0.44,
      //   initialPosition: { x: 0.78, y: -123 },
      //   minScale: 0.44
      // },
      // '2xl': {
      //   scale: 0.45,
      //   initialPosition: { x: 268, y: -33 },
      //   minScale: 0.45
      // },
      // xxl: { //doesnt apply to any screen larger than 1920px
      //   scale: 1.0,
      //   initialPosition: { x: -20, y: -35 },
      //   minScale: 1.1
      // }
    }
  );

  const empty = () => {
  };

  useEffect(() => {
    setCurrentModalRef(ref);
  }, [ref]);

  return (
    <Box ref={currentModalRef} position='relative'>
        <BattleMap 
        onChange={empty} 
        showFullBattlePage={false} 
        mapProps={mapProps} 
        height={height}
        useCurrentGameId={showActiveGame}
        blockDeployments={blockDeployments}
        />
    </Box>
  )
}


export default GameMapWrapper;
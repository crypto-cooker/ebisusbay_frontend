import {AspectRatio, Box, Image} from "@chakra-ui/react";
import {ReactZoomPanPinchRef, TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";
import React, {useRef} from "react";

const Village = () => {
  const transformComponentRef = useRef<ReactZoomPanPinchRef | null>(null);

  return (
    <Box
      position='relative'
      bg='red.800'
      h='calc(100vh - 74px)'
    >

        <TransformWrapper
          // limitToBounds={true}
          // onZoom={changeCanvasState}
          // onPinching={changeCanvasState}
          // onPinchingStop={changeCanvasState}
          // onPanningStop={changeCanvasState}
          initialPositionX={0}
          initialPositionY={0}
          initialScale={1}
          ref={transformComponentRef}
        >
          {(utils) => (
            <React.Fragment>
              {/* <button onClick={zoomToImage}>Zoom to 1</button> */}
              {/* <Controls {...utils} /> */}
                <TransformComponent
                  wrapperStyle={{height: 'calc(100vh - 74px)', width: '100%'}}
                >
                  {/*<AspectRatio ratio={2880/1620} overflow='visible'>*/}
                  {/*<Box color='blue.500' minH='calc(100vh - 74px)' position='relative'>*/}
                      <Image
                        src='/img/battle-bay/mapImages/background.png'
                        maxW='max-content'
                        maxH='400px'
                        // position='absolute'
                        // top={0}
                        // left={0}
                      />
                  {/*</Box>*/}

                  {/*</AspectRatio>*/}
                </TransformComponent>
            </React.Fragment>
          )}
        </TransformWrapper>

    </Box>
  )
}

export default Village;
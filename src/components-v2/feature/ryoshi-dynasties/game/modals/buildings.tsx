import {useAppSelector} from "@market/state/redux/store/hooks";

import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  SimpleGrid,
} from "@chakra-ui/react";

import {ReactElement, useContext, useEffect, useState} from "react";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";

import localFont from 'next/font/local';
const gothamBook = localFont({ src: '../../../../../global/assets/fonts/Gotham-Book.woff2' })

interface BuildingsProps {
  isOpenBuildings: boolean;
  onCloseBuildings: () => void;
  buildingButtonRef: any;
  setElementToZoomTo: any;
}

const Buildings = ({isOpenBuildings, onCloseBuildings, buildingButtonRef, setElementToZoomTo}: BuildingsProps) => {
  const buttonsNames = ["Bank", "Alliance Center", "Tavern", "Moongate", "Barracks", "Announcements", "Battle Map", "Market"];

  return (
    <Drawer
        isOpen={isOpenBuildings}
        // placement={{base:'bottom', sm:'right'}}
        placement='bottom'
        onClose={onCloseBuildings}
        finalFocusRef={buildingButtonRef}
        size='xs'
      >
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Zoom to Building</DrawerHeader>
          <DrawerBody >
            <SimpleGrid columns={{base: 2, sm: 3}} w={{base: '300px', sm: '500px'}}>
              {buttonsNames.map((button, i) => (
                <Button
                  key={i}
                  style={{ marginTop: '4px', marginLeft: '4px' }}
                  onClick={() => setElementToZoomTo(button)}
                  variant='outline'
                  size='sm'
                >
                  {button}
                </Button>
              ))}
            </SimpleGrid>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
  )
}

export default Buildings;

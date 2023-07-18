import {useAppSelector} from "@src/Store/hooks";

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
import {useDispatch} from "react-redux";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";

import localFont from 'next/font/local';
const gothamBook = localFont({ src: '../../../../../fonts/Gotham-Book.woff2' })

interface BuildingsProps {
  isOpenBuildings: boolean;
  onCloseBuildings: () => void;
  buildingButtonRef: any;
  setElementToZoomTo: any;
}

const Buildings = ({isOpenBuildings, onCloseBuildings, buildingButtonRef, setElementToZoomTo}: BuildingsProps) => {
  const [buildingButtons, setBuildingButtons] = useState<ReactElement[]>([]);

  const buttonsNames = ["Bank", "Alliance Center", "Moongate", "Barracks", "Announcements", "Battle Map", "Market"];
  const SetUpButtons = async () => {
    setBuildingButtons(buttonsNames.map((button, i) =>
      (<Button style={{ marginTop: '4px', marginLeft: '4px' }}
               onClick={() => setElementToZoomTo(button)} variant='outline'size='sm'>
          {button}</Button>
      )))
  }
  useEffect(() => {
    SetUpButtons();
  }, [])

  return (
    <Drawer
        isOpen={isOpenBuildings}
        // placement={{base:'bottom', sm:'right'}}
        placement='top'
        onClose={onCloseBuildings}
        finalFocusRef={buildingButtonRef}
        size='xs'
      >
        <DrawerContent w={'1200px'}>
          <DrawerCloseButton />
          <DrawerHeader>Zoom to Building</DrawerHeader>
          <DrawerBody >
            <SimpleGrid column={1} w={'150px'}>
            {buildingButtons}

            </SimpleGrid>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
  )
}

export default Buildings;

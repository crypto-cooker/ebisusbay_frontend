import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent, DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Input, useDisclosure
} from "@chakra-ui/react";
import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {useSelector} from "react-redux";

const MobileSearchDrawer = () => {
  const user = useSelector((state) => state.user);
  const {isOpen, onOpen, onClose} = useDisclosure();

  return (
    <>
      <div className="de-menu-notification" onClick={onOpen}>
        <span>
          <FontAwesomeIcon icon={faSearch} color={user.theme === 'dark' ? '#000' : '#000'} />
        </span>
      </div>
      <Drawer
        isOpen={isOpen}
        placement="bottom"
        onClose={onClose}
        size="full"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search Ebisu's Bay</DrawerHeader>

          <DrawerBody>
            <Input placeholder='Type here...' />
          </DrawerBody>

          <DrawerFooter>

          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
};


export default MobileSearchDrawer;
import { useSelector } from "react-redux";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Button,
  Flex,
  Spacer,
  Box,
  Text,
  Image,
  Input,
  Grid,
  Button as ChakraButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  TableCaption
} from "@chakra-ui/react"
import { Spinner } from 'react-bootstrap';
import {ArrowBackIcon, CloseIcon} from "@chakra-ui/icons";

import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {useRouter} from 'next/router';
// import styles from './profile.module.scss';
import {hostedImage} from "@src/helpers/image";
import {caseInsensitiveCompare, isUserBlacklisted, shortAddress} from "@src/utils";
import Inventory from "@src/components-v2/feature/account/profile/tabs/inventory";
import {

} from "@chakra-ui/react";
import {motion} from 'framer-motion'
import {useAppDispatch, useAppSelector} from "@src/Store/hooks";
import NFTSlot from "@src/components-v2/feature/ryoshi-dynasties/components/nft-slot";

// interface Props {
//   isOpen: boolean;
//   onClose: () => void;
// }
//: Props

const StakeNFTs = ({isOpen, onClose}) => {

  const user = useAppSelector((state) => state.user);
 
 
  const breakpoints = {
    sm: '30em',
    md: '48em',
    lg: '62em',
    xl: '80em',
    '2xl': '96em',
  }

  const [isLoading, setIsLoading] = useState(false);
  // const user = useSelector((state) => state.user);
  const [stakedNFTs, setStakedNFTs] = useState([]);

  const getCurrentlyStakedNFTs = async () => {
    //for each stakedNFTs, create a box with the image and name
    // const stakes = await getStakedNFTs(user.address);
    const stakes = ["1", "2", "3", "4", "5"]
    setStakedNFTs( stakes.map((stake) => {
      return (
        <Td padding='0.5'
        overflow='hidden'
        >
          <Image position='absolute' src='/img/battle-bay/stakeNFT/slots.svg' w='80px' h='80px'
          zIndex='1'
          
           />

          <Flex 
          position='relative'
          zIndex='2'
          opacity='0.9'
          justifyContent='center' padding='2' borderRadius={'5px'} w='80px' h='80px' bg='linear-gradient(147.34deg, #967729 -13.87%, #482698 153.79%)' >
            <Image zIndex='3' src='/img/battle-bay/stakeNFT/lock.svg' w='20px' h='20px' />
            {/* <Image zIndex='1' src='/img/battle-bay/stakeNFT/slots.svg' w='80px' h='80px' /> */}
          </Flex>
        </Td>
      )
    })
    );

    setIsLoading(false);
  };


  useEffect(() => {
    console.log("useEffect")
    // console.log(user.address)
    // console.log(address)
    setIsLoading(true);
    getCurrentlyStakedNFTs()
  }, []);


  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered size='full' bg='none'>
      <ModalOverlay bg='blackAlpha.800'/>
      <ModalContent bg= "#none" 
      w='95%'
            h='calc(100vh - 74px)'>
              
        {!isLoading ? (
          <>
          <Box>
          <Spacer h='74px'/>

          <ModalBody>
          <Button
            bg='#C17109'
            rounded='full'
            border='8px solid #F48F0C'
            w={14}
            h={14}
            fontSize='28px'
            onClick={onClose}
            _groupHover={{
              bg: '#de8b08',
              borderColor: '#f9a50b',
            }}
          >
            <ArrowBackIcon />
          </Button>
          <Spacer h='20px' />

          <Flex  textAlign='center' borderRadius={'10px'} justifyContent='center' alignItems='center' bg='#242424'>
          <TableContainer>
            <Table size='md'>
          <TableCaption>Coming Soon...</TableCaption>
              <Thead>
                <Tr>
                  <Th></Th>
                  <Th></Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {stakedNFTs}
              </Tbody>
            </Table>
          </TableContainer>

          </Flex>

          <ModalHeader fontSize='28' className="text-center">Stake NFTs</ModalHeader>

            <Spacer h='20px' />
              <div className="de_tab_content">
                  <Inventory address={user.address} />
              </div>

          </ModalBody>
          <ModalFooter className="border-0"/>
          </Box>

          </>
        ) : (
          <Spinner animation="border" role="status" size="sm" className="ms-1">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        )}
      </ModalContent>
    </Modal>
    
  )
}

export default StakeNFTs;
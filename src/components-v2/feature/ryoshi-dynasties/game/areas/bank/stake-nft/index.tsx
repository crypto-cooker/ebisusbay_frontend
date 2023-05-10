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
import FaqPage from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/faq-page";
import StakePage from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/stake-page";
import RdModal from "@src/components-v2/feature/ryoshi-dynasties/components/modal";

interface StakeNftsProps {
  isOpen: boolean;
  onClose: () => void;
}

const StakeNfts = ({isOpen, onClose}: StakeNftsProps) => {


  const [isLoading, setIsLoading] = useState(false);

  return (
    <RdModal
      isOpen={isOpen}
      onClose={onClose}
      title='Stake NFTs'
      size='full'
    >
      {!isLoading ? (
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
                {["1", "2", "3", "4", "5"].map((stake) => {
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
                })}
              </Tbody>
            </Table>
          </TableContainer>

        </Flex>
      ) : (
        <Spinner animation="border" role="status" size="sm" className="ms-1">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      )}
    </RdModal>
  )
}

export default StakeNfts;
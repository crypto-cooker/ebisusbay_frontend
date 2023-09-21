import {Box, Center, Flex, HStack, Icon, IconButton, Image, SimpleGrid, Spacer, Text, Wrap, WrapItem, Heading} from "@chakra-ui/react"

import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useAppSelector} from "@src/Store/hooks";
import {RdButton, RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {appConfig} from "@src/Config";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {toast} from "react-toastify";
import {getAuthSignerInStorage} from "@src/helpers/storage";
import useCreateSigner from "@src/Components/Account/Settings/hooks/useCreateSigner";

import {ApiService} from "@src/core/services/api-service";

const config = appConfig();

import {
    Button,
    ButtonGroup,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spinner,
    VStack
  } from "@chakra-ui/react"
  
  import {useInfiniteQuery, useQuery, useQueryClient} from "@tanstack/react-query";
  import nextApiService from "@src/core/services/api-service/next";
  import InfiniteScroll from "react-infinite-scroll-component";
  import StakingNftCard from "@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/stake-nft/staking-nft-card";
  import {caseInsensitiveCompare} from "@src/utils";
  import WalletNft from "@src/core/models/wallet-nft";
  import ImageService from "@src/core/services/image";
  import {StakedToken} from "@src/core/services/api-service/graph/types";
  import ShrineIcon from "@src/components-v2/shared/icons/shrine";
  import {ArrowBackIcon, CloseIcon} from "@chakra-ui/icons";
  import RdTabButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-tab-button";
  import {BigNumber, Contract, ethers} from "ethers";
  import {ERC1155, ERC721} from "@src/Contracts/Abis";
  import useBarracksStakeNfts from "@src/components-v2/feature/ryoshi-dynasties/game/hooks/use-barracks-stake-nfts";
  import {getNft} from "@src/core/api/endpoints/nft";
  import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
  import {faAward} from "@fortawesome/free-solid-svg-icons";
  import {
    BarracksStakeNftContext
  } from "@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/stake-nft/context";
  import {StakedTokenType} from "@src/core/services/api-service/types";

  import Fortune from "@src/Contracts/Fortune.json";
  import SeasonUnlocks from "@src/Contracts/SeasonUnlocks.json";
  import {parseErrorMessage} from "@src/helpers/validator";
  import localFont from "next/font/local";
  import FortuneIcon from "@src/components-v2/shared/icons/fortune";
  import FaqPage from "@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/meeple/faq-page";
  
  const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
  const gothamBook = localFont({ src: '../../../../../../../../src/fonts/Gotham-Book.woff2' });

interface MeepleProps {
  isOpen: boolean;
  onClose: () => void;
}

const Meeple = ({isOpen, onClose}: MeepleProps) => {
  const user = useAppSelector((state) => state.user);
  const rdContext = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const [executingLabel, setExecutingLabel] = useState('');
  const [isLoading, getSigner] = useCreateSigner();
  const fetcher = async () => {
    return await ApiService.withoutKey().ryoshiDynasties.getDailyRewards(user.address!)
  }
  const [page, setPage] = useState<string>();

  const handleClose = () => {
    onClose();
  }

  useEffect(() => {
  }, [])

  const handleBack = () => {
    if (!!page) {
      setPage(undefined);
    } else {
      setPage('faq');
    }
  };

  return (
    <>
  <RdModal
      isOpen={isOpen}
      onClose={handleClose}
      title='Meeple'
      size='5xl'
      isCentered={false}
      utilBtnTitle={!!page ? <ArrowBackIcon /> : <>?</>}
      onUtilBtnClick={handleBack}
    >
      {page === 'faq' ? (
        <FaqPage />
      ) : (
        <>
          <Text align='center' p={2}>Top of the Meeple</Text>
          {/* <StakingBlock
            // pendingNfts={pendingNfts}
            // stakedNfts={stakedNfts}
            // onRemove={handleRemoveNft}
            // onStaked={handleStakeSuccess}
            // slotUnlockContext={slotUnlockContext}
            // refetchSlotUnlockContext={refetchSlotUnlockContext}
          /> */}
          <Box p={4}>
            <Flex direction='row' justify='center' mb={2}>
              <SimpleGrid columns={{base: 2, sm: 4}}>
                {/* <RdTabButton isActive={currentTab === tabs.ryoshiVip} onClick={handleBtnClick(tabs.ryoshiVip)}>
                  VIP
                </RdTabButton>
                <RdTabButton isActive={currentTab === tabs.fortuneGuards} onClick={handleBtnClick(tabs.fortuneGuards)}>
                  Guards
                </RdTabButton>
                <RdTabButton isActive={currentTab === tabs.ryoshiHalloween} onClick={handleBtnClick(tabs.ryoshiHalloween)}>
                  Halloween
                </RdTabButton>
                <RdTabButton isActive={currentTab === tabs.ryoshiChristmas} onClick={handleBtnClick(tabs.ryoshiChristmas)}>
                  Christmas
                </RdTabButton> */}
              </SimpleGrid>
            </Flex>
          </Box>
        </>

      )}
    </RdModal>
    </>
  )
}

export default Meeple;
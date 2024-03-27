import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  Icon,
  SimpleGrid,
  Slide,
  Spacer,
  useBreakpointValue,
  Wrap
} from "@chakra-ui/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHandshake} from "@fortawesome/free-solid-svg-icons";
import React, {ReactNode, useEffect, useRef, useState} from "react";
import useGetProfilePreview from "@src/hooks/useGetUsername";
import {Card} from "@src/components-v2/foundation/card";
import {GetDealItemPreview} from "@src/components-v2/feature/deal/preview-item";
import {PrimaryButton, SecondaryButton} from "@src/components-v2/foundation/button";
import {useColorModeValue} from "@chakra-ui/color-mode";
import {useUser} from "@src/components-v2/useUser";
import {ciEquals} from "@src/utils";

interface ManageDealProps {
  deal: any;
}

const ManageDeal = ({deal}: ManageDealProps) => {
  const user = useUser();
  const {username: makerUsername, avatar: makerAvatar} = useGetProfilePreview(deal.maker);
  const {username: takerUsername, avatar: takerAvatar} = useGetProfilePreview(deal.taker);
  const initialFocusRef = useRef(null);
  const isMobile = useBreakpointValue({base: true, sm: false}, {fallback: 'sm'});
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  const handleOpenPopover = (index: number, side: string) => {
    setOpenPopoverId(`${index}${side}`);
  };

  const matchesPopoverId = (index: number, side: string) => {
    return openPopoverId === `${index}${side}`;
  }

  const handleAccept = () => {

  }

  const handleCounterOffer = () => {

  }

  const handleReject = () => {

  }

  const handleCancel = () => {

  }

  const isMaker = !!user.address && ciEquals(user.address, deal.maker);
  const isTaker = !!user.address && ciEquals(user.address, deal.taker);

  useEffect(() => {
    console.log('SWAP', deal);
  }, []);


  return (
    <Container size='xl'>
      <SimpleGrid
        columns={{base: 1, sm: 3}}
        templateColumns={{base: undefined, sm:'1fr 30px 1fr'}}
        templateRows={{base: '1fr 30px 1fr', sm:undefined}}
        gap={4}
      >
        <Card>
          <Box>{makerUsername}</Box>
          <Box>
            <Wrap>
              {deal.makerItems.map((item: any, index: number) => (
                <GetDealItemPreview
                  key={index}
                  item={item}
                  ref={initialFocusRef}
                  isActive={true}
                  mode='READ'
                  isOpen={matchesPopoverId(index, 'maker')}
                  onOpen={() => handleOpenPopover(index, 'maker')}
                  onClose={() => setOpenPopoverId(null)}
                />
              ))}
            </Wrap>
          </Box>
        </Card>
        <Box my='auto' mx='auto'>
          <Icon as={FontAwesomeIcon} icon={faHandshake} boxSize={8} />
        </Box>
        <Card>
          <Box>{takerUsername}</Box>
          <Box>
            <Wrap>
              {deal.takerItems.map((item: any, index: number) => (
                <GetDealItemPreview
                  key={index}
                  item={item}
                  ref={initialFocusRef}
                  isActive={true}
                  mode='READ'
                  isOpen={matchesPopoverId(index, 'taker')}
                  onOpen={() => handleOpenPopover(index, 'taker')}
                  onClose={() => setOpenPopoverId(null)}
                />
              ))}
            </Wrap>
          </Box>
        </Card>
      </SimpleGrid>
      {(isMaker || isTaker) && (
        <ConditionalActionBar condition={isMobile ?? false}>
          {isTaker ? (
            <Flex>
              <Button variant='link' size='sm'>
                Reject
              </Button>
              <Spacer />
              <ButtonGroup>
                <SecondaryButton>
                  Counter Offer
                </SecondaryButton>
                <PrimaryButton>
                  Accept
                </PrimaryButton>
              </ButtonGroup>
            </Flex>
          ) : isMaker && (
            <Flex>
              <PrimaryButton>
                Cancel
              </PrimaryButton>
            </Flex>
          )}
        </ConditionalActionBar>
      )}
    </Container>
  )
}

const ConditionalActionBar = ({condition, children}: {condition: boolean, children: ReactNode} ) => {
  const sliderBackground = useColorModeValue('gray.50', 'gray.700');
  
  return condition ? (
    <Slide direction='bottom' in={true} style={{ zIndex: 10 }}>
      <Box textAlign='center' p={3} backgroundColor={sliderBackground} borderTop='1px solid white'>
        {children}
      </Box>
    </Slide>
  ) : children;
}

export default ManageDeal;
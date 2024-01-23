import {RdButton, RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {RdModalBody, RdModalBox, RdModalFooter} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";
import {
  Box,
  BoxProps,
  Flex,
  FormControl,
  FormLabel,
  GridItem,
  HStack,
  IconButton,
  Image,
  Select,
  SimpleGrid,
  Stack,
  Text
} from "@chakra-ui/react";
import ImageService from "@src/core/services/image";
import React, {ChangeEvent, ReactNode, useMemo, useState} from "react";
import {CloseIcon} from "@chakra-ui/icons";
import {useIsTouchDevice} from "@src/hooks/use-is-touch-device";
import FortuneIcon from "@src/components-v2/shared/icons/fortune";
import {commify} from "ethers/lib/utils";
import {round} from "@src/utils";
import {useUser} from "@src/components-v2/useUser";
import AuthenticationGuard from "@src/components-v2/shared/authentication-guard";
import AuthenticationRdButton from "@src/components-v2/feature/ryoshi-dynasties/components/authentication-rd-button";

interface VillageMerchantProps {
  isOpen: boolean;
  onClose: () => void;
  forceRefresh: () => void;
}

export const VillageMerchant = ({isOpen, onClose, forceRefresh}: VillageMerchantProps) => {
  const user = useUser();
  const [selectedItem, setSelectedItem] = useState<string>();
  const [amountToPurchase, setAmountToPurchase] = useState('');

  const handleSelectItem = (key: string, selected: boolean) => {
    setSelectedItem(selected ? key : undefined)
  }

  const handleQuantityChange = (e: ChangeEvent<HTMLSelectElement>) => setAmountToPurchase(e.target.value);

  return (
    <RdModal
      isOpen={isOpen}
      onClose={onClose}
      title='Merchant'
      isCentered={false}
    >
      <RdModalBody>
        <RdModalBox>
          <AuthenticationGuard>
            {({isConnected, connect}) => (
              <>
                {isConnected ? (
                  <Flex justify='center'>
                    <HStack>
                      <Text fontWeight='bold' fontSize={{base: 'sm', sm: 'md'}}>Your</Text>
                      <FortuneIcon boxSize={6} />
                      <Text fontWeight='bold' fontSize={{base: 'sm', sm: 'md'}}>
                        $FRTN: {commify(round(user.balances.frtn, 2))}
                      </Text>
                    </HStack>
                  </Flex>
                ) : (
                  <Flex justify='space-between' align='center'>
                    <Box>
                      Connect wallet to view FRTN balance
                    </Box>
                    <RdButton
                      size='sm'
                      onClick={connect}
                    >
                      Connect
                    </RdButton>
                  </Flex>
                )}
              </>
            )}
          </AuthenticationGuard>
        </RdModalBox>

        <RdModalBox mt={2}>
          <Stack direction='row'>
            <Image src={ImageService.translate(`/img/ryoshi-dynasties/village/buildings/merchant-open.apng`).convert()} />
            <Box textAlign='center'>
              <Text>Greetings traveler do you need something? Rio has got you covered.</Text>
              <Text mt={2}>Select any available item below to view details.</Text>
            </Box>
          </Stack>
          <SimpleGrid columns={{base: 2, sm: 3, md: 4}} gap={2}  mt={4}>
            <SelectableImageComponent2
              image={ImageService.translate(`/img/ryoshi-dynasties/village/merchant/koban-common.png`).fixedWidth(100, 100)}
              label='96,244 / 100k'
              isAvailable={true}
              isDisabled={false}
              isSelected={selectedItem === 'koban-common'}
              onSelected={(selected) => handleSelectItem('koban-common', selected)}
            />
            <SelectableImageComponent2
              image={ImageService.translate(`/img/ryoshi-dynasties/village/merchant/battle-supplies-uncommon.png`).fixedWidth(100, 100)}
              label='Unavailable'
              isAvailable={false}
              isDisabled={true}
              isSelected={selectedItem === 'battle-supplies-uncommon'}
              onSelected={(selected) => handleSelectItem('battle-supplies-uncommon', selected)}
            />
            <SelectableImageComponent2
              image={ImageService.translate(`/img/ryoshi-dynasties/village/merchant/mushroom-uncommon.png`).fixedWidth(100, 100)}
              label='Unavailable'
              isAvailable={false}
              isDisabled={true}
              isSelected={selectedItem === 'mushroom-uncommon'}
              onSelected={(selected) => handleSelectItem('mushroom-uncommon', selected)}
            />
            <SelectableImageComponent2
              image={ImageService.translate(`/img/ryoshi-dynasties/village/merchant/potion-uncommon.png`).fixedWidth(100, 100)}
              label='Unavailable'
              isAvailable={false}
              isDisabled={true}
              isSelected={selectedItem === 'potion-uncommon'}
              onSelected={(selected) => handleSelectItem('potion-uncommon', selected)}
            />
          </SimpleGrid>
        </RdModalBox>
        {!!selectedItem && (
          <SimpleGrid columns={{base: 1, md: 2}} gap={2} mt={2}>
            <RdModalBox>
              <FormControl>
                <FormLabel fontWeight='bold'>
                  Available Koban Packs
                </FormLabel>
                <Box>
                  <Select
                    onChange={handleQuantityChange}
                    value={amountToPurchase}
                  >
                    <option value='500'>500 (50 FRTN)</option>
                    <option value='2600'>2,600 (250 FRTN)</option>
                    <option value='5300'>5,300 (500 FRTN)</option>
                    <option value='11000'>11,000 (1,000 FRTN)</option>
                    <option value='28000'>28,000 (2,500 FRTN)</option>
                    <option value='57000'>57,000 (5,000 FRTN)</option>
                  </Select>
                </Box>
              </FormControl>
            </RdModalBox>
            <RdModalBox>
              <Flex justify='end' h='full' align='end'>
                <SimpleGrid columns={2} gridTemplateColumns="100px 1fr">
                  <GridItem ><Box textAlign={{base: 'start', sm: 'end'}}>FRTN Price:</Box></GridItem>
                  <GridItem>
                    <Box textAlign='end'>
                      <HStack justify='end' spacing={1} ps={2}>
                        <FortuneIcon boxSize={5} />
                        <Text  fontWeight='bold'>1,234</Text>
                      </HStack>
                    </Box>
                  </GridItem>
                  <GridItem alignSelf='end'><Box textAlign={{base: 'start', sm: 'end'}} fontSize='xl'>Receive:</Box></GridItem>
                  <GridItem alignSelf='end'>
                    <HStack justify='end' fontSize='2xl' fontWeight='bold' spacing={1} ps={2}>
                      <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/koban.png').convert()} alt="kobanIcon" boxSize={6}/>
                      <Text  fontWeight='bold'>57,000</Text>
                    </HStack>
                  </GridItem>
                </SimpleGrid>
              </Flex>
            </RdModalBox>
          </SimpleGrid>
        )}
        <AuthenticationRdButton
          connectText='Connect wallet to purchase'
          requireSignin={false}
        >
          <RdModalFooter>
            <Box textAlign='center' mx={2} ps='20px'>
              <RdButton
                stickyIcon={true}
                onClick={() => {}}
                fontSize={{base: 'xl', sm: '2xl'}}
                // isLoading={isExecuting}
                // isDisabled={isExecuting}
              >
                Purchase
              </RdButton>
            </Box>
          </RdModalFooter>
        </AuthenticationRdButton>
      </RdModalBody>
    </RdModal>
  )
}


interface SelectableComponentProps extends BoxProps {
  isSelected: boolean;
  children: ReactNode;
  onSelected: (selected: boolean) => void;
}

const SelectableComponent = ({isSelected, onSelected, children, ...props}: SelectableComponentProps) => {
  const isTouchDevice = useIsTouchDevice();

  const hoverStyle = useMemo(() => ({
    borderStyle: isTouchDevice || (!isTouchDevice && isSelected) ? 'solid' : 'dashed',
    borderColor: isTouchDevice ? undefined : '#F48F0C'
  }), [isTouchDevice, isSelected]);

  return (
    <Box position='relative' w='fit-content'>
      <Box
        rounded='lg'
        cursor='pointer'
        border={`2px solid ${isSelected ? '#F48F0C' : 'transparent'}`}
        _hover={hoverStyle}
        _active={{
          borderStyle: 'solid',
          bg: isSelected ? '#376dcfcc' : undefined
        }}
        onClick={() => onSelected(!isSelected)}
        {...props}
      >
        {children}
      </Box>

      {isSelected && (
        <Box
          position='absolute'
          top={'-12px'}
          // top='-12px'
          right='-10px'
          pe='3px'
        >
          <IconButton
            icon={<CloseIcon boxSize={2} />}
            aria-label='Remove'
            bg='gray.800'
            _hover={{ bg: 'gray.600' }}
            size='xs'
            rounded='full'
            color='white'
            onClick={(e) => {
              e.stopPropagation(); // prevent popover
              onSelected(false);
            }}
          />
        </Box>
      )}
    </Box>
  )
}

interface SelectableImageComponentProps extends SelectableComponentProps {
  image: string;
}

const SelectableImageComponent = ({isSelected, onSelected, image, children, ...props}: SelectableImageComponentProps) => {
  return (
    <SelectableComponent
      isSelected={isSelected}
      onSelected={onSelected}
      {...props}
    >
      <Image
        src={ImageService.translate(image).fixedWidth(100, 100)}
      />
    </SelectableComponent>

  )
}

interface SelectableComponentProps2 extends BoxProps {
  isAvailable: boolean;
  isDisabled: boolean;
  isSelected: boolean;
  children?: ReactNode;
  onSelected: (selected: boolean) => void;
}

const SelectableComponent2 = ({isAvailable, isDisabled, isSelected, onSelected, children, ...props}: SelectableComponentProps2) => {
  const isTouchDevice = useIsTouchDevice();
  const isSelectable = isAvailable && !isDisabled;

  const hoverStyle = useMemo(() => ({
    borderStyle: isTouchDevice || (!isTouchDevice && isSelected) ? 'solid' : 'dashed',
    borderColor: isTouchDevice ? undefined : '#F48F0C'
  }), [isTouchDevice, isSelected]);

  const handleSelect = (state: boolean) => {
    if (isSelectable) {
      onSelected(state);
    }
  }

  return (
    <Box position='relative' w='fit-content'>
      <Box
        rounded='lg'
        cursor={isSelectable ? 'pointer' : undefined}
        p={2}
        bg={isAvailable ? '#376dcf' : '#716A67'}
        border={`2px solid ${isSelected ? '#F48F0C' : 'transparent'}`}
        _hover={isSelectable ? hoverStyle : undefined}
        _active={{
          borderStyle: 'solid',
          bg: isSelected ? '#376dcfcc' : undefined
        }}
        onClick={() => handleSelect(!isSelected)}
        filter={isDisabled ? 'grayscale(80%)' : 'auto'}
        opacity={isDisabled ? 0.5 : 'auto'}
        {...props}
      >
        {children}
      </Box>

      {isSelected && (
        <Box
          position='absolute'
          top={0}
          right={0}
          pe='3px'
        >
          <IconButton
            icon={<CloseIcon boxSize={2} />}
            aria-label='Remove'
            bg='gray.800'
            _hover={{ bg: 'gray.600' }}
            size='xs'
            rounded='full'
            color='white'
            onClick={(e) => {
              e.stopPropagation(); // prevent popover
              handleSelect(false);
            }}
          />
        </Box>
      )}
    </Box>
  )
}


interface SelectableImageComponentProps2 extends SelectableComponentProps2 {
  image: string;
  label?: string;
}

const SelectableImageComponent2 = ({isAvailable, isSelected, onSelected, image, label, children, ...props}: SelectableImageComponentProps2) => {
  return (
    <SelectableComponent2
      isAvailable={isAvailable}
      isSelected={isSelected}
      onSelected={onSelected}
      {...props}
    >
      <Image
        src={ImageService.translate(image).fixedWidth(100, 100)}
      />
      <Box fontSize='xs' ms={1} mt={1} textAlign='end' h='21px'>
        {label}
      </Box>
    </SelectableComponent2>

  )
}
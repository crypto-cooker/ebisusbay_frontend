import {isBundle} from "@market/helpers/utils";


import React, {ReactNode, useState} from "react";
import {
  Box,
  Flex,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  Spacer,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import {DynamicNftImage} from "@src/components-v2/shared/media/dynamic-nft-image";
import {AnyMedia} from "@src/components-v2/shared/media/any-media";
import {nftCardUrl} from "@src/helpers/image";
import ImageService from "@src/core/services/image";
import Slider from "@src/Components/Account/Profile/Inventory/components/Slider";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle} from "@fortawesome/free-regular-svg-icons";
import {faAward, faEllipsisH, faPlusCircle} from "@fortawesome/free-solid-svg-icons";
import {commify} from "ethers/lib/utils";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {darkTheme, lightTheme} from "@src/global/theme/theme";
import NextLink from "next/link";

// interface BaseNftCardProps {
//   name: LinkableDetail;
//   collectionName: LinkableDetail;
//
// }
//
// interface LinkableDetail {
//   value: string;
//   href: string;
// }

enum NftCardMode {
  LINKED, // Click to visit hyperlink
  MULTISELECT, // Click to select
  INTERACTIVE // Click HUD to select, otherwise hyperlink
}

interface SelectState {
  canSelect: boolean;
  amountSelected: number;
  onSelect: (nft: any) => void;
}

interface FooterProps {
  primaryAction: { title: string, icon: IconProp, onClick: () => void };
  menu: any;
}

interface BaseNftCardProps {
  nft: { name: string, nftAddress: string, nftId: string, rank?: string, nfts?: any[] };
  linkTo: false | string;
  mode: NftCardMode;
  selectability: SelectState;
  body: ReactNode;
  footer?: FooterProps;
  listing?: {listingId: string, price: string, currency: string, expirationDate: string};
}

const BaseNftCard = ({nft, mode, selectability, linkTo, body, footer}: BaseNftCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const bgColor = useColorModeValue('#FFF', '#404040')
  const hoverBgColor = useColorModeValue('#FFFFFF', '#404040');
  const borderColor = useColorModeValue('#bbb', '#ffffff33');
  const hoverBorderColor = useColorModeValue('#595d69', '#ddd');
  const url = `/collection/${nft.nftAddress}/${nft.nftId}`;

  const handleBodySelect = (e: any) => {
    if (mode !== NftCardMode.MULTISELECT) return;
    e.stopPropagation();
    selectability?.onSelect(nft);
  }

  const handleHudSelect = () => {
    if (mode !== NftCardMode.INTERACTIVE) return;
    selectability?.onSelect(nft);
  }

  return (
    <Box h='full' data-group>
      <Flex
        direction='column'
        border={selectability?.canSelect && selectability.amountSelected ? '1px solid' : '1px solid'}
        borderColor={borderColor}
        rounded='xl'
        _groupHover={{
          borderColor:hoverBorderColor,
          transition:'0.3s ease',
          bgColor:hoverBgColor
        }}
        boxShadow='5px 5px 20px black'
        backgroundColor={bgColor}
        overflow='hidden'
        h='full'
        cursor={mode > NftCardMode.LINKED ? 'pointer' : 'auto'}
        onClick={handleBodySelect}
      >
        <Box
          width='100%'
          paddingTop='100%'
          position='relative'
          overflow='hidden'
        >
          <Box
            position='absolute'
            top={0}
            left={0}
            bottom={0}
            right={0}
            transform='scale(1.0)'
            transition='0.3s ease'
            roundedTop='xl'
            overflow='hidden'
            _groupHover={{
              transform:'scale(1.1)',
              transition:'0.3s ease',
            }}
          >
            {isBundle(nft.nftAddress) && !!nft.nfts ? (
              <BundleNftImage nfts={nft.nfts} url={url} />
            ) : (
              <NftImage nft={nft} href={linkTo || undefined}/>
            )}
          </Box>

          {!!nft.rank && (
            <HStack
              position='absolute'
              bottom={0}
              right={0}
              spacing={1}
              fontSize='sm'
              m={1}
              bg='#666666AA'
              rounded='md'
              border='1px solid #999999AA'
            >
              <Tag size='md' variant='rank'>
                <TagLeftIcon as={FontAwesomeIcon} icon={faAward} color='red.400' />
                <TagLabel>{commify(nft.rank)}</TagLabel>
              </Tag>
            </HStack>
          )}

          {selectability.canSelect && (
            <Box
              position='absolute'
              p={1}
              top={0}
              left={0}
              w='full'
            >
              <Flex justify='space-between'>
                <Box>

                </Box>
                <Spacer />
                <Box>
                  {selectability.amountSelected > 0 ? (
                    <IconButton
                      aria-label='Remove'
                      variant='unstyled'
                      icon={
                        <Icon
                          as={FontAwesomeIcon}
                          icon={faCheckCircle}
                          size='xl'
                          backgroundColor='dodgerBlue'
                          color='white'
                          border='1px solid white'
                          m={1}
                          rounded='full'
                        />
                      }
                      onClick={handleHudSelect}
                    />
                  ) : (
                    <IconButton
                      aria-label='Add'
                      variant='unstyled'
                      icon={
                        <Icon
                          as={FontAwesomeIcon}
                          icon={faPlusCircle}
                          size='xl'
                          color='gray.300'
                          backgroundColor='white'
                          rounded='full'
                        />
                      }
                      onClick={handleHudSelect}
                      _groupHover={{transition:'0.3s ease', opacity: 1}}
                      transition="0.3s ease"
                      opacity={0}
                      display='inline'
                    />
                  )}
                </Box>
              </Flex>
            </Box>
          )}
        </Box>
        {body}
        {!!footer && (
          <Box
            _groupHover={{background: useColorModeValue(lightTheme.textColor4, darkTheme.textColor4), color:lightTheme.textColor1}}
            px={2}
            py={1}
          >
            <Flex justify='space-between'>
              <Box
                _groupHover={{visibility:'visible'}}
                visibility="hidden"
              >
                {!!footer.primaryAction && (
                  <Box cursor='pointer' onClick={footer.primaryAction.onClick}>
                    <HStack>
                      <Icon as={FontAwesomeIcon} icon={footer.primaryAction.icon} />
                      <Text fontSize="sm" fontWeight="bold" cursor="pointer">{footer.primaryAction.title}</Text>
                    </HStack>
                  </Box>
                )}
              </Box>
              <Spacer />
              {!!footer.menu && (
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<Icon as={FontAwesomeIcon} icon={faEllipsisH} />}
                    size='sm'
                    h='full'
                    variant='unstyled'
                    my='auto'
                  />
                  {footer.menu}
                </Menu>
              )}
            </Flex>
          </Box>
        )}
      </Flex>
    </Box>
  );

  // return (
  //   <Box
  //     className="card eb-nft__card h-100 shadow"
  //     onMouseEnter={() => setIsHovered(true)}
  //     onMouseLeave={() => setIsHovered(false)}
  //     data-group
  //     _hover={{
  //       borderColor:useColorModeValue('#595d69', '#ddd'),
  //     }}
  //   >
  //     <Box
  //       _groupHover={{
  //         background:useColorModeValue('#FFFFFF', '#404040'),
  //         transition:'0.3s ease'
  //       }}
  //       borderRadius='15px'
  //       transition="0.3s ease"
  //       height="100%"
  //     >
  //
  //       <Flex direction="column" height="100%">
  //         <Box className="card-img-container">
  //           {mode === NftCardMode.INTERACTIVE && selectability.canSelect && (
  //             <>
  //               {selectability.isSelected ? (
  //                 <Box
  //                   top={0}
  //                   right={0}
  //                   position="absolute"
  //                   zIndex={2}
  //                   p={2}
  //                   cursor="pointer"
  //                   onClick={selectability.onSelect}
  //                 >
  //                   <FontAwesomeIcon icon={faCheckCircle} size="xl" style={{background:'dodgerblue', color:'white'}} className="rounded-circle"/>
  //                 </Box>
  //               ) : (
  //                 <Box
  //                   _groupHover={{display:'inline', transition:'0.3s ease', opacity: 1}}
  //                   transition="0.3s ease"
  //                   display="inline"
  //                   opacity={0}
  //                   top={0}
  //                   right={0}
  //                   position="absolute"
  //                   zIndex={2}
  //                   p={2}
  //                   cursor="pointer"
  //                   onClick={selectability.onSelect}
  //                 >
  //                   <FontAwesomeIcon icon={faPlusCircle} size="xl" style={{background:'white', color:'grey'}} className="rounded-circle" />
  //                 </Box>
  //               )}
  //             </>
  //           )}
  //           <Box
  //             _groupHover={{transform:'scale(1.05)', transition:'0.3s ease'}}
  //             transition="0.3s ease"
  //             transform="scale(1.0)"
  //           >
  //             {isBundle(nft.address ?? nft.nftAddress) ? (
  //               <BundleNftImage nfts={nft.nfts} url={url} />
  //             ) : (
  //               <NftImage nft={nft} />
  //             )}
  //           </Box>
  //         </Box>
  //         {rank && <div className="badge bg-rarity text-wrap mt-1 mx-1">Rank: #{rank}</div>}
  //         <Flex direction='column' justify='space-between' px={2} py={1}>
  //           <div className="mt-auto">
  //             <span onClick={() => navigateTo(nftUrl)} style={{cursor: 'pointer'}}>
  //               {nft.balance && nft.balance > 1 ? (
  //                 <Heading as="h6" size="sm">
  //                   {nft.name} (x{nft.balance})
  //                 </Heading>
  //               ) : (
  //                 <Heading as="h6" size="sm">{nft.name}</Heading>
  //               )}
  //             </span>
  //           </div>
  //         </Flex>
  //       </Flex>
  //     </Box>
  //   </Box>
  // )
}

const NftImage = ({nft, href}: { nft: any, href?: string }) => {
  return (
    <DynamicNftImage nft={nft} address={nft.address ?? nft.nftAddress} id={nft.id ?? nft.nftId}>
      <AnyMedia
        image={nftCardUrl(nft.address ?? nft.nftAddress, nft.image)}
        className={`card-img-top`}
        title={nft.name}
        url={href}
        width={440}
        height={440}
        video={nft.video ?? nft.animationUrl ?? nft.animation_url}
        thumbnail={!!nft.video || !!nft.animationUrl || !!nft.animation_url ? ImageService.translate(nft.video ?? nft.animationUrl ?? nft.animation_url).thumbnail() : undefined}
        usePlaceholder={true}
      />
    </DynamicNftImage>
  )
}

const BundleNftImage = ({nfts, url}: {nfts: any[], url: string}) => {
  return (
    <Slider size={nfts?.length}>
      {nfts?.map((currentNft)=> (
        <Box
          _groupHover={{ transform: 'scale(1.05)', transition: '0.3s ease' }}
          transition="0.3s ease"
          transform="scale(1.0)"
        >
          <AnyMedia
            image={nftCardUrl(currentNft.address, currentNft.image)}
            className={`card-img-top`}
            title={currentNft.title}
            url={url}
            width={440}
            height={440}
            video={currentNft.video ?? currentNft.animationUrl ?? currentNft.animation_url}
            thumbnail={!!currentNft.video || !!currentNft.animationUrl || !!currentNft.animation_url ? ImageService.translate(currentNft.video ?? currentNft.animationUrl ?? currentNft.animation_url).thumbnail() : undefined}
            usePlaceholder={true}
          />
        </Box>
      ))}
    </Slider>
  )
}

interface LinkableNftCardProps {
  nft: any;
  body?: ReactNode;
}

export const LinkableNftCard = ({nft}: LinkableNftCardProps) => {

  return (
    <BaseNftCard
      nft={nft}
      linkTo={`/collection/${nft.nftAddress}/${nft.nftId}`}
      mode={NftCardMode.LINKED}
      selectability={{
        canSelect: false,
        amountSelected: 0,
        onSelect: () => {console.log('click')}
      }}
      body={
        <Box p={2} fontSize='sm'>
          {/*<Link as={NextLink} href={`/collection/${nft.nftAddress}/`} fontSize='xs'>*/}
          {/*  <VerifiedTitle title={token.collection.name} verified={token.collection.verified} checkSize='md' />*/}
          {/*</Link>*/}
          <NextLink href={`/nft/${nft.nftAddress}/`}>
            {nft.amount && nft.amount > 1 ? (
              <Text fontWeight='bold'>{nft.name} (x{nft.amount})</Text>
            ) : (
              <Text fontWeight='bold'>{nft.name}</Text>
            )}
          </NextLink>
        </Box>
      }
      footer={undefined}
    />
  )
}

interface SelectableNftCardProps {
  nft: any;
  body?: ReactNode;
  onSelect: (nft: any) => void;
  amountSelected: number;
}
const SelectableNftCard = ({ nft, body, amountSelected, onSelect }: SelectableNftCardProps) => {
  return (
    <BaseNftCard
      nft={nft}
      linkTo={false}
      mode={NftCardMode.MULTISELECT}
      selectability={{
        canSelect: true,
        amountSelected: amountSelected,
        onSelect: onSelect
      }}
      body={body ??
        <Box p={2} fontSize='sm'>
          {/*<Link as={NextLink} href={`/collection/${nft.nftAddress}/`} fontSize='xs'>*/}
          {/*  <VerifiedTitle title={token.collection.name} verified={token.collection.verified} checkSize='md' />*/}
          {/*</Link>*/}
          {/*<NextLink href={`/nft/${nft.nftAddress}/`}>*/}
          {nft.amount && nft.amount > 1 ? (
            <Text fontWeight='bold'>{nft.name} (x{nft.amount})</Text>
          ) : (
            <Text fontWeight='bold'>{nft.name}</Text>
          )}
          {/*</NextLink>*/}
        </Box>
      }
      footer={undefined}
    />
  )
}

export const DealNftCard = ({ nft, amountSelected, onSelect }: {nft: any, amountSelected: number, onSelect: (nft: any) => void}) => {
  return (
    <SelectableNftCard
      nft={nft}
      body={
        <Box p={2} fontSize='sm'>
          {nft.amount && nft.amount > 1 ? (
            <Text fontWeight='bold'>{nft.name} (x{nft.amount})</Text>
          ) : (
            <Text fontWeight='bold'>{nft.name}</Text>
          )}
        </Box>
      }
      onSelect={onSelect}
      amountSelected={amountSelected}
    />
  )
}

const InventoryNftCard = ({ nft }: {nft: any}) => {
  return (
    <LinkableNftCard
      nft={nft}
      body={
        <Box p={2} fontSize='sm'>
          {nft.amount && nft.amount > 1 ? (
            <Text fontWeight='bold'>{nft.name} (x{nft.amount})</Text>
          ) : (
            <Text fontWeight='bold'>{nft.name}</Text>
          )}
        </Box>
      }
    />
  )
}


const CollectionNftCard = ({ nft }: {nft: any}) => {
  return (
    <LinkableNftCard
      nft={nft}
      body={
        <Box p={2} fontSize='sm'>
          <Text fontWeight='bold'>{nft.name}</Text>
        </Box>
      }
    />
  )
}
import React, {memo, ReactNode} from 'react';
import Blockies from 'react-blockies';
import {faCheck, faCircle, faExternalLink} from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

import LayeredIcon from '../../Components/components/LayeredIcon';
import {Box, Heading, Icon, Text, useColorModeValue} from "@chakra-ui/react";
import {useRouter} from "next/router";
import ImageService from "@src/core/services/image";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const VerifiedIcon = styled.span`
  font-size: 10px;
  color: #ffffff;
  background: $color;
  border-radius: 100%;
  -moz-border-radius: 100%;
  -webkit-border-radius: 100%;
  position: absolute;
  bottom: 2px;
  right: 2px;
`;

interface CustomSlideProps {
  index: number;
  avatar?: string;
  banner: string;
  title: string;
  subtitle?: ReactNode | string;
  collectionId?: string;
  url: string;
  verified: boolean;
  externalPage?: boolean;
  contextComponent?: any;
}

const PreviewCard = ({ index, avatar, banner, title, subtitle, collectionId, url, verified, externalPage = false, contextComponent }: CustomSlideProps) => {
  const router = useRouter();
  const hoverBgColor = useColorModeValue('#FFFFFF', '#404040');

  const navigateTo = (url: string) => {
    if (url && typeof window !== 'undefined') {
      if (externalPage) {
        window.open(url, '_blank');
      } else {
        router.push(url)
      }
    }
  };

  return (
    <Box key={index} h="100%">
      <Box className="nft_coll cursor-pointer h-100" _hover={{
        backgroundColor: hoverBgColor
      }} shadow="lg">
        <Box className="nft_wrap position-relative">
          <span onClick={() => navigateTo(url)}>
            <img src={ImageService.translate(banner).bannerPreview()} className="lazy img-fluid w-100" alt={title} />
          </span>
          {contextComponent && (
            <div className="position-absolute top-0 end-0 m-2">
              {contextComponent}
            </div>
          )}
        </Box>
        <Box className="nft_coll_pp" onClick={() => navigateTo(url)}>
          {avatar || collectionId ? (
            <span>
              {avatar ? (
                <img className="lazy" src={ImageService.translate(avatar).avatar()} alt={title} />
              ) : (
                <Blockies seed={collectionId ?? ''} size={10} scale={6} />
              )}
              {verified && (
                <VerifiedIcon>
                  <LayeredIcon icon={faCheck} bgIcon={faCircle} shrink={7} />
                </VerifiedIcon>
              )}
            </span>
          ) : (
            <Box h="30px"></Box>
          )}
        </Box>
        <Box className="nft_coll_info" onClick={() => navigateTo(url)}>
          <span>
            <Heading as="h4" size="md">
              <>{title}</>
              {externalPage && (
                <Icon as={FontAwesomeIcon} icon={faExternalLink} ms={1} fontSize='sm' className='text-muted'/>
              )}
            </Heading>
          </span>
          {typeof subtitle === 'string' ? (
            <Text noOfLines={3} fontSize="14px" px={2}>{subtitle}</Text>
          ) : (
            <>{subtitle}</>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default memo(PreviewCard);

import React from 'react';
import Blockies from 'react-blockies';
import Link from 'next/link';
import styled from 'styled-components';
import {faCheck, faCircle} from '@fortawesome/free-solid-svg-icons';

import LayeredIcon from '../../../Components/components/LayeredIcon';
import ImageService from "@src/core/services/image";
import useGetProfilePreview from "@src/hooks/useGetUsername";
import {shortAddress} from "@src/utils";
import {Image} from "@chakra-ui/react";

const VerifiedIcon = styled.span`
  font-size: 8px;
  color: #ffffff;
  background: $color;
  border-radius: 100%;
  -moz-border-radius: 100%;
  -webkit-border-radius: 100%;
  position: absolute;
  bottom: 0px;
  right: 0px;
  z-index: 2;
`;

interface NftProfilePreviewProps {
  title: string;
  address: string;
}

const NftProfilePreview = ({ title, address }: NftProfilePreviewProps) => {
  const {username, avatar, verified, isLoading} = useGetProfilePreview(address);

  return (
    <div className="col">
      {title && <h6>{title}</h6>}
      <div className="item_author">
        <Link href={`/account/${address}`}>
          <div className="author_list_pp">
            {!isLoading && avatar ? (
              <Image
                src={ImageService.translate(avatar).avatar()}
                alt={username ?? address}
                w={50}
                h={50}
                objectFit='cover'
              />
            ) : (
              <Blockies seed={address.toLowerCase()} size={10} scale={5} />
            )}
            {verified && (
              <VerifiedIcon>
                <LayeredIcon icon={faCheck} bgIcon={faCircle} shrink={8} />
              </VerifiedIcon>
            )}
          </div>
          <div className="author_list_info">
            <span>{isLoading ? shortAddress(address) : username}</span>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default NftProfilePreview
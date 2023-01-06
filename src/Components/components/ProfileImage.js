import React from 'react';
import Blockies from 'react-blockies';
import { useQuery } from "@tanstack/react-query";
import Link from 'next/link';
import styled from 'styled-components';
import { faCheck, faCircle } from '@fortawesome/free-solid-svg-icons';

import LayeredIcon from './LayeredIcon';
import { ImageKitService } from "@src/helpers/image";
import { shortAddress } from '@src/utils';
import { getProfile } from "@src/core/cms/endpoints/profile";

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


const ProfileImage = ({ title, displayName, address = '' }) => {

  const { isLoading, data } = useQuery(['user', address], () =>
    getProfile(address)
  )

  return (
    <div className="col">
      {title && <h6>{title}</h6>}
      <div className="item_author">
        <Link href={`/account/${address}`}>
          <a>
            <div className="author_list_pp">
              {!isLoading && data?.data?.profilePicture ? (
                <img src={ImageKitService.buildAvatarUrl(data?.data?.profilePicture)} alt={data?.data?.username ? data?.data?.username : shortAddress(address)} />
              ) : (
                <Blockies seed={address} size={10} scale={5} style={{ width: '10px' }} />
              )}
              {data?.data?.isVerified && (
                <VerifiedIcon>
                  <LayeredIcon icon={faCheck} bgIcon={faCircle} shrink={8} />
                </VerifiedIcon>
              )}
            </div>
            {displayName && <div className="author_list_info">
              <span>{data?.data?.username ? data?.data?.username : shortAddress(address)}</span>
            </div>}
          </a>
        </Link>
      </div>
    </div>
  )
}

export default ProfileImage
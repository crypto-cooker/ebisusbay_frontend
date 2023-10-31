import React, {memo} from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import Blockies from 'react-blockies';
import {faCheck, faCircle} from '@fortawesome/free-solid-svg-icons';

import LayeredIcon from '../../../Components/components/LayeredIcon';

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

interface NftPropertyLabelProps {
  label: string;
  value: string;
  avatar?: string;
  address?: string;
  verified?: boolean;
  to: string;
  hover?: string;
  pop?: boolean;
}

const NftPropertyLabel = ({label, value, avatar, address, verified, to, hover, pop}: NftPropertyLabelProps) => {

  const AvatarElement = (
    <>
      {(avatar || address) && (
        <div className="author_list_pp">
          <span>
            {!!avatar ? (
              <img className="lazy" src={avatar} alt={value} title={hover} />
            ) : !!address && (
              <Blockies seed={address.toLowerCase()} size={10} scale={5} />
            )}
            {verified && (
              <VerifiedIcon>
                <LayeredIcon icon={faCheck} bgIcon={faCircle} shrink={8} />
              </VerifiedIcon>
            )}
          </span>
        </div>
      )}
      <div className="author_list_info">
        <span>{value}</span>
      </div>
    </>
  );

  const Hyperlink = ({ url }: { url: string }) => {
    if (url) {
      if (url.startsWith('http')) {
        return (
          <a href={url} target={pop ? '_blank' : '_self'} rel="noreferrer">
            {' '}
            {AvatarElement}{' '}
          </a>
        );
      } else {
        return (
          <Link href={url}>
            {AvatarElement}
          </Link>
        );
      }
    } else {
      return <div> {AvatarElement} </div>;
    }
  };

  return (
    <div className="col">
      <h6>{label}</h6>
      <div className="item_author">
        <Hyperlink url={to} />
      </div>
    </div>
  );
};

export default memo(NftPropertyLabel);

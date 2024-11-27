import React, { memo } from 'react';
import { faBook, faCopy, faGlobe, faRocket } from '@fortawesome/free-solid-svg-icons';
import { faDiscord, faInstagram, faMedium, faTelegram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import LayeredIcon from '../components/LayeredIcon';
import { toast } from 'react-toastify';
import {buildInstagramUrl, buildTwitterUrl, isCrosmocraftsCollection, isCrosmocraftsPartsCollection} from '@market/helpers/utils';
import {useClipboard} from "@chakra-ui/react";

const SocialsBar = ({ address, socials, showCopy = true, size = '5px' }) => {
  const { website, twitter, discord, telegram, instagram, medium, gitbook } = socials || {};
  const { onCopy } = useClipboard(address);

  const handleCopy = () => {
    onCopy();
    toast.success('Address Copied!');
  };

  return (
    <div>
      {website && (
        <a href={website} target="_blank" rel="noreferrer" title="View Website">
          <LayeredIcon icon={faGlobe} />
        </a>
      )}
      {twitter && (
        <a href={buildTwitterUrl(twitter)} target="_blank" rel="noreferrer" title="View Twitter">
          <LayeredIcon icon={faTwitter} />
        </a>
      )}
      {discord && (
        <a href={discord} target="_blank" rel="noreferrer" title="View Discord">
          <LayeredIcon icon={faDiscord} />
        </a>
      )}
      {telegram && (
        <a href={telegram} target="_blank" rel="noreferrer" title="View Telegram">
          <LayeredIcon icon={faTelegram} />
        </a>
      )}
      {instagram && (
        <a href={buildInstagramUrl(instagram)} target="_blank" rel="noreferrer" title="View Telegram">
          <LayeredIcon icon={faInstagram} />
        </a>
      )}
      {medium && (
        <a href={medium} target="_blank" rel="noreferrer" title="View Medium">
          <LayeredIcon icon={faMedium} />
        </a>
      )}
      {(isCrosmocraftsPartsCollection(address) || isCrosmocraftsCollection(address)) && (
        <a href="/build-ship" title="Build a Crosmocraft!">
          <LayeredIcon icon={faRocket} />
        </a>
      )}
      {gitbook && (
        <a href={gitbook} target="_blank" rel="noreferrer" title="View Gitbook">
          <LayeredIcon icon={faBook} />
        </a>
      )}
      {showCopy && address && (
        <span onClick={handleCopy} style={{ cursor: 'pointer' }} title="Copy Address">
          <LayeredIcon icon={faCopy} />
        </span>
      )}
    </div>
  );
};

export default memo(SocialsBar);

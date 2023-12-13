import React from 'react';
import Blockies from 'react-blockies';
import { faCheck, faCircle } from '@fortawesome/free-solid-svg-icons';

import LayeredIcon from '@src/Components/components/LayeredIcon';
import styles from './avatar.module.scss';
import {Box} from "@chakra-ui/react";

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

interface AvatarProps {
  src?: string;
  alt?: string;
  address?: string;
  isVerified?: boolean;
}

export default function Avatar({ src, alt = 'pfp', address = ZERO_ADDRESS, isVerified = false }: AvatarProps) {
  return (
    <Box maxW='200px' className={styles.avatar}>
      <Box className={styles.pfp}>
        {src ? <img src={src} alt={alt} /> : <Blockies seed={address?.toLowerCase()} size={15} scale={10} />}
        {isVerified && <LayeredIcon icon={faCheck} bgIcon={faCircle} shrink={8} stackClass={styles.avatar_badge} />}
      </Box>
    </Box>
  );
}

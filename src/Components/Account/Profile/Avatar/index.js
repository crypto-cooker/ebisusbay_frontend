import React from 'react';
import Blockies from 'react-blockies';
import { faCheck, faCircle } from '@fortawesome/free-solid-svg-icons';

import LayeredIcon from '@src/Components/components/LayeredIcon';
import styles from './avatar.module.scss';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export default function Avatar({ src, alt = 'pfp', address = ZERO_ADDRESS, isVerified = false }) {
  return (
    <div className={styles.avatar}>
      <div className={styles.pfp}>
        {src ? <img src={src} alt={alt} /> : <Blockies seed={address.toLowerCase()} size={15} scale={10} />}
        {isVerified && <LayeredIcon icon={faCheck} bgIcon={faCircle} shrink={8} stackClass={styles.avatar_badge} />}
      </div>
    </div>
  );
}

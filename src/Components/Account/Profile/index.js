import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { faDiscord, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faSquare, faGlobe } from '@fortawesome/free-solid-svg-icons';
import Button from '@src/Components/components/common/Button';
import LayeredIcon from '@src/Components/components/LayeredIcon';
import Avatar from './Avatar';
import useGetSettings from '../Settings/hooks/useGetSettings';

import styles from './profile.module.scss';

export default function Profile({ slug }) {
  const user = useSelector((state) => state.user);
  const userData = useGetSettings(slug);
  const router = useRouter();

  const navigateTo = (route) => {
    router.push(route);
  };

  const isMyProfile = (connectedAddress, profileAddress) => {
    if (connectedAddress && profileAddress) return connectedAddress.toLowerCase() === profileAddress.toLowerCase();
    return false;
  };

  useEffect(() => {
    if (userData && user?.address && !userData.isLoading && !userData.response) {
      router.push('/');
    }
  }, [userData, user]);

  return (
    <div className={styles.profile}>
      <img src="/img/background/header-dark.webp" alt="banner" className="banner" />
      <div className={`${styles.userInfo} row`}>
        <div className="col-lg-2">
          <Avatar src="/img/avatar.jpg" />
        </div>
        <div className="col-lg-8">
          <div className={styles.username}>{userData?.response?.cnsName}</div>
          <div className={styles.bio}>{userData?.response?.bio}</div>
          <div className={styles.socials}>
            {userData?.response?.twitter && (
              <div>
                <a href={`https://twitter.com/${userData?.response?.twitter}`} target="_blank" rel="noreferrer">
                  <LayeredIcon icon={faTwitter} bgIcon={faSquare} shrink={7} />
                </a>
              </div>
            )}
            {userData?.response?.instagram && (
              <div>
                <a href={`https://www.instagram.com/${userData?.response?.instagram}`} target="_blank" rel="noreferrer">
                  <LayeredIcon icon={faInstagram} bgIcon={faSquare} shrink={7} />
                </a>
              </div>
            )}
            {userData?.response?.discord && (
              <div>
                <a href={`https://discord.gg/${userData?.response?.discord}`} target="_blank" rel="noreferrer">
                  <LayeredIcon icon={faDiscord} bgIcon={faSquare} shrink={8} />
                </a>
              </div>
            )}
            {userData?.response?.website && (
              <div>
                <a href={`${userData?.response?.website}`} target="_blank" rel="noreferrer">
                  <LayeredIcon icon={faGlobe} bgIcon={faSquare} shrink={8} />
                </a>
              </div>
            )}
          </div>
        </div>
        {isMyProfile(user?.address, userData?.response?.walletAddress) && (
          <div className="col-lg-2">
            <Button onClick={() => navigateTo('/account/settings/profile')}>Profile Settings</Button>
          </div>
        )}
      </div>
    </div>
  );
}

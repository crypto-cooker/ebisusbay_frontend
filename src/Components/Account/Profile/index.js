import { faDiscord, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faSquare, faGlobe } from '@fortawesome/free-solid-svg-icons';
import Button from '@src/Components/components/common/Button';
import LayeredIcon from '@src/Components/components/LayeredIcon';
import Avatar from './Avatar';

import styles from './profile.module.scss';

export default function Profile() {
  return (
    <div className={styles.profile}>
      <img src="/img/background/header-dark.webp" alt="banner" className="banner" />
      <div className={`${styles.userInfo} row`}>
        <div className="col-lg-2">
          <Avatar src="/img/avatar.jpg" />
        </div>
        <div className="col-lg-8">
          <div>Become a Verified Creator</div>
          <div className={styles.username}>DisplayName.cro</div>
          <div className={styles.bio}>
            Ebisu's Bay is the first and largest NFT marketplace on Cronos. Create, buy, sell, trade and enjoy the
            #CroFam NFT community. Ebisu's Bay is the first and largest NFT marketplace on Cronos. Create, buy, sell,
            trade and enjoy the #CroFam NFT community.
          </div>
          <div className={styles.socials}>
            <div>
              <a href="https://twitter.com/EbisusBay" target="_blank" rel="noreferrer">
                <LayeredIcon icon={faTwitter} bgIcon={faSquare} shrink={7} />
              </a>
            </div>
            <div>
              <a href="https://www.instagram.com/ebisusbayofficial" target="_blank" rel="noreferrer">
                <LayeredIcon icon={faInstagram} bgIcon={faSquare} shrink={7} />
              </a>
            </div>
            <div>
              <a href="https://discord.gg/ebisusbay" target="_blank" rel="noreferrer">
                <LayeredIcon icon={faDiscord} bgIcon={faSquare} shrink={8} />
              </a>
            </div>
            <div>
              <a href="https://discord.gg/ebisusbay" target="_blank" rel="noreferrer">
                <LayeredIcon icon={faGlobe} bgIcon={faSquare} shrink={8} />
              </a>
            </div>
          </div>
        </div>
        <div className="col-lg-2">
          <Button>Profile Settings</Button>
        </div>
      </div>
    </div>
  );
}

import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';

import styles from './banner.module.scss';

export default function Banner() {
  return (
    <div className={styles.banner}>
      <div className={classnames('d-flex align-items-center', styles.label)}>
        Banner <FontAwesomeIcon icon={faExclamation} className="cursor-pointer ms-2" size="xs" />
      </div>
      <img src="/img/background/banner-dark.webp" width="100%" height="203" alt="Profile Banner" className="rounded" />
    </div>
  );
}

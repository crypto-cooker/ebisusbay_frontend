import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';

export default function Banner() {
  return (
    <div>
      <div className="mb-3">
        Banner <FontAwesomeIcon icon={faExclamation} className="cursor-pointer" />
      </div>
      <img src="/img/background/banner-dark.webp" width="413" height="203" alt="Profile Banner" className="rounded" />
    </div>
  );
}

import { useSelector } from 'react-redux';
import Blockies from 'react-blockies';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenSquare, faCopy } from '@fortawesome/free-solid-svg-icons';

import { shortAddress } from '../../../../../utils';

export default function Pfp() {
  const user = useSelector((state) => state.user);
  const getUserName = (address) => {
    if (address) {
      return shortAddress(address);
    }
  };

  return (
    <div className="d-flex justify-content-center position-relative mb-5">
      <div className="text-center">
        <div className="icon-edit position-absolute top-0 end-0">
          <FontAwesomeIcon icon={faPenSquare} className="cursor-pointer" />
        </div>
        <Blockies seed={user?.address} size={25} scale={5} />
        <div className="mt-3">
          <span className="me-2">Ebisusbay.com/{getUserName(user?.address)}</span>
          <FontAwesomeIcon icon={faCopy} className="cursor-pointer" />
        </div>
      </div>
    </div>
  );
}

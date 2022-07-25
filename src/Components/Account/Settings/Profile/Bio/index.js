import { InputGroup, FormControl } from 'react-bootstrap';
import classnames from 'classnames';

import styles from './bio.module.scss';

export default function Bio({ value, handleChange }) {
  return (
    <div className={classnames('mt-3', styles.bio)}>
      <div className={classnames('d-flex align-items-center', styles.label)}>Bio</div>
      <div>
        <InputGroup>
          <FormControl
            as="textarea"
            aria-label="textarea"
            rows="5"
            placeholder="Enter Text"
            onChange={handleChange}
            value={value}
            name="userInfo.userInfo.bio"
          />
        </InputGroup>
      </div>
    </div>
  );
}

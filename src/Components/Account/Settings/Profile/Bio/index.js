import {InputGroup, FormControl, Form} from 'react-bootstrap';
import classnames from 'classnames';

import styles from './bio.module.scss';

export default function Bio({ value, handleChange, error }) {
  return (
    <div className={classnames('my-3', error ? 'field-message-error' : undefined, styles.bio)}>
      <div className={classnames('d-flex align-items-center', styles.label)}>Bio</div>
      <div>
        <InputGroup>
          <FormControl
            as="textarea"
            aria-label="textarea"
            rows="5"
            placeholder="Introduce yourself"
            onChange={handleChange}
            value={value}
            name="userInfo.userInfo.bio"
            description="Max 100 characters"
            className="mb-0"
          />
        </InputGroup>
        <Form.Text className="field-description text-muted">{error ?? 'Max 100 characters'}</Form.Text>
      </div>

    </div>
  );
}

import { Form } from 'react-bootstrap';

import styles from './item.module.scss';

export default function NotificationItem({ title, description }) {
  return (
    <div className={styles.item}>
      <div className="d-flex align-items-center justify-content-between">
        <h2>{title}</h2>
        <Form.Switch />
      </div>
      <div>{description}</div>
    </div>
  );
}

import { Form } from 'react-bootstrap';

import styles from './item.module.scss';

export default function AdminRow({ title, date, blacklistedBy }) {
  return (
    <div className={styles.item}>
      <div className="d-flex align-items-center justify-content-between">
        <h2>{title}</h2>
        <div>{date}</div>
        <div>{blacklistedBy}</div>
      </div>
    </div>
  );
}

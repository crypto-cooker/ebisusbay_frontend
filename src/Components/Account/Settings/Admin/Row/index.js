import styles from './item.module.scss';

export default function AdminRow({ title, date, blacklistedBy }) {
  return (
    <div className={styles.item}>
      <div className="d-flex align-items-center justify-content-between">
        <div>{title}</div>
        <div>{date}</div>
        <div>{blacklistedBy}</div>
      </div>
    </div>
  );
}

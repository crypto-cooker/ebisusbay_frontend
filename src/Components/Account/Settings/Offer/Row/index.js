import styles from './item.module.scss';

export default function OfferRow({ title, floor }) {
  return (
    <div className={styles.item}>
      <div className="d-flex align-items-center justify-content-between">
        <h2>{title}</h2>
      </div>
      <div>{floor} cro</div>
    </div>
  );
}

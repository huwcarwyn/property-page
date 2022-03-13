import styles from "./Table.module.scss";

export function Table(props) {
  return <table className={styles.table} {...props} />;
}

export function TableRow(props) {
  return <tr className={styles.tableRow} {...props} />;
}

export function TableHeadCell(props) {
  return <th className={styles.tableHeadCell} {...props} />;
}

export function TableBody(props) {
  return <tbody {...props} />;
}

export function TableCell(props) {
  return <td className={styles.tableCell} {...props} />;
}

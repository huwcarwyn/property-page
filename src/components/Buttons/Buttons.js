import styles from "./Buttons.module.scss";

export function Button(props) {
  return <button className={styles.button} {...props} />;
}

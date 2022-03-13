import styles from "./Inputs.module.scss";

export function TextInput({ onChange, ...props }) {
  return (
    <input
      type="text"
      className={styles.textInput}
      onChange={(e) => onChange(e.target.value)}
      {...props}
    />
  );
}

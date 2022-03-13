import logo from "src/logo.svg";

import styles from "./AppHeader.module.scss";

export function AppHeader() {
  return (
    <div className={styles.header}>
      <div className={`container ${styles.headerInner}`}>
        <img src={logo} className={styles.logo} alt="IMMO logo" />

        <h1 className={styles.pageTitle}>Property search tool</h1>
      </div>
    </div>
  );
}

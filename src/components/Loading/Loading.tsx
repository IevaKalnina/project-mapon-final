import React from "react";
import styles from "./loading.module.scss";

const Loading: React.FC<{ message?: string }> = ({
  message = "Loading...",
}) => {
  return <div className={styles.loading}>{message}</div>;
};

export default Loading;

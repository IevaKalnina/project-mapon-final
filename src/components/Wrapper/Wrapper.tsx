import React, { ReactNode, FC } from "react";
import styles from "./wrapper.module.scss";

interface WrapperProps {
  children: ReactNode;
}

const Wrapper: FC<WrapperProps> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export default Wrapper;

// src/components/Footer/Footer.tsx
import React from "react";
import styles from "./footer.module.scss";

interface FooterProps {
  disabled: boolean;
}

const Footer: React.FC<FooterProps> = ({ disabled }) => {
  return (
    <div className={styles.footer}>
      <button className={styles.button} type="submit" disabled={disabled}>
        GENERATE
      </button>
    </div>
  );
};

export default Footer;

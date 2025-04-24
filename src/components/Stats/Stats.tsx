import React from "react";
import styles from "./stats.module.scss";

export interface Stat {
  label: string;
  value: string | number;
}

interface StatsProps {
  stats: Stat[];
}

const Stats: React.FC<StatsProps> = ({ stats }) => {
  return (
    <div className={styles.container}>
      {stats.map((stat, idx) => (
        <div key={idx} className={styles.item}>
          <span className={styles.value}>{stat.value}</span>
          <span className={styles.label}>{stat.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Stats;

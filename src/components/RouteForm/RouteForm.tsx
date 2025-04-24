import React, { useState, useRef, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "./routeForm.module.scss";

export interface Vehicle {
  unit_id: number;
  number: string;
  label: string;
}

interface RouteFormProps {
  vehicles: Vehicle[];
  onGenerate: (number: string, from: Date, to: Date) => void;
}

export const RouteForm: React.FC<RouteFormProps> = ({
  vehicles,
  onGenerate,
}) => {
  const [selectedNumber, setSelectedNumber] = useState<string>("");
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);

  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (fromRef.current && !fromRef.current.contains(e.target as Node)) {
        setShowFrom(false);
      }
      if (toRef.current && !toRef.current.contains(e.target as Node)) {
        setShowTo(false);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div className={styles.form}>
      <h2>Route report</h2>

      <div className={styles.row}>
        <label>Vehicle number*</label>
        <select
          className={styles.dropdown}
          value={selectedNumber}
          onChange={(e) => setSelectedNumber(e.target.value)}
        >
          <option value="" disabled>
            Select vehicle
          </option>
          {vehicles.map((v) => (
            <option key={v.unit_id} value={v.number}>
              {v.number}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.row}>
        <label>Period</label>
        <div className={styles.calendarConatiner}>
          <div ref={fromRef}>
            <span>From</span>
            <input
              className={styles.calendarInput}
              readOnly
              value={fromDate.toLocaleDateString()}
              onClick={() => setShowFrom(true)}
            />
            {showFrom && (
              <Calendar
                className={styles.calendar}
                value={fromDate}
                onChange={(val) => {
                  if (val instanceof Date) {
                    setFromDate(val);
                    setShowFrom(false);
                  }
                }}
              />
            )}
          </div>
          <div ref={toRef}>
            <span>To</span>
            <input
              className={styles.calendarInput}
              readOnly
              value={toDate.toLocaleDateString()}
              onClick={() => setShowTo(true)}
            />
            {showTo && (
              <Calendar
                className={styles.calendar}
                value={toDate}
                onChange={(val) => {
                  if (val instanceof Date) {
                    setToDate(val);
                    setShowTo(false);
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>

      <div>
        <button
          disabled={!selectedNumber}
          onClick={() => onGenerate(selectedNumber, fromDate, toDate)}
        >
          GENERATE
        </button>
      </div>
    </div>
  );
};

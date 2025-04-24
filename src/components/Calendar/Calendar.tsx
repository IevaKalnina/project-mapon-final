import React, { useState, useRef, useEffect } from "react";
import { Controller, Control } from "react-hook-form";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "./calendar.module.scss";

interface CalendarPickerProps {
  label: string;
  name: string;
  control: Control<any>;
  value: Date;
  minDate?: Date;
  maxDate?: Date;
}

const CalendarPicker: React.FC<CalendarPickerProps> = ({
  label,
  name,
  control,
  value,
  minDate,
  maxDate,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target as Node)
      ) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className={styles.dateWrapper} ref={calendarRef}>
      <span className={styles.dateLabel}>{label}</span>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange } }) => (
          <div className={styles.inputWrapper}>
            <input
              readOnly
              className={styles.calendarInput}
              value={value.toLocaleDateString()}
              onClick={() => setShowCalendar(true)}
            />
            <span className={styles.calendarIcon}>📅</span>
            {showCalendar && (
              <div className={styles.calendarPopover}>
                <Calendar
                  value={value}
                  minDate={minDate}
                  maxDate={maxDate}
                  onChange={(d) => {
                    if (d instanceof Date) {
                      onChange(d);
                      setShowCalendar(false);
                    }
                  }}
                />
              </div>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default CalendarPicker;

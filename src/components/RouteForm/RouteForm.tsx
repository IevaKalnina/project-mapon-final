import React from "react";
import { useFormContext } from "react-hook-form";
import Dropdown, { Vehicle } from "../Dropdown/Dropdown";
import CalendarPicker from "../Calendar/Calendar";
import styles from "./routeForm.module.scss";

export type FormValues = {
  number: string;
  fromDate: Date;
  toDate: Date;
};

interface RouteFormProps {
  vehicles: Vehicle[];
}

const oneMonthAfter = (date: Date) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1);
  return d;
};

const oneMonthBefore = (date: Date) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() - 1);
  return d;
};

const RouteForm: React.FC<RouteFormProps> = ({ vehicles }) => {
  const { register, control, watch } = useFormContext<FormValues>();

  const fromDate = watch("fromDate");
  const toDate = watch("toDate");

  return (
    <div className={styles.form}>
      <h2>Route report</h2>

      <Dropdown vehicles={vehicles} register={register} name="number" />

      <div className={styles.row}>
        <label>Period</label>
        <div className={styles.calendarContainer}>
          <CalendarPicker
            label="From"
            name="fromDate"
            control={control}
            value={fromDate}
            minDate={toDate ? oneMonthBefore(toDate) : undefined}
            maxDate={toDate}
          />

          <CalendarPicker
            label="To"
            name="toDate"
            control={control}
            value={toDate}
            minDate={fromDate}
            maxDate={oneMonthAfter(fromDate)}
          />
        </div>
      </div>
    </div>
  );
};

export default RouteForm;

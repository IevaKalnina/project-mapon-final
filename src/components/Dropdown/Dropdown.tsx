import React from "react";
import { UseFormRegister } from "react-hook-form";
import styles from "./dropdown.module.scss";

export interface Vehicle {
  unit_id: number;
  number: string;
  label: string;
}

interface DropdownProps {
  vehicles: Vehicle[];
  register: UseFormRegister<any>;
  name: string;
}

const Dropdown: React.FC<DropdownProps> = ({ vehicles, register, name }) => {
  return (
    <div className={styles.row}>
      <label>
        Vehicle number<span className={styles.asterisk}>*</span>
      </label>
      <select {...register(name)} className={styles.dropdown}>
        <option value="" disabled hidden>
          Select vehicle
        </option>
        {vehicles.map((vehicle) => (
          <option
            key={vehicle.unit_id}
            value={vehicle.number}
            className={styles.option}
          >
            {vehicle.number}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;

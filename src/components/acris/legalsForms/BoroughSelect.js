import React from "react";

const BoroughSelect = ({
  value,
  onChange,
  name = "borough",
  id = "borough-select",
  label = "Borough",
  required = false,
}) => {
  return (
    <div className="mb-1">
      <label htmlFor={id} className="form-label fw-bold mb-0">
        {label}
      </label>
      <select
        className="form-select form-select-md"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        aria-required={required}
      >
        <option value="">Select Borough</option>
        <option value="1">Manhattan</option>
        <option value="2">Bronx</option>
        <option value="3">Brooklyn</option>
        <option value="4">Queens</option>
        <option value="5">Staten Island</option>
      </select>
    </div>
  );
};

export default BoroughSelect;
import React from "react";

const StreetNumber = ({
  value,
  onChange,
  id = "street-number",
  label = "Street Number",
  required = false,
}) => {
  return (
    <div className="mb-1">
      <label htmlFor={id} className="form-label fw-bold">
        {label}
        {required && <span className="text-danger ms-1">*</span>}
      </label>
      <input
        className="form-control form-control-lg"
        type="text"
        id={id}
        name="street_number"
        placeholder="Enter Street Number"
        value={value}
        onChange={onChange}
        aria-required={required}
      />
    </div>
  );
};

export default StreetNumber;
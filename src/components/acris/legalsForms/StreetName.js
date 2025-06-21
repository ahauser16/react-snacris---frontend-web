import React from "react";

const StreetName = ({
  value,
  onChange,
  id = "street-name",
  label = "Street Name",
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
        name="street_name"
        placeholder="Enter Street Name"
        value={value}
        onChange={onChange}
        aria-required={required}
      />
    </div>
  );
};

export default StreetName;
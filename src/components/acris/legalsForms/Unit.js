import React from "react";
import "../commonFormStyles.css";
import Tooltip from "../../utils/Tooltip";

const Unit = ({
  value,
  onChange,
  id = "unit",
  label = "Unit (optional)",
  required = false,
}) => {
  return (
    <div className="mb-1">
      <div className="d-flex align-items-center justify-content-between">
        <label htmlFor={id} className="form-label fw-bold mb-0">
          {label}
        </label>
        <Tooltip
          helperText="Maximum length is 7 characters. Only applies to coop units.  This is an optional field for this form."
          label="Unit field information"
          iconName="icon-information"
          iconClassName="ms-1"
          iconSize={20}
        />
      </div>
      <input
        className="form-control form-control-md uppercase"
        type="text"
        id={id}
        name="unit"
        placeholder="Enter Unit (optional)"
        value={value}
        onChange={onChange}
        aria-required={required}
        maxLength={7}
        aria-describedby={`${id}-desc`}
      />
      <div id={`${id}-desc`} className="form-text visually-hidden">
        Maximum length is 7 characters. Coop only (optional).
      </div>
    </div>
  );
};

export default Unit;

import React from "react";
import "../commonFormStyles.css";
import Tooltip from "../../utils/Tooltip";

const TaxBlock = ({
  value,
  onChange,
  id = "tax-block",
  label = "Tax Block",
  required = false,
}) => {
  return (
    <div className="mb-1">
      <div className="d-flex align-items-center justify-content-between">
        <label htmlFor={id} className="form-label fw-bold mb-0">
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
        <Tooltip
          helperText="Enter a 5-digit number for the Tax Block."
          label="Tax Block field information"
          iconName="icon-information"
          iconClassName="ms-1"
          iconSize={20}
        />
      </div>
      <input
        className="form-control form-control-md uppercase"
        type="text"
        id={id}
        name="block"
        placeholder="Enter Tax Block"
        value={value}
        onChange={onChange}
        aria-required={required}
        maxLength={5}
        pattern="\d{5}"
        aria-describedby={`${id}-desc`}
        required={required}
        inputMode="numeric"
      />
      <div id={`${id}-desc`} className="form-text visually-hidden">
        Enter a 5-digit number for the Tax Block.
      </div>
    </div>
  );
};

export default TaxBlock;
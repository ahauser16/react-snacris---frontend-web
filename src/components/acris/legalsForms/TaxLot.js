import React from "react";
import "../commonFormStyles.css";
import Tooltip from "../../utils/Tooltip";

const TaxLot = ({
  value,
  onChange,
  id = "tax-lot",
  label = "Tax Lot",
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
          helperText="Maximum length is 4 digits. Enter the 4-digit Tax Lot number."
          label="Tax Lot field information"
          iconName="icon-information"
          iconClassName="ms-1"
          iconSize={20}
        />
      </div>
      <input
        className="form-control form-control-md uppercase"
        type="text"
        id={id}
        name="lot"
        placeholder="Enter Tax Lot"
        value={value}
        onChange={onChange}
        aria-required={required}
        maxLength={4}
        pattern="\d{1,4}"
        aria-describedby={`${id}-desc`}
        required={required}
        inputMode="numeric"
      />
      <div id={`${id}-desc`} className="form-text visually-hidden">
        Maximum length is 4 digits. Enter the 4-digit Tax Lot number.
      </div>
    </div>
  );
};

export default TaxLot;
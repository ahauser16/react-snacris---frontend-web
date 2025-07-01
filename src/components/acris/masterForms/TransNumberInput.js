import React from "react";
import "../commonFormStyles.css";
import Tooltip from "../../utils/Tooltip";

const TransNumberInput = ({
  value,
  onChange,
  id = "transaction-number",
  label = "Transaction Number",
  required = false,
}) => {
  return (
    <div className="mb-1">
      <div className="d-flex align-items-center justify-content-between">
        <label htmlFor={id} className="form-label fw-bold mb-0">
          {label}
        </label>
        <Tooltip
          helperText="Maximum length is 13 characters. Format: YYYYMMDDNNNNN. Only documents recorded/filed on or after January 2, 2003 will have Transaction Numbers."
          label="Transaction Number field information"
          iconName="icon-information"
          iconClassName="ms-1"
          iconSize={20}
        />
      </div>
      <input
        className="form-control form-control-md uppercase"
        type="text"
        id={id}
        name="transaction_number"
        placeholder="Enter as YYYYMMDDNNNNN"
        value={value}
        onChange={onChange}
        aria-required={required}
        maxLength={13}
        aria-describedby={`${id}-desc`}
        autoComplete="off"
      />
      <div id={`${id}-desc`} className="form-text visually-hidden">
        Maximum length is 13 characters in the format YYYYMMDDNNNNN. A
        Transaction Number is a unique number automatically assigned by ACRIS
        when a new cover page is created.
      </div>
    </div>
  );
};

export default TransNumberInput;

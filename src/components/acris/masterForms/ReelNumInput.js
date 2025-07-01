import React from "react";
import "../commonFormStyles.css";
import Tooltip from "../../utils/Tooltip";

const ReelNumInput = ({
  value,
  onChange,
  id = "reel-number",
  label = "Reel Number",
  required = false,
}) => {
  return (
    <div className="mb-1">
      <div className="d-flex align-items-center justify-content-between">
        <label htmlFor={id} className="form-label fw-bold mb-0">
          {label}
        </label>
        <Tooltip
          helperText="Enter a 5-digit reel number (NNNNN). Reel numbers are sequential identifiers used for organizing microfilm records of documents recorded before January 2, 2003."
          label="Reel Number field information"
          iconName="icon-information"
          iconClassName="ms-1"
          iconSize={20}
        />
      </div>
      <input
        className="form-control form-control-md"
        type="text"
        id={id}
        name="reel_nbr"
        placeholder="e.g. 12345"
        value={value}
        onChange={onChange}
        aria-required={required}
        maxLength={5}
        aria-describedby={`${id}-desc`}
        autoComplete="off"
        pattern="[0-9]{1,5}"
        inputMode="numeric"
      />
      <div id={`${id}-desc`} className="form-text visually-hidden">
        Enter a 5-digit reel number for microfilm records. Maximum length is 5
        digits.
      </div>
    </div>
  );
};

export default ReelNumInput;

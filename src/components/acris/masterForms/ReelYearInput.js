import React from "react";
import "../commonFormStyles.css";
import Tooltip from "../../utils/Tooltip";

const ReelYearInput = ({
  value,
  onChange,
  id = "reel-year",
  label = "Reel Year",
  required = false,
}) => {
  return (
    <div className="mb-1">
      <div className="d-flex align-items-center justify-content-between">
        <label htmlFor={id} className="form-label fw-bold mb-0">
          {label}
        </label>
        <Tooltip
          helperText="Enter a 4-digit year (YYYY). Reel records are available for documents recorded before January 2, 2003. Common years: 1966-2002."
          label="Reel Year field information"
          iconName="icon-information"
          iconClassName="ms-1"
          iconSize={20}
        />
      </div>
      <input
        className="form-control form-control-md"
        type="text"
        id={id}
        name="reel_yr"
        placeholder="e.g. 2005"
        value={value}
        onChange={onChange}
        aria-required={required}
        maxLength={4}
        aria-describedby={`${id}-desc`}
        autoComplete="off"
        pattern="[0-9]{4}"
        inputMode="numeric"
      />
      <div id={`${id}-desc`} className="form-text visually-hidden">
        Enter a 4-digit year for reel records. Documents recorded before January
        2, 2003.
      </div>
    </div>
  );
};

export default ReelYearInput;

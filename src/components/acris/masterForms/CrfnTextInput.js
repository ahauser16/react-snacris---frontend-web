import React from "react";
import "../commonFormStyles.css";
import Tooltip from "../../utils/Tooltip";

const CrfnTextInput = ({
  value,
  onChange,
  id = "city-register-file-number",
  label = "City Register File Number",
  required = false,
}) => {
  return (
    <div className="mb-1">
      <div className="d-flex align-items-center justify-content-between">
        <label htmlFor={id} className="form-label fw-bold mb-0">
          {label}
        </label>
        <Tooltip
          helperText="Maximum length is 13 characters. Format: YYYYNNNNNNNNN."
          label="CRFN field information"
          iconName="icon-information"
          iconClassName="ms-1"
          iconSize={20}
        />
      </div>
      <input
        className="form-control form-control-md uppercase"
        type="text"
        id={id}
        name="crfn"
        placeholder="Enter as YYYYNNNNNNNNN"
        value={value}
        onChange={onChange}
        aria-required={required}
        maxLength={13}
        aria-describedby={`${id}-desc`}
        autoComplete="off"
      />
      <div id={`${id}-desc`} className="form-text visually-hidden">
        Maximum length is 13 characters in the format YYYYNNNNNNNNN.
      </div>
    </div>
  );
};

export default CrfnTextInput;

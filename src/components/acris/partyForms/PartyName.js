import React from "react";
import "../commonFormStyles.css";
import Tooltip from "../../utils/Tooltip";

const PartyName = ({
  value,
  onChange,
  id = "party-name",
  label = "Party Name",
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
          helperText="Maximum length is 70 characters. Typically contains the first and last name of individuals or the full name of a business."
          label="Party Name field information"
          iconName="icon-information"
          iconClassName="ms-1"
          iconSize={20}
        />
      </div>
      <input
        className="form-control form-control-md"
        type="text"
        id={id}
        name="name"
        placeholder="e.g. John Doe"
        value={value}
        onChange={onChange}
        aria-required={required}
        maxLength={70}
        aria-describedby={`${id}-desc`}
      />
      <div id={`${id}-desc`} className="form-text visually-hidden">
        Maximum length is 70 characters. Typically contains the first and last name of individuals or the full name of a business.
      </div>
    </div>
  );
};

export default PartyName;
import React from "react";
import "../commonFormStyles.css";
import Tooltip from "../../utils/Tooltip";

const StreetName = ({
  value,
  onChange,
  id = "street-name",
  label = "Street Name",
  required = false,
}) => {
  return (
    <div className="mb-1">
      <div className="d-flex align-items-center justify-content-between">
        <label htmlFor={id} className="form-label fw-bold mb-0">
          {label}
        </label>
        <Tooltip
          helperText="Maximum length is 32 characters.  This is the 'street name' associated with a parcel of land (e.g. the street address '123 Avenue X' has a 'street name' of 'Avenue X')."
          label="Street Name field information"
          iconName="icon-information"
          iconClassName="ms-1"
          iconSize={20}
        />
      </div>
      <input
        className="form-control form-control-md uppercase"
        type="text"
        id={id}
        name="street_name"
        placeholder="Enter Street Name"
        value={value}
        onChange={onChange}
        aria-required={required}
        maxLength={32}
      />
    </div>
  );
};

export default StreetName;

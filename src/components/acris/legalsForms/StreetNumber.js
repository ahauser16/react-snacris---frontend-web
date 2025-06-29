import React from "react";
import "../commonFormStyles.css";
import Tooltip from "../../utils/Tooltip";

const StreetNumber = ({
  value,
  onChange,
  id = "street-number",
  label = "Street Number",
  required = false,
}) => {
  return (
    <div className="mb-1">
      <div className="d-flex align-items-center justify-content-between">
        <label htmlFor={id} className="form-label fw-bold mb-0">
          {label}
        </label>
        <Tooltip
          helperText="Maximum length is 12 characters. This is the 'house number' associated with a parcel of land (e.g. the street address '123 Avenue X' has a 'street number' of '123')."
          label="Street Number field information"
          iconName="icon-information"
          iconClassName="ms-1"
          iconSize={20}
        />
      </div>
      <input
        className="form-control form-control-md uppercase"
        type="text"
        id={id}
        name="street_number"
        placeholder="Enter Street Number"
        value={value}
        onChange={onChange}
        aria-required={required}
        maxLength={12}
        aria-describedby={`${id}-desc`}
      />
      <div id={`${id}-desc`} className="form-text visually-hidden">
        Maximum length is 12 characters. This is the "street" or "House Number" associated with a parcel of land (also referred to by BBL).
      </div>
    </div>
  );
};

export default StreetNumber;
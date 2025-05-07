import React from "react";

const StreetName = ({ value, onChange }) => {
  return (
    <input
      className="form-control form-control-lg mb-1"
      name="street_name"
      placeholder="Enter Street Name"
      value={value}
      onChange={onChange}
    />
  );
};

export default StreetName;
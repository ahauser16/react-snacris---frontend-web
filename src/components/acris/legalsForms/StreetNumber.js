import React from "react";

const StreetNumber = ({ value, onChange }) => {
  return (
    <input
      className="form-control form-control-lg mb-1"
      name="street_number"
      placeholder="Enter Street Number"
      value={value}
      onChange={onChange}
    />
  );
};

export default StreetNumber;
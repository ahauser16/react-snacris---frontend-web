import React from "react";

const TaxBlock = ({ value, onChange }) => {
  return (
    <input
      className="form-control form-control-lg mb-1"
      name="block"
      placeholder="Enter Tax Block"
      value={value}
      onChange={onChange}
    />
  );
};

export default TaxBlock;
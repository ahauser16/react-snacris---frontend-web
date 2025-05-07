import React from "react";

const TaxLot = ({ value, onChange }) => {
  return (
    <input
      className="form-control form-control-lg mb-1"
      name="lot"
      placeholder="Enter Tax Lot"
      value={value}
      onChange={onChange}
    />
  );
};

export default TaxLot;
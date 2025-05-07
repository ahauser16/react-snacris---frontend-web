import React from "react";

const Unit = ({ value, onChange }) => {
  return (
    <input
      className="form-control form-control-lg"
      name="unit"
      placeholder="Enter Unit - coop only (optional)"
      value={value}
      onChange={onChange}
    />
  );
};

export default Unit;
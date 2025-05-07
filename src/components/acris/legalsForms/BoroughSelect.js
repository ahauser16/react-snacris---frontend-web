import React from "react";

const BoroughSelect = ({ value, onChange }) => {
  return (
    <>
      <select
        className="form-select form-select-lg mb-1"
        name="borough"
        value={value}
        onChange={onChange}
      >
        <option value="">Select Borough</option>
        <option value="1">Manhattan</option>
        <option value="2">Bronx</option>
        <option value="3">Brooklyn</option>
        <option value="4">Queens</option>
        <option value="5">Staten Island</option>
      </select>
    </>
  );
};

export default BoroughSelect;
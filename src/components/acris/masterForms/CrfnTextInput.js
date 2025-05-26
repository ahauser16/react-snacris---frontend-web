import React from "react";

function CrfnTextInput({ value, onChange }) {
  return (
    <>
      <h3 className="mb-1 fw-bold">City Register File Number:</h3>
      <input
        className="form-control form-control-lg mb-4"
        name="crfn"
        placeholder="Enter as YYYYNNNNNNNNN"
        value={value}
        onChange={onChange}
        autoComplete="off"
      />
    </>
  );
}

export default CrfnTextInput;
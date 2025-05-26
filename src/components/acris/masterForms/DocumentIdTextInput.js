import React from "react";

function DocumentIdTextInput({ value, onChange }) {
  return (
    <>
      <h3 className="mb-1 fw-bold">Document ID Number:</h3>
      <input
        className="form-control form-control-lg mb-1"
        name="document_id"
        placeholder="Enter as YYYYMMDDNNNNNSSS"
        value={value}
        onChange={onChange}
        autoComplete="off"
      />
    </>
  );
}

export default DocumentIdTextInput;
import React from "react";
import "../commonFormStyles.css";
import Tooltip from "../../utils/Tooltip";

const DocumentIdTextInput = ({
  value,
  onChange,
  id = "document-id",
  label = "Document ID Number",
  required = false,
}) => {
  return (
    <div className="mb-1">
      <div className="d-flex align-items-center justify-content-between">
        <label htmlFor={id} className="form-label fw-bold mb-0">
          {label}
        </label>
        <Tooltip
          helperText="Enter a 16-character Document ID in format YYYYMMDDNNNNNSSS."
          label="Document ID field information"
          iconName="icon-information"
          iconClassName="ms-1"
          iconSize={20}
        />
      </div>
      <input
        className="form-control form-control-md uppercase"
        type="text"
        id={id}
        name="document_id"
        placeholder="Enter as YYYYMMDDNNNNNSSS"
        value={value}
        onChange={onChange}
        aria-required={required}
        maxLength={16}
        aria-describedby={`${id}-desc`}
        autoComplete="off"
      />
      <div id={`${id}-desc`} className="form-text visually-hidden">
        Enter a 16-character Document ID in the format YYYYMMDDNNNNNSSS.
      </div>
    </div>
  );
};

export default DocumentIdTextInput;

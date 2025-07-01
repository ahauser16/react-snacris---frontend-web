import React from "react";
import "../commonFormStyles.css";
import Tooltip from "../../utils/Tooltip";

const UccFileNumInput = ({
  value,
  onChange,
  id = "ucc-file-number",
  label = "UCC or Federal Lien File Number",
  required = false,
}) => {
  return (
    <div className="mb-1">
      <div className="d-flex align-items-center justify-content-between">
        <label htmlFor={id} className="form-label fw-bold mb-0">
          {label}
        </label>
        <Tooltip
          helperText="File Number format example: 02PN03283. This search is only available for documents recorded or filed BEFORE January 2, 2003."
          label="UCC/Federal Lien File Number field information"
          iconName="icon-information"
          iconClassName="ms-1"
          iconSize={20}
        />
      </div>
      <input
        className="form-control form-control-md uppercase"
        type="text"
        id={id}
        name="ucc_lien_file_number"
        placeholder="e.g. 02PN03283"
        value={value}
        onChange={onChange}
        aria-required={required}
        maxLength={20}
        aria-describedby={`${id}-desc`}
        autoComplete="off"
      />
      <div id={`${id}-desc`} className="form-text visually-hidden">
        UCC or Federal Lien File Number. Only available for documents recorded
        before January 2, 2003.
      </div>
    </div>
  );
};

export default UccFileNumInput;

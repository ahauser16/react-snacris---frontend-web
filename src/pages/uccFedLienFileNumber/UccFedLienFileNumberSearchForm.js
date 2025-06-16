import React, { useState } from "react";
import UccFedLienWrapperBoroughSelect from "./UccFedLienWrapperBoroughSelect";

const UccFedLienFileNumberSearchForm = ({ searchFor }) => {
  console.debug(
    "UccFedLienFileNumberSearchForm",
    "searchFor=",
    typeof searchFor
  );

  const [masterSearchTerms, setMasterSearchTerms] = useState({
    ucc_lien_file_number: "",
  });

  const [legalsSearchTerms, setLegalsSearchTerms] = useState({
    borough: "",
  });

  function handleMasterChange(evt) {
    const { name, value } = evt.target;
    setMasterSearchTerms((data) => ({
      ...data,
      [name]: value,
    }));
  }

  function handleLegalsChange(evt) {
    const { name, value } = evt.target;
    setLegalsSearchTerms((data) => ({
      ...data,
      [name]: value,
    }));
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    searchFor(masterSearchTerms, legalsSearchTerms);
  }

  return (
    <div className="UccFedLienFileNumberSearchForm">
      <form onSubmit={handleSubmit}>
        <fieldset className="text-start">
          <div className="mb-3">
            <label
              htmlFor="ucc_lien_file_number"
              className="form-label fw-bold"
            >
              File Number
            </label>
            <input
              type="text"
              className="form-control"
              id="ucc_lien_file_number"
              name="ucc_lien_file_number"
              value={masterSearchTerms.ucc_lien_file_number}
              onChange={handleMasterChange}
              placeholder="e.g. 02PN03283"
            />
          </div>
          <UccFedLienWrapperBoroughSelect
            legalsSearchTerms={legalsSearchTerms}
            handleLegalsChange={handleLegalsChange}
          />
        </fieldset>
        <button type="submit" className="btn btn-lg btn-primary mx-auto">
          Submit
        </button>
      </form>
    </div>
  );
};

export default UccFedLienFileNumberSearchForm;

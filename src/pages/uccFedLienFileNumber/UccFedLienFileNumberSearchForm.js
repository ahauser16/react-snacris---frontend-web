import React, { useState } from "react";
import Alert from "../../common/Alert";
import UccFedLienWrapperBoroughSelect from "./UccFedLienWrapperBoroughSelect";
import UccFileNumInput from "../../components/acris/personalPropertyForms/UccFileNumInput";
import "./UccFedLienFileNumberSearchForm.css"; 

const UccFedLienFileNumberSearchForm = ({ searchFor, setAlert }) => {
  const [masterSearchTerms, setMasterSearchTerms] = useState({
    ucc_lien_file_number: "",
  });

  const [legalsSearchTerms, setLegalsSearchTerms] = useState({
    borough: "",
  });

  const [formErrors, setFormErrors] = useState([]);

  function handleMasterChange(evt) {
    const { name, value } = evt.target;
    setMasterSearchTerms((data) => ({
      ...data,
      [name]: value,
    }));
    setFormErrors([]); // clear errors on change
    setAlert({ type: "", messages: [] }); // clear alerts on change
  }

  function handleLegalsChange(evt) {
    const { name, value } = evt.target;
    setLegalsSearchTerms((data) => ({
      ...data,
      [name]: value,
    }));
    setFormErrors([]); // clear errors on change
    setAlert({ type: "", messages: [] }); // clear alerts on change
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    const errors = [];
    if (!masterSearchTerms.ucc_lien_file_number.trim()) {
      errors.push("File Number is required.");
    }
    if (!legalsSearchTerms.borough.trim()) {
      errors.push("Borough is required.");
    }
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors([]);
    setAlert({ type: "", messages: [] }); // clear alerts before search
    searchFor(masterSearchTerms, legalsSearchTerms);
  }

  return (
    <div className="UccFedLienFileNumberSearchForm">
      <form onSubmit={handleSubmit}>
        {formErrors.length > 0 && <Alert type="danger" messages={formErrors} />}
        <fieldset className="text-start p-2 mb-1 bg-blue-transparent">
          <UccFileNumInput
            value={masterSearchTerms.ucc_lien_file_number}
            onChange={handleMasterChange}
            id="ucc_lien_file_number"
            required={true}
          />
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

import React, { useState } from "react";
import Alert from "../../common/Alert";
import DocClassTypeSelect from "../../components/acris/documentControlCodeForms/DocClassTypeSelect";
import RecordedDateRangeWrapper from "../../components/acris/masterForms/RecordedDateRangeWrapper";
import DocumentTypeSearchWrapperBoroughSelect from "./DocumentTypeSearchWrapperBoroughSelect";
import "./documentTypeSearchForm.css";

const DocumentTypeSearchForm = ({ searchFor, setAlert }) => {
  console.debug("DocumentTypeSearchForm", "searchFor=", typeof searchFor);

  const [masterSearchTerms, setMasterSearchTerms] = React.useState({
    recorded_date_range: "to-current-date-default",
    recorded_date_start: "",
    recorded_date_end: "",
    doc_type: "doc-type-default",
    doc_class: "all-classes-default",
  });

  const [legalsSearchTerms, setLegalsSearchTerms] = React.useState({
    borough: "",
  });

  const [formErrors, setFormErrors] = useState([]);

  async function handleSubmit(evt) {
    evt.preventDefault();
    // Validate required fields
    if (
      !masterSearchTerms.doc_class ||
      masterSearchTerms.doc_class === "all-classes-default" ||
      !masterSearchTerms.doc_type ||
      masterSearchTerms.doc_type === "doc-type-default"
    ) {
      setFormErrors([
        "Please select both a Document Class and a Document Type.",
      ]);
      return;
    }
    setFormErrors([]);
    setAlert({ type: "", messages: [] }); // clear alerts before search
    await searchFor(masterSearchTerms, legalsSearchTerms);
  }

  function handleMasterChange(evt) {
    const { name, value } = evt.target;
    setMasterSearchTerms((data) => ({
      ...data,
      [name]: value,
    }));
    setFormErrors([]); // clear errors on change
    setAlert({ type: "", messages: [] });
  }

  function handleLegalsChange(evt) {
    const { name, value } = evt.target;
    setLegalsSearchTerms((data) => ({
      ...data,
      [name]: value,
    }));
    setFormErrors([]);
    setAlert({ type: "", messages: [] });
  }

  return (
    <div className="DocumentTypeSearchForm">
      <form onSubmit={handleSubmit}>
        {formErrors.length > 0 && <Alert type="danger" messages={formErrors} />}
        <fieldset className="text-start p-2 mb-1 bg-blue-transparent">
          <RecordedDateRangeWrapper
            masterSearchTerms={masterSearchTerms}
            setMasterSearchTerms={setMasterSearchTerms}
          />
          <DocClassTypeSelect
            masterSearchTerms={masterSearchTerms}
            setMasterSearchTerms={setMasterSearchTerms}
            onChange={handleMasterChange}
          />
          <DocumentTypeSearchWrapperBoroughSelect
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

export default DocumentTypeSearchForm;

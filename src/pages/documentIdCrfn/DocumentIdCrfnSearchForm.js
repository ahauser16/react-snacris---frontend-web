import React, { useState } from "react";
import Alert from "../../common/Alert";
import "./documentIdCrfnSearchForm.css";
import DocumentIdTextInput from "../../components/acris/masterForms/DocumentIdTextInput";
import CrfnTextInput from "../../components/acris/masterForms/CrfnTextInput";

function DocumentIdCrfnSearchForm({ searchFor, setAlert }) {
  const [masterSearchTerms, setMasterSearchTerms] = useState({
    document_id: "",
    crfn: "",
  });
  const [formErrors, setFormErrors] = useState([]);

  async function handleSubmit(evt) {
    evt.preventDefault();
    const { document_id, crfn } = masterSearchTerms;
    if (!document_id && !crfn) {
      setFormErrors(["Please fill out either the Document ID or CRFN field."]);
      return;
    }
    if (document_id && crfn) {
      setFormErrors([
        "Please fill out only one field: Document ID or CRFN, not both.",
      ]);
      return;
    }
    setFormErrors([]);
    setAlert({ type: "", messages: [] }); // clear alerts before search
    if (document_id) {
      await searchFor({ document_id });
    } else {
      await searchFor({ crfn });
    }
  }

  function handleDocumentIdChange(e) {
    setMasterSearchTerms((data) => ({
      ...data,
      document_id: e.target.value,
      crfn: "",
    }));
    setFormErrors([]);
    setAlert({ type: "", messages: [] });
  }

  function handleCrfnChange(e) {
    setMasterSearchTerms((data) => ({
      ...data,
      crfn: e.target.value,
      document_id: "",
    }));
    setFormErrors([]);
    setAlert({ type: "", messages: [] });
  }

  return (
    <div className="DocumentIdCrfnSearchForm">
      <form onSubmit={handleSubmit}>
        {formErrors.length > 0 && <Alert type="danger" messages={formErrors} />}
        <fieldset className="text-start p-2 mb-1 bg-blue-transparent">
          <DocumentIdTextInput
            value={masterSearchTerms.document_id}
            onChange={handleDocumentIdChange}
          />
          <CrfnTextInput
            value={masterSearchTerms.crfn}
            onChange={handleCrfnChange}
          />
        </fieldset>
        <button type="submit" className="btn btn-lg btn-primary mx-auto">
          Submit
        </button>
      </form>
    </div>
  );
}

export default DocumentIdCrfnSearchForm;

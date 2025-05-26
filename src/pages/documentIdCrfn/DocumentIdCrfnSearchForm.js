import React, { useState } from "react";
import alert from "../../common/Alert";
import "./documentIdCrfnSearchForm.css";
import DocumentIdTextInput from "../../components/acris/masterForms/DocumentIdTextInput";
import CrfnTextInput from "../../components/acris/masterForms/CrfnTextInput";

function DocumentIdCrfnSearchForm({ searchFor }) {
  console.debug("DocumentIdCrfnSearchForm", "searchFor=", typeof searchFor);

  const [masterSearchTerms, setMasterSearchTerms] = useState({
      document_id: "",
      crfn: "",
    });

  function handleSubmit(evt) {
    evt.preventDefault();
    const { document_id, crfn } = masterSearchTerms;
    if ((document_id && !crfn) || (!document_id && crfn)) {
      if (document_id) {
        searchFor({ document_id });
      } else {
        searchFor({ crfn });
      }
    } else {
      alert("Please fill out either the Document ID or CRFN field, but not both or neither.");
    }
  }

  return (
    <div className="DocumentIdCrfnSearchForm">
      <form onSubmit={handleSubmit}>
        <fieldset className="text-start">
          <div className="d-flex justify-content-start text-start">
            <p>
              Please fill in only one number (Document ID Number or CityRegister File Number "CRFN")
            </p>
          </div>
          <DocumentIdTextInput
            value={masterSearchTerms.document_id}
            onChange={(e) =>
              setMasterSearchTerms((data) => ({
                ...data,
                document_id: e.target.value,
                crfn: "", // clear crfn if document_id is being edited
              }))
            }
          />
          <CrfnTextInput
            value={masterSearchTerms.crfn}
            onChange={(e) =>
              setMasterSearchTerms((data) => ({
                ...data,
                crfn: e.target.value,
                document_id: "", // clear document_id if crfn is being edited
              }))
            }
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
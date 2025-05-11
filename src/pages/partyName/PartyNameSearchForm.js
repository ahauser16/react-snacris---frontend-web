import React, { useState } from "react";
import "./partyNameSearchForm.css";
import DocClassTypePartySelect from "../../components/acris/DocClassTypePartySelect";
import DocumentDateRange from "../../components/acris/DocumentDateRange";
// import BoroughSelect from "../../components/acris/legalsForms/BoroughSelect";
import PartyNameWrapperBoroughSelect from "./PartyNameWrapperBoroughSelect";

function PartyNameSearchForm({ searchFor }) {
  console.debug("PartyNameSearchForm", "searchFor=", typeof searchFor);

  const [masterSearchTerms, setMasterSearchTerms] = useState({
    document_date_range: "to-current-date-default",
    document_date_start: "start-date-default",
    document_date_end: "end-date-default",
    doc_type: "doc-type-default",
    doc_class: "all-classes-default",
  });

  const [partySearchTerms, setPartySearchTerms] = useState({
    name: "name-default",
    party_type: "all-party-types-default",
  });

  const [legalsSearchTerms, setLegalsSearchTerms] = useState({
    borough: "",
  });

  function handleSubmit(evt) {
    evt.preventDefault();
    console.debug(
      "PartyNameSearchForm: handleSubmit called with:",
      masterSearchTerms,
      partySearchTerms,
      legalsSearchTerms
    );
    searchFor(
      masterSearchTerms,
      partySearchTerms,
      legalsSearchTerms
    );
  }

  function handleMasterChange(evt) {
    const { name, value } = evt.target;
    setMasterSearchTerms((data) => ({
      ...data,
      [name]: value,
    }));
  }

  function handlePartyChange(evt) {
    const { name, value } = evt.target;
    setPartySearchTerms((data) => ({
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

  return (
    <div className="PartyNameSearchForm mb-4">
      <form onSubmit={handleSubmit}>
        <div className="row justify-content-center justify-content-lg-start gx-4 gy-4">
          <fieldset className="col-6 justify-content-start text-start">
            <h3 className="mb-1 fw-bold">Name:</h3>
            <input
              className="form-control form-control-lg mb-1"
              name="name"
              placeholder="e.g. John Doe"
              value={partySearchTerms.name}
              onChange={handlePartyChange}
            />
            <DocumentDateRange
              masterSearchTerms={masterSearchTerms}
              setMasterSearchTerms={setMasterSearchTerms}
            />
            <DocClassTypePartySelect
              masterSearchTerms={masterSearchTerms}
              setMasterSearchTerms={setMasterSearchTerms}
              partySearchTerms={partySearchTerms}
              setPartySearchTerms={setPartySearchTerms}
            />
            <PartyNameWrapperBoroughSelect
              legalsSearchTerms={legalsSearchTerms}
              handleLegalsChange={handleLegalsChange}
            />
          </fieldset>
          <button type="submit" className="btn btn-lg btn-primary mx-auto">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default PartyNameSearchForm;
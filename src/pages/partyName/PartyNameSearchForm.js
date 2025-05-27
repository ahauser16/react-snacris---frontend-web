import React, { useState } from "react";
import "./partyNameSearchForm.css";
import DocClassTypePartySelect from "../../components/acris/DocClassTypePartySelect";
import RecordedDateRangeWrapper from "../../components/acris/masterForms/RecordedDateRangeWrapper";
import PartyNameWrapperBoroughSelect from "./PartyNameWrapperBoroughSelect";

function PartyNameSearchForm({ searchFor }) {
  console.debug("PartyNameSearchForm", "searchFor=", typeof searchFor);

  const [masterSearchTerms, setMasterSearchTerms] = useState({
    recorded_date_range: "to-current-date-default",
    recorded_date_start: "",
    recorded_date_end: "",
    doc_type: "doc-type-default",
    doc_class: "all-classes-default",
  });

  const [partySearchTerms, setPartySearchTerms] = useState({
    name: "",
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
    <div className="PartyNameSearchForm">
      <form onSubmit={handleSubmit}>
        <fieldset className="text-start">
          <h3 className="mb-1 fw-bold">Name:</h3>
          <input
            className="form-control form-control-lg mb-1"
            name="name"
            placeholder="e.g. John Doe"
            value={partySearchTerms.name}
            onChange={handlePartyChange}
          />
          <RecordedDateRangeWrapper
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
        <button type="submit" className="btn btn-lg btn-primary mt-3">
          Submit
        </button>
      </form>
    </div>
  );
}

export default PartyNameSearchForm;
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
    //mb-4: Adds a bottom margin of 4 units (spacing).
    <div className="PartyNameSearchForm">
      <form onSubmit={handleSubmit}>
        {/* 
        row: Adds a flexbox row layout with horizontal and vertical spacing.
        justify-content-center: Centers the content horizontally.
        justify-content-lg-start: Aligns the content to the left on large screens.
        gx-4: Adds horizontal spacing between columns.
        gy-4: Adds vertical spacing between rows. 
        */}
        {/* <div className="row justify-content-center justify-content-lg-start gx-4 gy-4"> */}
          {/* 
          col-6: Sets the column width to 6 out of 12 (50% width).
          justify-content-center: Centers the content horizontally.
          text-center: Centers the text inside the column.
           */}
          {/* <fieldset className="col-6 justify-content-start text-start"> */}
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
        {/* </div> */}
      </form>
    </div>
  );
}

export default PartyNameSearchForm;
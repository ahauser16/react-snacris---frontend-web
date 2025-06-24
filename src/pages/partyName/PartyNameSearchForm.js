import React, { useState } from "react";
import Alert from "../../common/Alert";
import "./partyNameSearchForm.css";
import DocClassTypePartySelect from "../../components/acris/documentControlCodeForms/DocClassTypePartySelect";
import RecordedDateRangeWrapper from "../../components/acris/masterForms/RecordedDateRangeWrapper";
import PartyNameWrapperBoroughSelect from "./PartyNameWrapperBoroughSelect";
import PartyName from "../../components/acris/partyForms/PartyName";

function PartyNameSearchForm({ searchFor }) {
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

  const [formErrors, setFormErrors] = useState([]);
  const [alert, setAlert] = useState({ type: "", messages: [] });

  async function handleSubmit(evt) {
    evt.preventDefault();
    if (!partySearchTerms.name.trim()) {
      setFormErrors(["The name field is required."]);
      return;
    }
    setFormErrors([]);
    setAlert({ type: "", messages: [] });
    await searchFor(
      masterSearchTerms,
      partySearchTerms,
      legalsSearchTerms,
      setAlert
    );
  }

  function handlePartyChange(evt) {
    const { name, value } = evt.target;
    setPartySearchTerms((data) => ({
      ...data,
      [name]: value,
    }));
    setFormErrors([]);
    setAlert({ type: "", messages: [] });
  }

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

  return (
    <div className="PartyNameSearchForm">
      <form onSubmit={handleSubmit}>
        {formErrors.length > 0 && <Alert type="danger" messages={formErrors} />}
        {alert && alert.messages && alert.messages.length > 0 && (
          <Alert type={alert.type} messages={alert.messages} />
        )}
        <fieldset className="text-start p-2 mb-1 bg-blue-transparent">
          <PartyName
            value={partySearchTerms.name}
            onChange={handlePartyChange}
            id="party-name"
            required={true}
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
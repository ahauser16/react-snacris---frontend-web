import React, { useState } from "react";
import "./parcelIdentifierSearchForm.css";
import ParcelIdentifierWrapperBoroughSelect from "./ParcelIdentifierWrapperBoroughSelect";
import TaxBlock from "../../components/acris/legalsForms/TaxBlock";
import TaxLot from "../../components/acris/legalsForms/TaxLot";
import Unit from "../../components/acris/legalsForms/Unit";
import DocClassTypeSelect from "../../components/acris/documentControlCodeForms/DocClassTypeSelect";
import RecordedDateRangeWrapper from "../../components/acris/masterForms/RecordedDateRangeWrapper";


function ParcelIdentifierSearchForm({ searchFor }) {
  console.debug("ParcelIdentifierSearchForm", "searchFor=", typeof searchFor);

  const [masterSearchTerms, setMasterSearchTerms] = useState({
    recorded_date_range: "to-current-date-default",
    recorded_date_start: "",
    recorded_date_end: "",
    doc_type: "doc-type-default",
    doc_class: "all-classes-default",
  });

  const [legalsSearchTerms, setLegalsSearchTerms] = useState({
    borough: "",
    block: "",
    lot: "",
    unit: "",
  });

  function handleSubmit(evt) {
    evt.preventDefault();
    console.debug(
      "ParcelIdentifierSearchForm: handleSubmit called with:",
      masterSearchTerms,
      legalsSearchTerms
    );
    searchFor(masterSearchTerms, legalsSearchTerms);
  }

  function handleLegalsChange(evt) {
    const { name, value } = evt.target;
    setLegalsSearchTerms((data) => ({
      ...data,
      [name]: value,
    }));
  }

  return (
    <div className="ParcelIdentifierSearchForm">
      <form onSubmit={handleSubmit}>
        <fieldset className="text-start">
          <ParcelIdentifierWrapperBoroughSelect
            legalsSearchTerms={legalsSearchTerms}
            handleLegalsChange={handleLegalsChange}
          />
          <TaxBlock
            value={legalsSearchTerms.block}
            onChange={handleLegalsChange}
          />
          <TaxLot
            value={legalsSearchTerms.lot}
            onChange={handleLegalsChange}
          />
          <Unit
            value={legalsSearchTerms.unit}
            onChange={handleLegalsChange}
          />
          <RecordedDateRangeWrapper
            masterSearchTerms={masterSearchTerms}
            setMasterSearchTerms={setMasterSearchTerms}
          />
          <DocClassTypeSelect
            masterSearchTerms={masterSearchTerms}
            setMasterSearchTerms={setMasterSearchTerms}
          />
        </fieldset>

        <button type="submit" className="btn btn-lg btn-primary mx-auto">
          Submit
        </button>
      </form>
    </div>
  );
}

export default ParcelIdentifierSearchForm;
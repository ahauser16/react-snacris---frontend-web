import React, { useState, useEffect } from "react";
import Alert from "../../common/Alert";
import "./parcelIdentifierSearchForm.css";
import ParcelIdentifierWrapperBoroughSelect from "./ParcelIdentifierWrapperBoroughSelect";
import TaxBlock from "../../components/acris/legalsForms/TaxBlock";
import TaxLot from "../../components/acris/legalsForms/TaxLot";
import Unit from "../../components/acris/legalsForms/Unit";
import DocClassTypeSelect from "../../components/acris/documentControlCodeForms/DocClassTypeSelect";
import RecordedDateRangeWrapper from "../../components/acris/masterForms/RecordedDateRangeWrapper";

function ParcelIdentifierSearchForm({ searchFor }) {
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

  const [formErrors, setFormErrors] = useState([]);

  function handleSubmit(evt) {
    evt.preventDefault();
    // Validate required fields
    if (!legalsSearchTerms.borough || !legalsSearchTerms.block || !legalsSearchTerms.lot) {
      setFormErrors(["Please fill out Borough, Block, and Lot fields."]);
      return;
    }
    setFormErrors([]);
    searchFor(masterSearchTerms, legalsSearchTerms);
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
    setFormErrors([]); // clear errors on change
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const borough = params.get("borough") || "";
    const block = params.get("block") || "";
    const lot = params.get("lot") || "";
    if (borough || block || lot) {
      setLegalsSearchTerms((prev) => ({
        ...prev,
        borough,
        block,
        lot,
      }));
    }
  }, []);

  return (
    <div className="ParcelIdentifierSearchForm">
      <form onSubmit={handleSubmit}>
        {formErrors.length > 0 && (
          <Alert type="danger" messages={formErrors} />
        )}
        <fieldset className="text-start p-2 mb-1 bg-blue-transparent">
          <ParcelIdentifierWrapperBoroughSelect
            legalsSearchTerms={legalsSearchTerms}
            handleLegalsChange={handleLegalsChange}
          />
          <TaxBlock
            value={legalsSearchTerms.block}
            onChange={handleLegalsChange}
          />
          <TaxLot value={legalsSearchTerms.lot} onChange={handleLegalsChange} />
          <Unit value={legalsSearchTerms.unit} onChange={handleLegalsChange} />
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
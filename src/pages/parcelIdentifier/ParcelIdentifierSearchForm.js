import React, { useState } from "react";
import "./parcelIdentifierSearchForm.css";
import BoroughSelect from "../../components/acris/legalsForms/BoroughSelect";
import TaxBlock from "../../components/acris/legalsForms/TaxBlock";
import TaxLot from "../../components/acris/legalsForms/TaxLot";
import Unit from "../../components/acris/legalsForms/Unit";
import DocClassTypeSelect from "../../components/acris/DocClassTypeSelect";
import DocumentDateRange from "../../components/acris/DocumentDateRange";

function ParcelIdentifierSearchForm({ searchFor }) {
  console.debug("ParcelIdentifierSearchForm", "searchFor=", typeof searchFor);

  const [masterSearchTerms, setMasterSearchTerms] = useState({
    document_date_range: "to-current-date-default",
    document_date_start: "start-date-default",
    document_date_end: "end-date-default",
    doc_type: "doc-type-default",
    doc_class: "all-classes-default",
  });

  const [legalsSearchTerms, setLegalsSearchTerms] = useState({
    borough: "all-boroughs-default",
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
    <div className="ParcelIdentifierSearchForm mb-4">
      <form onSubmit={handleSubmit}>
        <div className="row justify-content-center justify-content-lg-start gx-4 gy-4">
          <fieldset className="col-6 justify-content-start text-start">
            <h3 className="mb-1 fw-bold">Select Borough, Block & Lot:</h3>
            <BoroughSelect
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
          </fieldset>

          <fieldset className="col-6 justify-content-start text-start">
            <DocumentDateRange
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
        </div>
      </form>
    </div>
  );
}

export default ParcelIdentifierSearchForm;
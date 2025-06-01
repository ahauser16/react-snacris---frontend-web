import React, { useState } from "react";
import Accordion from "../../components/utils/Accordion";
import getPropertyTypeData from "../../hooks/acris/getPropertyTypeData";
import AcrisDetailLink from "../../components/acris/realPropertyDisplay/AcrisDetailLink";
import AcrisViewDocLink from "../../components/acris/realPropertyDisplay/AcrisViewDocLink";
import "./addressParcelCard.css";


const YesNoMap = {
  "Y": "Yes",
  "N": "No",
}

const EntirePartialMap = {
  "E": "Entire",
  "P": "Partial",
}

function PropertyTypeMap(code) {
  // Returns description or fallback
  return getPropertyTypeData(code) || code || "Unknown";
}

const boroughNameMap = {
  1: "Manhattan",
  2: "Bronx",
  3: "Brooklyn",
  4: "Queens",
  5: "Staten Island",
  "1": "Manhattan",
  "2": "Bronx",
  "3": "Brooklyn",
  "4": "Queens",
  "5": "Staten Island"
};

function displayField(value, label = "Not available", mapValue, mapType) {
  if (value === undefined) {
    return (
      <span className="notApplic" aria-label={`${label} not available`}>
        <span aria-hidden="true">N/A</span>
        <span className="visually-hidden">{label} not available</span>
      </span>
    );
  }

  // Helper to select the right map
  function mapWithType(val) {
    if (mapValue) return mapValue(val);
    if (mapType === "borough") return boroughNameMap[val] || val || "Unknown";
    if (mapType === "yesno") return YesNoMap[val] || val || "Unknown";
    if (mapType === "entirepartial") return EntirePartialMap[val] || val || "Unknown";
    if (mapType === "propertytype") return PropertyTypeMap(val);
    return val;
  }

  if (Array.isArray(value)) {
    const first = value[0];
    if (first === null || first === "") {
      return (
        <span className="notApplic" aria-label={`${label} is blank`}>
          <span aria-hidden="true">Blank</span>
          <span className="visually-hidden">{label} is blank</span>
        </span>
      );
    }
    return mapWithType(first);
  }
  if (value === null || value === "") {
    return (
      <span className="notApplic" aria-label={`${label} is blank`}>
        <span aria-hidden="true">Blank</span>
        <span className="visually-hidden">{label} is blank</span>
      </span>
    );
  }
  return mapWithType(value);
}

function renderExceptions(
  exceptions,
  { dtClass = "fw-bold", ddClass = "mb-2", dlClass = "border rounded bg-light p-2 mb-2 d-inline-block" } = {}
) {
  if (!exceptions || exceptions.length === 0) return null;

  // Helper for mapping values by key
  function mapExceptionValue(key, value) {
    if (value === null || value === "") return value;
    if (key === "borough") return boroughNameMap[value] || value || "Unknown";
    if (key === "property_type") return PropertyTypeMap(value);
    if (key === "easement" || key === "air_rights" || key === "subterranean_rights")
      return YesNoMap[value] || value || "Unknown";
    if (key === "partial_lot") return EntirePartialMap[value] || value || "Unknown";
    return value;
  }

  return (
    <div className="exceptions-stack d-flex flex-column">
      {exceptions.map((ex, idx) => (
        <dl key={idx} className={dlClass}>
          {Object.entries(ex)
            .filter(([k]) => k !== "document_ids")
            .map(([k, v]) => (
              <React.Fragment key={k}>
                <dt className={dtClass}>{k.replace(/_/g, " ")}:</dt>
                <dd className={ddClass}>
                  {v === null || v === ""
                    ? (
                      <span className="notApplic" aria-label={`${k} is blank`}>
                        <span aria-hidden="true">Blank</span>
                        <span className="visually-hidden">{k} is blank</span>
                      </span>
                    )
                    : Array.isArray(v)
                      ? v.map((item, i) =>
                        item === null || item === ""
                          ? <span key={i} className="notApplic" aria-label={`${k} is blank`}><span aria-hidden="true">Blank</span><span className="visually-hidden">{k} is blank</span></span>
                          : <span key={i}>{mapExceptionValue(k, item)}</span>
                      ).reduce((prev, curr) => [prev, ", ", curr])
                      : mapExceptionValue(k, v)
                  }
                </dd>
              </React.Fragment>
            ))}
          {ex.document_ids && (
            <>
              <dt className={dtClass}>Document IDs:</dt>
              <dd className={ddClass}>
                <ul className="list-unstyled mb-0">
                  {ex.document_ids.map((docId, i) => (
                    <li key={i} className="small d-flex align-items-center">
                      <span>{docId}</span>
                      <AcrisDetailLink document_id={docId} />
                      <AcrisViewDocLink document_id={docId} />
                    </li>
                  ))}
                </ul>
              </dd>
            </>
          )}
        </dl>
      ))}
    </div>
  );
}


function AddressParcelCard({
  borough,
  block,
  lot,
  street_number,
  street_name,
  //record_type,
  easement,
  partial_lot,
  air_rights,
  subterranean_rights,
  property_type,
  borough_consistency,
  block_consistency,
  lot_consistency,
  street_number_consistency,
  street_name_consistency,
  //record_type_consistency,
  easement_consistency,
  partial_lot_consistency,
  air_rights_consistency,
  subterranean_rights_consistency,
  property_type_consistency,
  borough_exceptions = [],
  block_exceptions = [],
  lot_exceptions = [],
  street_number_exceptions = [],
  street_name_exceptions = [],
  //record_type_exceptions = [],
  easement_exceptions = [],
  partial_lot_exceptions = [],
  air_rights_exceptions = [],
  subterranean_rights_exceptions = [],
  property_type_exceptions = [],
}) {

  const [showBoroughExceptions, setShowBoroughExceptions] = useState(false);
  const [showBlockExceptions, setShowBlockExceptions] = useState(false);
  const [showLotExceptions, setShowLotExceptions] = useState(false);
  const [showStreetNumberExceptions, setShowStreetNumberExceptions] = useState(false);
  const [showStreetNameExceptions, setShowStreetNameExceptions] = useState(false);
  const [showEasementExceptions, setShowEasementExceptions] = useState(false);
  const [showPartialLotExceptions, setShowPartialLotExceptions] = useState(false);
  const [showAirRightsExceptions, setShowAirRightsExceptions] = useState(false);
  const [showSubterraneanRightsExceptions, setShowSubterraneanRightsExceptions] = useState(false);
  const [showPropertyTypeExceptions, setShowPropertyTypeExceptions] = useState(false);

  return (
    <div className="card mb-3 shadow-sm w-100 p-1" aria-labelledby="address-parcel-card-title">
      <div className="card-body">
        <h4 id="address-parcel-card-title" className="card-title text-primary mb-3">
          Address Parcel Lookup Results
        </h4>
        {/* Row 1: Borough, Block, Lot */}
        <div className="d-flex flex-wrap mb-2">
          <div className="me-0 mb-2">
            {/* Borough */}
            <dl
              className="borough-data mb-3 me-3 w-auto border d-grid p-1"
              style={{
                gridTemplateColumns: "auto auto",
                gridTemplateRows: "auto auto",
                gap: "0.5rem"
              }}
            >
              <dt id="borough-label" className="fw-bold text-secondary fs-6" style={{ gridColumn: 1, gridRow: 1 }}>
                Borough
              </dt>
              <dt id="borough-consistency-label" className="visually-hidden" style={{ gridColumn: 2, gridRow: 1 }}>
                Search Consistency
              </dt>
              <dd aria-labelledby="borough-consistency-label" style={{ gridColumn: 2, gridRow: 1 }} className="text-secondary fs-6">
                {displayField(borough_consistency, "borough consistency")}
              </dd>
              <dd aria-labelledby="borough-label" className="text-primary fs-2" style={{ gridColumn: "1 / span 2", gridRow: 2 }}>
                {displayField(borough, "borough", null, "borough")}
              </dd>
              {borough_exceptions.length > 0 && (
                <>
                  <dt id="borough-exceptions-label" className="fw-bold visually-hidden" style={{ gridColumn: 1, gridRow: 3 }}>
                    Borough Exceptions
                  </dt>
                  <dd
                    aria-labelledby="borough-exceptions-label"
                    style={{ gridColumn: "1 / span 2", gridRow: 4, padding: 0 }}
                    className="p-0"
                  >
                    <div className="accordion">
                      <Accordion
                        id="borough-exceptions"
                        title="Borough Exceptions"
                        show={showBoroughExceptions}
                        onClick={() => setShowBoroughExceptions((v) => !v)}
                      >
                        {renderExceptions(borough_exceptions)}
                      </Accordion>
                    </div>
                  </dd>
                </>
              )}
            </dl>
          </div>
          <div className="me-0 mb-2">
            {/* Block */}
            <dl
              className="block-data mb-3 me-3 w-auto border d-grid p-1"
              style={{
                gridTemplateColumns: "auto auto",
                gridTemplateRows: "auto auto",
                gap: "0.5rem"
              }}
            >
              <dt id="block-label" className="fw-bold text-secondary fs-6" style={{ gridColumn: 1, gridRow: 1 }}>
                Block
              </dt>
              <dt id="block-consistency-label" className="visually-hidden" style={{ gridColumn: 2, gridRow: 1 }}>
                Search Consistency
              </dt>
              <dd aria-labelledby="block-consistency-label" style={{ gridColumn: 2, gridRow: 1 }} className="text-secondary fs-6">
                {displayField(block_consistency, "block consistency")}
              </dd>
              <dd aria-labelledby="block-label" className="text-primary fs-2" style={{ gridColumn: "1 / span 2", gridRow: 2 }}>
                {displayField(block, "block")}
              </dd>
              {block_exceptions.length > 0 && (
                <>
                  <dt id="block-exceptions-label" className="fw-bold visually-hidden" style={{ gridColumn: 1, gridRow: 3 }}>
                    Block Exceptions
                  </dt>
                  <dd
                    aria-labelledby="block-exceptions-label"
                    style={{ gridColumn: "1 / span 2", gridRow: 4, padding: 0 }}
                    className="p-0"
                  >
                    <div className="accordion">
                      <Accordion
                        id="block-exceptions"
                        title="Block Exceptions"
                        show={showBlockExceptions}
                        onClick={() => setShowBlockExceptions((v) => !v)}
                      >
                        {renderExceptions(block_exceptions)}
                      </Accordion>
                    </div>
                  </dd>
                </>
              )}
            </dl>
          </div>
          <div className="me-0 mb-2">
            {/* Lot */}
            <dl
              className="lot-data mb-3 me-3 w-auto border d-grid p-1"
              style={{
                gridTemplateColumns: "auto auto",
                gridTemplateRows: "auto auto",
                gap: "0.5rem"
              }}
            >
              <dt id="lot-label" className="fw-bold text-secondary fs-6" style={{ gridColumn: 1, gridRow: 1 }}>
                Lot
              </dt>
              <dt id="lot-consistency-label" className="visually-hidden" style={{ gridColumn: 2, gridRow: 1 }}>
                Search Consistency
              </dt>
              <dd aria-labelledby="lot-consistency-label" style={{ gridColumn: 2, gridRow: 1 }} className="text-secondary fs-6">
                {displayField(lot_consistency, "lot consistency")}
              </dd>
              <dd aria-labelledby="lot-label" className="text-primary fs-2" style={{ gridColumn: "1 / span 2", gridRow: 2 }}>
                {displayField(lot, "lot")}
              </dd>
              {lot_exceptions.length > 0 && (
                <>
                  <dt id="lot-exceptions-label" className="fw-bold visually-hidden" style={{ gridColumn: 1, gridRow: 3 }}>
                    Lot Exceptions
                  </dt>
                  <dd
                    aria-labelledby="lot-exceptions-label"
                    style={{ gridColumn: "1 / span 2", gridRow: 4, padding: 0 }}
                    className="p-0"
                  >
                    <div className="accordion">
                      <Accordion
                        id="lot-exceptions"
                        title="Lot Exceptions"
                        show={showLotExceptions}
                        onClick={() => setShowLotExceptions((v) => !v)}
                      >
                        {renderExceptions(lot_exceptions)}
                      </Accordion>
                    </div>
                  </dd>
                </>
              )}
            </dl>
          </div>
        </div>
        {/* Row 2: Street Number, Street Name */}
        <div className="d-flex flex-wrap mb-2">
          <div className="col-12 col-lg-auto p-0">
            {/* Street Number */}
            <dl
              className="street-number-data mb-3 me-3 w-auto border d-grid p-1"
              style={{
                gridTemplateColumns: "auto auto",
                gridTemplateRows: "auto auto",
                gap: "0.5rem"
              }}
            >
              <dt id="street-number-label" className="fw-bold text-secondary fs-6" style={{ gridColumn: 1, gridRow: 1 }}>
                Street Number
              </dt>
              <dt id="street-number-consistency-label" className="fw-bold visually-hidden" style={{ gridColumn: 2, gridRow: 1 }}>
                Search Consistency
              </dt>
              <dd aria-labelledby="street-number-consistency-label" style={{ gridColumn: 2, gridRow: 1 }} className="text-secondary fs-6">
                {displayField(street_number_consistency, "street_number consistency")}
              </dd>
              <dd aria-labelledby="street-number-label" className="text-primary fs-2" style={{ gridColumn: "1 / span 2", gridRow: 2 }}>
                {displayField(street_number, "street_number")}
              </dd>
              {street_number_exceptions.length > 0 && (
                <>
                  <dt id="street-number-exceptions-label" className="fw-bold visually-hidden" style={{ gridColumn: 1, gridRow: 3 }}>
                    Street Number Exceptions
                  </dt>
                  <dd
                    aria-labelledby="street-number-exceptions-label"
                    style={{ gridColumn: "1 / span 2", gridRow: 4, padding: 0 }}
                    className="p-0"
                  >
                    <div className="accordion">
                      <Accordion
                        id="street-number-exceptions"
                        title="Street Number Exceptions"
                        show={showStreetNumberExceptions}
                        onClick={() => setShowStreetNumberExceptions((v) => !v)}
                      >
                        {renderExceptions(street_number_exceptions)}
                      </Accordion>
                    </div>
                  </dd>
                </>
              )}
            </dl>
          </div>
          <div className="col-12 col-lg-auto p-0">
            {/* Street Name */}
            <dl
              className="street-name-data mb-3 me-3 w-auto border d-grid p-1"
              style={{
                gridTemplateColumns: "auto auto",
                gridTemplateRows: "auto auto",
                gap: "0.5rem"
              }}
            >
              <dt id="street-name-label" className="fw-bold text-secondary fs-6" style={{ gridColumn: 1, gridRow: 1 }}>
                Street Name
              </dt>
              <dt id="street-name-consistency-label" className="fw-bold visually-hidden" style={{ gridColumn: 2, gridRow: 1 }}>
                Search Consistency
              </dt>
              <dd aria-labelledby="street-name-consistency-label" style={{ gridColumn: 2, gridRow: 1 }} className="text-secondary fs-6">
                {displayField(street_name_consistency, "street_name consistency")}
              </dd>
              <dd aria-labelledby="street-name-label" className="text-primary fs-2" style={{ gridColumn: "1 / span 2", gridRow: 2 }}>
                {displayField(street_name, "street_name")}
              </dd>
              {street_name_exceptions.length > 0 && (
                <>
                  <dt id="street-name-exceptions-label" className="fw-bold visually-hidden" style={{ gridColumn: 1, gridRow: 3 }}>
                    Street Name Exceptions
                  </dt>
                  <dd
                    aria-labelledby="street-name-exceptions-label"
                    style={{ gridColumn: "1 / span 2", gridRow: 4, padding: 0 }}
                    className="p-0"
                  >
                    <div className="accordion">
                      <Accordion
                        id="street-name-exceptions"
                        title="Street Name Exceptions"
                        show={showStreetNameExceptions}
                        onClick={() => setShowStreetNameExceptions((v) => !v)}
                      >
                        {renderExceptions(street_name_exceptions)}
                      </Accordion>
                    </div>
                  </dd>
                </>
              )}
            </dl>
          </div>
        </div>
        {/* Row 3: Remaining fields */}
        <div className="d-flex flex-wrap mb-2">
          <div className="me-0 mb-2">
            {/* Easement */}
            <dl
              className="easement-data mb-3 me-3 w-auto border d-grid p-1"
              style={{
                gridTemplateColumns: "auto auto",
                gridTemplateRows: "auto auto",
                gap: "0.5rem"
              }}
            >
              <dt id="easement-label" className="fw-bold text-secondary fs-6" style={{ gridColumn: 1, gridRow: 1 }}>
                Easement
              </dt>
              <dt id="easement-consistency-label" className="fw-bold visually-hidden" style={{ gridColumn: 2, gridRow: 1 }}>
                Search Consistency
              </dt>
              <dd aria-labelledby="easement-consistency-label" style={{ gridColumn: 2, gridRow: 1 }} className="text-secondary fs-6">
                {displayField(easement_consistency, "easement consistency")}
              </dd>
              <dd aria-labelledby="easement-label" className="text-primary fs-2" style={{ gridColumn: "1 / span 2", gridRow: 2 }}>
                {displayField(easement, "easement", null, "yesno")}
              </dd>
              {easement_exceptions.length > 0 && (
                <>
                  <dt id="easement-exceptions-label" className="fw-bold visually-hidden" style={{ gridColumn: 1, gridRow: 3 }}>
                    Easement Exceptions
                  </dt>
                  <dd
                    aria-labelledby="easement-exceptions-label"
                    style={{ gridColumn: "1 / span 2", gridRow: 4, padding: 0 }}
                    className="p-0"
                  >
                    <div className="accordion">
                      <Accordion
                        id="easement-exceptions"
                        title="Easement Exceptions"
                        show={showEasementExceptions}
                        onClick={() => setShowEasementExceptions((v) => !v)}
                      >
                        {renderExceptions(easement_exceptions)}
                      </Accordion>
                    </div>
                  </dd>
                </>
              )}
            </dl>
          </div>
          <div className="me-0 mb-2">
            {/* Partial Lot */}
            <dl
              className="partial-lot-data mb-3 me-3 w-auto border d-grid p-1"
              style={{
                gridTemplateColumns: "auto auto",
                gridTemplateRows: "auto auto",
                gap: "0.5rem"
              }}
            >
              <dt id="partial-lot-label" className="fw-bold text-secondary fs-6" style={{ gridColumn: 1, gridRow: 1 }}>
                Partial Lot
              </dt>
              <dt id="partial-lot-consistency-label" className="fw-bold visually-hidden" style={{ gridColumn: 2, gridRow: 1 }}>
                Search Consistency
              </dt>
              <dd aria-labelledby="partial-lot-consistency-label" style={{ gridColumn: 2, gridRow: 1 }} className="text-secondary fs-6">
                {displayField(partial_lot_consistency, "partial_lot consistency")}
              </dd>
              <dd aria-labelledby="partial-lot-label" className="text-primary fs-2" style={{ gridColumn: "1 / span 2", gridRow: 2 }}>
                {displayField(partial_lot, "partial_lot", null, "entirepartial")}
              </dd>
              {partial_lot_exceptions.length > 0 && (
                <>
                  <dt id="partial-lot-exceptions-label" className="fw-bold visually-hidden" style={{ gridColumn: 1, gridRow: 3 }}>
                    Partial Lot Exceptions
                  </dt>
                  <dd
                    aria-labelledby="partial-lot-exceptions-label"
                    style={{ gridColumn: "1 / span 2", gridRow: 4, padding: 0 }}
                    className="p-0"
                  >
                    <div className="accordion">
                      <Accordion
                        id="partial-lot-exceptions"
                        title="Partial Lot Exceptions"
                        show={showPartialLotExceptions}
                        onClick={() => setShowPartialLotExceptions((v) => !v)}
                      >
                        {renderExceptions(partial_lot_exceptions)}
                      </Accordion>
                    </div>
                  </dd>
                </>
              )}
            </dl>
          </div>
          <div className="me-0 mb-2">
            {/* Air Rights */}
            <dl
              className="air-rights-data mb-3 me-3 w-auto border d-grid p-1"
              style={{
                gridTemplateColumns: "auto auto",
                gridTemplateRows: "auto auto",
                gap: "0.5rem"
              }}
            >
              <dt id="air-rights-label" className="fw-bold text-secondary fs-6" style={{ gridColumn: 1, gridRow: 1 }}>
                Air Rights
              </dt>
              <dt id="air-rights-consistency-label" className="fw-bold visually-hidden" style={{ gridColumn: 2, gridRow: 1 }}>
                Search Consistency
              </dt>
              <dd aria-labelledby="air-rights-consistency-label" style={{ gridColumn: 2, gridRow: 1 }} className="text-secondary fs-6">
                {displayField(air_rights_consistency, "air_rights consistency")}
              </dd>
              <dd aria-labelledby="air-rights-label" className="text-primary fs-2" style={{ gridColumn: "1 / span 2", gridRow: 2 }}>
                {displayField(air_rights, "air_rights", null, "yesno")}
              </dd>
              {air_rights_exceptions.length > 0 && (
                <>
                  <dt id="air-rights-exceptions-label" className="fw-bold visually-hidden" style={{ gridColumn: 1, gridRow: 3 }}>
                    Air Rights Exceptions
                  </dt>
                  <dd
                    aria-labelledby="air-rights-exceptions-label"
                    style={{ gridColumn: "1 / span 2", gridRow: 4, padding: 0 }}
                    className="p-0"
                  >
                    <div className="accordion">
                      <Accordion
                        id="air-rights-exceptions"
                        title="air-rights Exceptions"
                        show={showAirRightsExceptions}
                        onClick={() => setShowAirRightsExceptions((v) => !v)}
                      >
                        {renderExceptions(air_rights_exceptions)}
                      </Accordion>
                    </div>
                  </dd>
                </>
              )}
            </dl>
          </div>
          <div className="me-0 mb-2">
            {/* Subterranean Rights */}
            <dl
              className="subterranean-rights-data mb-3 me-3 w-auto border d-grid p-1"
              style={{
                gridTemplateColumns: "auto auto",
                gridTemplateRows: "auto auto",
                gap: "0.5rem"
              }}
            >
              <dt id="subterranean-rights-label" className="fw-bold text-secondary fs-6" style={{ gridColumn: 1, gridRow: 1 }}>
                Subterranean Rights
              </dt>
              <dt id="subterranean-rights-consistency-label" className="fw-bold visually-hidden" style={{ gridColumn: 2, gridRow: 1 }}>
                Search Consistency
              </dt>
              <dd aria-labelledby="subterranean-rights-consistency-label" style={{ gridColumn: 2, gridRow: 1 }} className="text-secondary fs-6">
                {displayField(subterranean_rights_consistency, "subterranean_rights consistency")}
              </dd>
              <dd aria-labelledby="subterranean-rights-label" className="text-primary fs-2" style={{ gridColumn: "1 / span 2", gridRow: 2 }}>
                {displayField(subterranean_rights, "subterranean_rights", null, "yesno")}
              </dd>
              {subterranean_rights_exceptions.length > 0 && (
                <>
                  <dt id="subterranean-rights-exceptions-label" className="fw-bold visually-hidden" style={{ gridColumn: 1, gridRow: 3 }}>
                    Subterranean Rights Exceptions
                  </dt>
                  <dd
                    aria-labelledby="subterranean-rights-exceptions-label"
                    style={{ gridColumn: "1 / span 2", gridRow: 4, padding: 0 }}
                    className="p-0"
                  >
                    <div className="accordion">
                      <Accordion
                        id="subterranean-rights-exceptions"
                        title="subterranean-rights Exceptions"
                        show={showSubterraneanRightsExceptions}
                        onClick={() => setShowSubterraneanRightsExceptions((v) => !v)}
                      >
                        {renderExceptions(subterranean_rights_exceptions)}
                      </Accordion>
                    </div>
                  </dd>
                </>
              )}
            </dl>
          </div>
          <div className="me-0 mb-2">
            {/* Property Type */}
            <dl
              className="property-type-data mb-3 me-3 w-auto border d-grid p-1"
              style={{
                gridTemplateColumns: "auto auto",
                gridTemplateRows: "auto auto",
                gap: "0.5rem"
              }}
            >
              <dt id="property-type-label" className="fw-bold text-secondary fs-6" style={{ gridColumn: 1, gridRow: 1 }}>
                Property Type
              </dt>
              <dt id="property-type-consistency-label" className="fw-bold visually-hidden" style={{ gridColumn: 2, gridRow: 1 }}>
                Search Consistency
              </dt>
              <dd aria-labelledby="property-type-consistency-label" style={{ gridColumn: 2, gridRow: 1 }} className="text-secondary fs-6">
                {displayField(property_type_consistency, "property_type consistency")}
              </dd>
              <dd aria-labelledby="property-type-label" className="text-primary fs-2" style={{ gridColumn: "1 / span 2", gridRow: 2 }}>
                {displayField(property_type, "property_type", null, "propertytype")}
              </dd>
              {property_type_exceptions.length > 0 && (
                <>
                  <dt id="property-type-exceptions-label" className="fw-bold visually-hidden" style={{ gridColumn: 1, gridRow: 3 }}>
                    Property Type Exceptions
                  </dt>
                  <dd
                    aria-labelledby="property-type-exceptions-label"
                    style={{ gridColumn: "1 / span 2", gridRow: 4, padding: 0 }}
                    className="p-0"
                  >
                    <div className="accordion">
                      <Accordion
                        id="property-type-exceptions"
                        title="Property Type Exceptions"
                        show={showPropertyTypeExceptions}
                        onClick={() => setShowPropertyTypeExceptions((v) => !v)}
                      >
                        {renderExceptions(property_type_exceptions)}
                      </Accordion>
                    </div>
                  </dd>
                </>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddressParcelCard;
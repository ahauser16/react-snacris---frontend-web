import React, { useState } from "react";
import "./addressParcelCard.css";
import { Link } from "react-router-dom";
import getPropertyTypeData from "../../components/utils/acris/getPropertyTypeData";

function mapYesNo(value) {
  if (value === "Y") return "YES";
  if (value === "N") return "NO";
  return displayField(value);
}

function mapPartialLot(value) {
  if (value === "E") return "ENTIRE LOT";
  if (value === "P") return "PARTIAL LOT";
  return displayField(value);
}

function displayField(value, label = "Not available") {
  if (value === undefined || value === null || value === "") {
    return (
      <span className="notApplic" aria-label={`${label} not available`}>
        <span aria-hidden="true">N/A</span>
        <span className="visually-hidden">{label} not available</span>
      </span>
    );
  }
  return value;
}

function AccordionSection({ id, title, show, onClick, children, alertClass }) {
  return (
    <div className={`accordion-item`}>
      <h2 className="accordion-header" id={`heading-${id}`}>
        <button
          className={`accordion-button ${!show ? "collapsed" : ""} ${alertClass ? alertClass : ""}`}
          type="button"
          onClick={onClick}
          aria-expanded={show}
          aria-controls={`collapse-${id}`}
        >
          {title}
        </button>
      </h2>
      <div
        id={`collapse-${id}`}
        className={`accordion-collapse collapse${show ? " show" : ""}`}
        aria-labelledby={`heading-${id}`}
      >
        <div className="accordion-body">{children}</div>
      </div>
    </div>
  );
}

function Exceptions({ exceptions }) {
  if (!exceptions || exceptions.length === 0) return null;
  return (
    <div className="alert alert-warning mt-3">
      <h6>Exceptions:</h6>
      <ul className="list-unstyled mb-0">
        {exceptions.map((ex, idx) => {
          const detailUrl = `https://a836-acris.nyc.gov/DS/DocumentSearch/DocumentDetail?doc_id=${ex.document_id}`;
          const imageUrl = `https://a836-acris.nyc.gov/DS/DocumentSearch/DocumentImageView?doc_id=${ex.document_id}`;
          return (
            <li key={idx}>
              <strong>{ex.field}</strong>:{" "}
              {ex.field === "property_type"
                ? getPropertyTypeData(ex.value) || ex.value
                : ex.value}
              {" "}
              (document_id: {ex.document_id}){" "}
              <a
                href={detailUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-link btn-sm p-0 ms-2"
              >
                Document Detail
              </a>
              <a
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-link btn-sm p-0 ms-2"
              >
                View Document
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function VariantStreetAddresses({ addresses }) {
  return (
    <div className="alert alert-info mt-3">
      <h6 className="card-subtitle mb-2">Variant Street Addresses:</h6>
      <ul className="list-unstyled mb-0">
        {addresses.length > 0 ? (
          addresses.map((address, idx) => {
            const detailUrl = address.document_id
              ? `https://a836-acris.nyc.gov/DS/DocumentSearch/DocumentDetail?doc_id=${address.document_id}`
              : null;
            const imageUrl = address.document_id
              ? `https://a836-acris.nyc.gov/DS/DocumentSearch/DocumentImageView?doc_id=${address.document_id}`
              : null;
            return (
              <li key={idx}>
                {displayField(address.street_number, "Street Number")}{" "}
                {displayField(address.street_name, "Street Name")}
                {address.document_id && (
                  <>
                    {" "}
                    <a
                      href={detailUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-link btn-sm p-0 ms-2"
                    >
                      Document Detail
                    </a>
                    <a
                      href={imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-link btn-sm p-0 ms-2"
                    >
                      View Document
                    </a>
                  </>
                )}
              </li>
            );
          })
        ) : (
          <li>
            <span className="notApplic" aria-label="Street address not available">
              <span aria-hidden="true">N/A</span>
              <span className="visually-hidden">Street address not available</span>
            </span>
          </li>
        )}
      </ul>
    </div>
  );
}


function AddressParcelCard({
  borough,
  block,
  lot,
  addresses,
  easement,
  partial_lot,
  air_rights,
  subterranean_rights,
  property_type,
  exceptions = [],
}) {
  console.debug(
    "AddressParcelCard",
    borough,
    block,
    lot,
    addresses,
    easement,
    partial_lot,
    air_rights,
    subterranean_rights,
    property_type,
    exceptions
  );

  const [openSection, setOpenSection] = useState("addresses");

  const boroughName = {
    1: "Manhattan",
    2: "Bronx",
    3: "Brooklyn",
    4: "Queens",
    5: "Staten Island",
    "1": "Manhattan",
    "2": "Bronx",
    "3": "Brooklyn",
    "4": "Queens",
    "5": "Staten Island",
  }[borough] || "Unknown";

  const propertyTypeName = getPropertyTypeData(property_type);

  return (
    <div className="card mb-3 shadow-sm w-100 p-1">
      <div className="card-body">
        <h4 className="card-title text-primary mb-3">
          {boroughName}, Block {block}, Lot {lot}
        </h4>
        <h6>Easement: {mapYesNo(easement)}</h6>
        <h6>Partial Lot: {mapPartialLot(partial_lot)}</h6>
        <h6>Air Rights: {mapYesNo(air_rights)}</h6>
        <h6>Subterranean Rights: {mapYesNo(subterranean_rights)}</h6>
        <h6>
          Property Type: {displayField(propertyTypeName || property_type, "Property Type")}
        </h6>
        <div className="accordion mt-3" id={`accordion-${block}-${lot}`}>
          <AccordionSection
            id="addresses"
            title="Variant Street Addresses"
            show={openSection === "addresses"}
            onClick={() => setOpenSection(openSection === "addresses" ? null : "addresses")}
            alertClass="alert-info"
          >
            <VariantStreetAddresses addresses={addresses} />
          </AccordionSection>
          {exceptions && exceptions.length > 0 && (
            <AccordionSection
              id="exceptions"
              title="Exceptions"
              show={openSection === "exceptions"}
              onClick={() => setOpenSection(openSection === "exceptions" ? null : "exceptions")}
              alertClass="alert-warning"
            >
              <Exceptions exceptions={exceptions} />
            </AccordionSection>
          )}
        </div>
        <Link className="btn btn-primary fw-bold me-3 mt-3" to="/ParcelIdentifierSearch">
          Search For Documents
        </Link>
      </div>
    </div>
  );
}


export default AddressParcelCard;
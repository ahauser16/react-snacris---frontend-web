import React from "react";
import getPropertyTypeData from "../../../hooks/acris/getPropertyTypeData";
import "./commonRealPropCardDisplay.css";
import displayDateTime from "../../../hooks/displayDateTime";
import "./commonRealPropCardDisplay.css";

function RealPropertyLegalsCard({
  document_id,
  record_type,
  borough,
  block,
  lot,
  easement,
  partial_lot,
  air_rights,
  subterranean_rights,
  property_type,
  street_number,
  street_name,
  unit_address,
  good_through_date,
}) {
  console.debug(
    "RealPropertyLegalsCard",
    document_id,
    record_type,
    borough,
    block,
    lot,
    easement,
    partial_lot,
    air_rights,
    subterranean_rights,
    property_type,
    street_number,
    street_name,
    unit_address,
    good_through_date
  );

  const propertyTypeName = getPropertyTypeData(property_type);

  const decodedBoroughName =
    {
      1: "Manhattan",
      2: "Bronx",
      3: "Brooklyn",
      4: "Queens",
      5: "Staten Island",
    }[borough] || "Unknown";

  const decodedRecordTypeName =
    {
      A: "Master",
      L: "Legals",
      R: "Remarks",
      X: "References",
      P: "Parties",
    }[record_type] || "Unknown";

  const convertedGoodThroughDate = displayDateTime(good_through_date);

  return (
    <div className="card mb-3 shadow-sm w-100">
      <div className="card-body">
        <h4
          className="card-title text-primary mb-3"
          aria-label="Real Property Legal Data"
        >
          {decodedRecordTypeName}
        </h4>

        <div className="text-start">
          {decodedBoroughName && decodedBoroughName !== "Unknown" ? (
            <h6 className="card-text">Borough: {decodedBoroughName}</h6>
          ) : (
            <h6
              className="card-text notApplic"
              aria-label="Borough not available"
            >
              Borough: <span aria-hidden="true">N/A</span>
              <span className="visually-hidden">Borough not available</span>
            </h6>
          )}

          {block ? (
            <h6 className="card-text">Tax Block: {block}</h6>
          ) : (
            <h6
              className="card-text notApplic"
              aria-label="Tax block not available"
            >
              Tax Block: <span aria-hidden="true">N/A</span>
              <span className="visually-hidden">Tax block not available</span>
            </h6>
          )}

          {lot ? (
            <h6 className="card-text">Tax Lot: {lot}</h6>
          ) : (
            <h6
              className="card-text notApplic"
              aria-label="Tax lot not available"
            >
              Tax Lot: <span aria-hidden="true">N/A</span>
              <span className="visually-hidden">Tax lot not available</span>
            </h6>
          )}

          {propertyTypeName && propertyTypeName !== "Unknown" ? (
            <h6 className="card-text">Property Type: {propertyTypeName}</h6>
          ) : (
            <h6
              className="card-text notApplic"
              aria-label="Property type not available"
            >
              Property Type: <span aria-hidden="true">N/A</span>
              <span className="visually-hidden">
                Property type not available
              </span>
            </h6>
          )}

          {street_number ? (
            <h6 className="card-text">Street Number: {street_number}</h6>
          ) : (
            <h6
              className="card-text notApplic"
              aria-label="Street number not available"
            >
              Street Number: <span aria-hidden="true">N/A</span>
              <span className="visually-hidden">
                Street number not available
              </span>
            </h6>
          )}

          {street_name ? (
            <h6 className="card-text">Street Name: {street_name}</h6>
          ) : (
            <h6
              className="card-text notApplic"
              aria-label="Street name not available"
            >
              Street Name: <span aria-hidden="true">N/A</span>
              <span className="visually-hidden">Street name not available</span>
            </h6>
          )}

          {unit_address ? (
            <h6 className="card-text">Unit Address: {unit_address}</h6>
          ) : (
            <h6
              className="card-text notApplic"
              aria-label="Unit address not applicable"
            >
              Unit Address: <span aria-hidden="true">N/A</span>
              <span className="visually-hidden">
                Unit address not applicable
              </span>
            </h6>
          )}

          <h6 className="card-text">Easement: {easement ? "Yes" : "No"}</h6>
          <h6 className="card-text">
            Partial Lot: {partial_lot ? "Yes" : "No"}
          </h6>
          <h6 className="card-text">Air Rights: {air_rights ? "Yes" : "No"}</h6>
          <h6 className="card-text">
            Subterranean Rights: {subterranean_rights ? "Yes" : "No"}
          </h6>

          {convertedGoodThroughDate ? (
            <h6 className="card-text">
              Good Through Date: {convertedGoodThroughDate}
            </h6>
          ) : (
            <h6
              className="card-text notApplic"
              aria-label="Good through date not available"
            >
              Good Through Date: <span aria-hidden="true">N/A</span>
              <span className="visually-hidden">
                Good through date not available
              </span>
            </h6>
          )}
        </div>
      </div>
    </div>
  );
}

export default RealPropertyLegalsCard;

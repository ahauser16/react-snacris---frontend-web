import React from "react";
import getDocTypeData from "../../../hooks/acris/getDocTypeData";
import displayDateTime from "../../../hooks/displayDateTime";
import "./commonRealPropCardDisplay.css";

import "./commonRealPropCardDisplay.css";

function RealPropertyPartiesCard({
  document_id,
  record_type,
  party_type,
  name,
  address_1,
  address_2,
  country,
  city,
  state,
  zip,
  good_through_date,
  doc_type,
}) {
  console.debug(
    "RealPropertyPartiesCard",
    document_id,
    record_type,
    party_type,
    name,
    address_1,
    address_2,
    country,
    city,
    state,
    zip,
    good_through_date,
    doc_type
  );

  //this `doc_type` value is not used in the Parties dataset and is obtained in the Master dataset
  const docTypeData = getDocTypeData(doc_type);
  const partyTypeName = docTypeData[`party${party_type}_type`] || "Unknown";

  const decodedRecordTypeName =
    {
      A: "Master",
      L: "Lot",
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
          aria-label="Real Property Party Data"
        >
          {decodedRecordTypeName}
        </h4>

        <div className="text-start">
          {name ? (
            <h6 className="card-text">Name: {name}</h6>
          ) : (
            <h6 className="card-text notApplic" aria-label="Name not available">
              Name: <span aria-hidden="true">N/A</span>
              <span className="visually-hidden">Name not available</span>
            </h6>
          )}

          {partyTypeName && partyTypeName !== "Unknown" ? (
            <h6 className="card-text">
              Role: {partyTypeName} ({docTypeData.doc__type_description})
            </h6>
          ) : (
            <h6 className="card-text notApplic" aria-label="Role not available">
              Role: <span aria-hidden="true">N/A</span>
              <span className="visually-hidden">Role not available</span>
            </h6>
          )}

          {address_1 ? (
            <h6 className="card-text">Address 1: {address_1}</h6>
          ) : (
            <h6
              className="card-text notApplic"
              aria-label="Address 1 not available"
            >
              Address 1: <span aria-hidden="true">N/A</span>
              <span className="visually-hidden">Address 1 not available</span>
            </h6>
          )}

          {address_2 ? (
            <h6 className="card-text">Address 2: {address_2}</h6>
          ) : (
            <h6
              className="card-text notApplic"
              aria-label="Address 2 data not available"
            >
              Address 2: <span aria-hidden="true">N/A</span>
              <span className="visually-hidden">
                Address 2 data not available
              </span>
            </h6>
          )}

          {city ? (
            <h6 className="card-text">City: {city}</h6>
          ) : (
            <h6 className="card-text notApplic" aria-label="City not available">
              City: <span aria-hidden="true">N/A</span>
              <span className="visually-hidden">City not available</span>
            </h6>
          )}

          {state ? (
            <h6 className="card-text">State: {state}</h6>
          ) : (
            <h6
              className="card-text notApplic"
              aria-label="State not available"
            >
              State: <span aria-hidden="true">N/A</span>
              <span className="visually-hidden">State not available</span>
            </h6>
          )}

          {zip ? (
            <h6 className="card-text">Zip: {zip}</h6>
          ) : (
            <h6
              className="card-text notApplic"
              aria-label="Zip code not available"
            >
              Zip: <span aria-hidden="true">N/A</span>
              <span className="visually-hidden">Zip code not available</span>
            </h6>
          )}

          {country ? (
            <h6 className="card-text">Country: {country}</h6>
          ) : (
            <h6
              className="card-text notApplic"
              aria-label="Country not available"
            >
              Country: <span aria-hidden="true">N/A</span>
              <span className="visually-hidden">Country not available</span>
            </h6>
          )}

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

export default RealPropertyPartiesCard;

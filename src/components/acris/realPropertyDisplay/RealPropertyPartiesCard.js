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
    doc_type
}) {
    console.debug("RealPropertyPartiesCard",
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
        doc_type);

    //this `doc_type` value is not used in the Parties dataset and is obtained in the Master dataset
    const docTypeData = getDocTypeData(doc_type);
    const partyTypeName = docTypeData[`party${party_type}_type`] || "Unknown";

    const decodedRecordTypeName = {
        "A": "Master",
        "L": "Lot",
        "R": "Remarks",
        "X": "References",
        "P": "Parties"
    }[record_type] || "Unknown";

    const convertedGoodThroughDate = displayDateTime(good_through_date);

    return (
        <div className="card mb-3 shadow-sm w-100">
            <div className="card-body">
                <h4 className="card-title text-primary mb-3" aria-label="Real Property Party Data">
                    {decodedRecordTypeName}
                </h4>

                <div className="text-start">
                    <h6 className="card-text">Name: {name}</h6>
                    <h6 className="card-text">Role: {partyTypeName} ({docTypeData.doc__type_description})</h6>
                    <h6 className="card-text">Address 1: {address_1}</h6>

                    {address_2 ? (
                        <h6 className="card-text">Address 2: {address_2}</h6>
                    ) : (
                        <h6 className="card-text notApplic" aria-label="Address 2 data not available">Address 2:{" "}
                            <span aria-hidden="true">N/A</span>
                            <span className="visually-hidden">Address 2 data not available</span>
                        </h6>
                    )}
                    <h6 className="card-text">City: {city}</h6>
                    <h6 className="card-text">State: {state}</h6>
                    <h6 className="card-text">Zip: {zip}</h6>
                    <h6 className="card-text">Country: {country}</h6>
                    <h6 className="card-text">Good Through Date: {convertedGoodThroughDate}</h6>
                </div>
            </div>
        </div >
    );
}

export default RealPropertyPartiesCard;

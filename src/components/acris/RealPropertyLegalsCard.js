import React from "react";
import getPropertyTypeData from "../utils/acris/getPropertyTypeData";
import "./acrisRealPropCard.css";
import displayDateTime from "../utils/displayDateTime";

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
    good_through_date
}) {
    console.debug("RealPropertyLegalsCard", document_id,
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
        good_through_date);

    const propertyTypeName = getPropertyTypeData(property_type);

    const decodedBoroughName = {
        1: "Manhattan",
        2: "Bronx",
        3: "Brooklyn",
        4: "Queens",
        5: "Staten Island"
    }[borough] || "Unknown";

    const decodedRecordTypeName = {
        "A": "Master",
        "L": "Lot",
        "R": "Remarks",
        "X": "References",
        "P": "Parties"
    }[record_type] || "Unknown";

    const convertedGoodThroughDate = displayDateTime(good_through_date);

    return (
        <div className="card mb-3 shadow-sm col-6 mx-auto">
            <div className="card-body row">
                <h4 className="card-title text-primary mb-3 row">
                    Real Property Lot Data
                </h4>
                <h5 className="card-title text-secondary mb-3 row">
                    {document_id ? (
                        `Document ID: ${document_id} `
                    ) : (
                        ""
                    )}
                </h5>

                <div className="text-start">
                    <h6 className="card-text">Location (Borough/County): {decodedBoroughName}</h6>
                    <h6 className="card-text">Tax Block Number: {block}</h6>
                    <h6 className="card-text">Tax Lot Number: {lot}</h6>
                    <h6 className="card-text">Property Type: {propertyTypeName}</h6>
                    <h6 className="card-text">Street Number: {street_number}</h6>
                    <h6 className="card-text">Street Name: {street_name}</h6>
                    {unit_address ? (
                        <h6 className="card-text">Unit Address: {unit_address}</h6>
                    ) : (
                        <h6 className="card-text">Unit Address: Not Applicable</h6>
                    )}
                    <h6 className="card-text">Easement: {easement ? "Yes" : "No"}</h6>
                    <h6 className="card-text">Partial Lot: {partial_lot ? "Yes" : "No"}</h6>
                    <h6 className="card-text">Air Rights: {air_rights ? "Yes" : "No"}</h6>
                    <h6 className="card-text">Subterranean Rights: {subterranean_rights ? "Yes" : "No"}</h6>
                    <h6 className="card-text">API Data Source: Real Property {decodedRecordTypeName} Dataset</h6>
                    <h6 className="card-text">Good Through Date: {convertedGoodThroughDate}</h6>
                </div>
            </div>
        </div >
    );
}

export default RealPropertyLegalsCard;

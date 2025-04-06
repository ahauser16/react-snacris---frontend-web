import React from "react";
import displayDateTime from "../utils/displayDateTime";
import "./acrisRealPropCard.css";

function RealPropertyRemarksCard({
    document_id,
    record_type,
    sequence_number,
    remark_text,
    good_through_date
}) {
    console.debug("RealPropertyPartiesCard",
        document_id,
        record_type,
        sequence_number,
        remark_text,
        good_through_date
    );


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
                    Real Property Remarks Data
                </h4>
                <h5 className="card-title text-secondary mb-3 row">
                    {document_id ? (
                        `Document ID: ${document_id} `
                    ) : (
                        ""
                    )}
                </h5>
                <div className="text-start">
                    <h6 className="card-text">Sequence Number: {sequence_number}</h6>
                    <h6 className="card-text">Remark Text: {remark_text}</h6>
                    <h6 className="card-text">API Data Source: Real Property {decodedRecordTypeName} Dataset</h6>
                    <h6 className="card-text">Good Through Date: {convertedGoodThroughDate}</h6>
                </div>
            </div>
        </div >
    );
}

export default RealPropertyRemarksCard;

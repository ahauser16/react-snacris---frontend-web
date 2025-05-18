import React from "react";
import displayDateTime from "../utils/displayDateTime";
import "./acrisRealPropCard.css";
import "./CommonAcrisComponent.css";

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
        <div className="card mb-3 shadow-sm w-100">
            <div className="card-body">
                <h4 className="card-title text-primary mb-3" aria-label="Real Property Remarks Data">
                    {decodedRecordTypeName}
                </h4>
                <div className="text-start">
                    <h6 className="card-text">Sequence Number: {sequence_number ?? <span className="notApplic" aria-label="Sequence number not available"><span aria-hidden="true">N/A</span><span className="visually-hidden">Sequence number not available</span></span>}</h6>
                    <h6 className="card-text">Remark Text: {remark_text ?? <span className="notApplic" aria-label="Remark text not available"><span aria-hidden="true">N/A</span><span className="visually-hidden">Remark text not available</span></span>}</h6>
                    <h6 className="card-text">API Data Source: Real Property {decodedRecordTypeName} Dataset</h6>
                    <h6 className="card-text">Good Through Date: {convertedGoodThroughDate}</h6>
                </div>
            </div>
        </div>
    );
}

export default RealPropertyRemarksCard;

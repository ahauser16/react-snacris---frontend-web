import React from "react";
import displayDateTime from "../utils/displayDateTime";
import "./acrisRealPropCard.css";

function RealPropertyRefsCard({
    document_id,
    record_type,
    reference_by_crfn_,
    reference_by_doc_id,
    reference_by_reel_year,
    reference_by_reel_borough,
    reference_by_reel_nbr,
    reference_by_reel_page,
    good_through_date,
}) {
    console.debug("RealPropertyPartiesCard",
        document_id,
        record_type,
        reference_by_crfn_,
        reference_by_doc_id,
        reference_by_reel_year,
        reference_by_reel_borough,
        reference_by_reel_nbr,
        reference_by_reel_page,
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

    const isReelApplicable = ((Number(reference_by_reel_year) !== 0) && (Number(reference_by_reel_borough) !== 0) && (Number(reference_by_reel_nbr) !== 0) && (Number(reference_by_reel_page) !== 0)) ? true : false;

    return (
        <div className="card mb-3 shadow-sm col-6 mx-auto">
            <div className="card-body row">
                <h4 className="card-title text-primary mb-3 row">
                    Real Property References Data
                </h4>
                <h5 className="card-title text-secondary mb-3 row">
                    {document_id ? (
                        `Document ID: ${document_id} `
                    ) : (
                        ""
                    )}
                </h5>

                <div className="text-start">
                    <h6 className="card-text">Reference by CRFN: {reference_by_crfn_ || "N/A"}</h6>
                    <h6 className="card-text">Reference by Document ID: {reference_by_doc_id || "N/A"}</h6>
                    {isReelApplicable ? (
                        <>
                            <h6 className="card-text">Reference by Reel Year: {reference_by_reel_year || "N/A"}</h6>
                            <h6 className="card-text">Reference by Reel Borough: {reference_by_reel_borough || "N/A"}</h6>
                            <h6 className="card-text">Reference by Reel Number: {reference_by_reel_nbr || "N/A"}</h6>
                            <h6 className="card-text">Reference by Reel Page: {reference_by_reel_page || "N/A"}</h6>
                        </>
                    ) : (
                        <>
                            <h6 className="card-text">*Reel references are not applicable for this record</h6>
                        </>
                    )}
                    <h6 className="card-text">API Data Source: Real Property {decodedRecordTypeName} Dataset</h6>
                    <h6 className="card-text">Good Through Date: {convertedGoodThroughDate}</h6>
                </div>
            </div>
        </div >
    );
}

export default RealPropertyRefsCard;

import React from "react";
import displayDateTime from "../../../hooks/displayDateTime";
import "./commonRealPropCardDisplay.css";
import "./commonRealPropCardDisplay.css";

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
        <div className="card mb-3 shadow-sm w-100">
            <div className="card-body">
                <h4 className="card-title text-primary mb-3" aria-label="Real Property References Data">
                    {decodedRecordTypeName}
                </h4>
                <div className="text-start">
                    <h6 className="card-text">Reference by CRFN:
                        {reference_by_crfn_ ||
                            <span className="notApplic" aria-label="Reference by CRFN not available">
                                <span aria-hidden="true">N/A</span>
                                <span className="visually-hidden">Reference by CRFN not available</span>
                            </span>}
                    </h6>
                    <h6 className="card-text">Reference by Document ID:
                        {reference_by_doc_id ||
                            <span className="notApplic" aria-label="Reference by Document ID not available">
                                <span aria-hidden="true">N/A</span>
                                <span className="visually-hidden">Reference by Document ID not available</span>
                            </span>}
                    </h6>
                    {isReelApplicable ? (
                        <>
                            <h6 className="card-text">Reference by Reel Year:
                                {reference_by_reel_year ||
                                    <span className="notApplic" aria-label="Reference by Reel Year not available">
                                        <span aria-hidden="true">N/A</span>
                                        <span className="visually-hidden">Reference by Reel Year not available</span>
                                    </span>}
                            </h6>
                            <h6 className="card-text">Reference by Reel Borough: {reference_by_reel_borough ||
                                <span className="notApplic" aria-label="Reference by Reel Borough not available">
                                    <span aria-hidden="true">N/A</span>
                                    <span className="visually-hidden">Reference by Reel Borough not available</span>
                                </span>}
                            </h6>
                            <h6 className="card-text">Reference by Reel Number: {reference_by_reel_nbr ||
                                <span className="notApplic" aria-label="Reference by Reel Number not available">
                                    <span aria-hidden="true">N/A</span>
                                    <span className="visually-hidden">Reference by Reel Number not available</span>
                                </span>}
                            </h6>
                            <h6 className="card-text">Reference by Reel Page: {reference_by_reel_page ||
                                <span className="notApplic" aria-label="Reference by Reel Page not available">
                                    <span aria-hidden="true">N/A</span>
                                    <span className="visually-hidden">Reference by Reel Page not available</span>
                                </span>}
                            </h6>
                        </>
                    ) : (
                        <h6 className="card-text notApplic" aria-label="Reel references not applicable">
                            Reel references are not applicable
                            <span aria-hidden="true">N/A</span>
                            <span className="visually-hidden">Reel references not applicable</span>
                        </h6>
                    )}
                    <h6 className="card-text">Good Through Date: {convertedGoodThroughDate}</h6>
                </div>
            </div>
        </div>
    );
}

export default RealPropertyRefsCard;

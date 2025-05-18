import React from "react";
import getDocTypeData from "../utils/acris/getDocTypeData";
import "./acrisRealPropCard.css";
import displayDateTime from "../utils/displayDateTime";
import displayDollarAmt from "../utils/displayDollarAmt";
import displayPercentage from "../utils/displayPercentage";
import "./CommonAcrisComponent.css";


function RealPropertyMasterCard({ document_id, record_type, crfn, recorded_borough, doc_type, document_date, document_amt, recorded_datetime, modified_date, reel_yr, reel_nbr, reel_pg, percent_trans, good_through_date }) {
    console.debug("AddressParcelCard", document_id, record_type, crfn, recorded_borough, doc_type, document_date, document_amt, recorded_datetime, modified_date, reel_yr, reel_nbr, reel_pg, percent_trans, good_through_date);

    const docTypeName = getDocTypeData(doc_type);

    const decodedBoroughName = {
        1: "Manhattan",
        2: "Bronx",
        3: "Brooklyn",
        4: "Queens",
        5: "Staten Island"
    }[recorded_borough] || "Unknown";

    const decodedRecordTypeName = {
        "A": "Master",
        "L": "Lot",
        "R": "Remarks",
        "X": "References",
        "P": "Parties"
    }[record_type] || "Unknown";

    const convertedDocumentDate = displayDateTime(document_date);
    const convertedRecordedDate = displayDateTime(recorded_datetime);
    const convertedModifiedDate = displayDateTime(modified_date);
    const convertedDocAmt = displayDollarAmt(document_amt);
    const convertedGoodThroughDate = displayDateTime(good_through_date);
    const convertedPercentTrans = displayPercentage(percent_trans);

    const isReelApplicable = ((Number(reel_yr) !== 0) && (Number(reel_nbr) !== 0) && (Number(reel_pg) !== 0)) ? true : false;

    return (
        <div className="card mb-3 shadow-sm w-100">

            <div className="card-body">
                <h4 className="card-title text-primary mb-3" aria-label="Real Property Master Data">
                    {decodedRecordTypeName}
                </h4>
                <div className="text-start">
                    <h6 className="card-text">{crfn ? (`CRFN: ${crfn}`) : ("")}</h6>
                    <h6 className="card-text">Recorded in: {decodedBoroughName}</h6>
                    <h6 className="card-text">Document Class: {docTypeName.class_code_description}</h6>
                    <h6 className="card-text">Document Type: {docTypeName.doc__type_description}</h6>
                    <h6 className="card-text">Party 1: {docTypeName.party1_type}</h6>

                    {docTypeName.party2_type ? (
                        <h6 className="card-text">Party 2: {docTypeName.party2_type}</h6>
                    ) : (
                        <h6 className="card-text notApplic" aria-label="Party 2 data not available">
                            <span aria-hidden="true">N/A</span>
                            <span className="visually-hidden">Party 2 data not available</span>
                        </h6>
                    )}

                    {docTypeName.party3_type ? (
                        <h6 className="card-text">Party 3: {docTypeName.party3_type}</h6>
                    ) : (
                        <h6 className="card-text notApplic" aria-label="Party 3 data not available">Party 3:{" "} 
                            <span aria-hidden="true">N/A</span>
                            <span className="visually-hidden">Party 3 data not available</span>
                        </h6>
                    )}

                    <h6 className="card-text">Document Amount: {convertedDocAmt}</h6>
                    <h6 className="card-text">Property Interest Transferred: {convertedPercentTrans}</h6>
                    <h6 className="card-text">Document Date: {convertedDocumentDate}</h6>
                    <h6 className="card-text">Date Recorded: {convertedRecordedDate}</h6>
                    <h6 className="card-text">Date Last Modified: {convertedModifiedDate}</h6>
                    <h6 className="card-text">Good Through Date: {convertedGoodThroughDate}</h6>

                    {isReelApplicable ? (
                        <>
                            <h6 className="card-text">Reel Year: {reel_yr}</h6>
                            <h6 className="card-text">Reel Number: {reel_nbr}</h6>
                            <h6 className="card-text">Reel Page: {reel_pg}</h6>
                        </>
                    ) : (
                        <>
                            <h6 className="card-text notApplic" aria-label="Reel references not applicable">
                                Reel Year, Number & Page:{" "} 
                            <span aria-hidden="true">N/A</span>
                            <span className="visually-hidden">Reel references not applicable</span>
                        </h6>
                        </>
                    )}

                </div>
            </div>
        </div >
    );
}

export default RealPropertyMasterCard;

import React from "react";
import getDocTypeData from "../utils/acris/getDocTypeData";
import "./acrisRealPropCard.css";
import displayDateTime from "../utils/displayDateTime";
import displayDollarAmt from "../utils/displayDollarAmt";
import displayPercentage from "../utils/displayPercentage";

/** Show limited information about a company
 *
 * Is rendered by CompanyList to show a "card" for each company.
 * 
 * Clicking on a CompanyCard navigates to the CompanyDetail page for the selected company.
 *
 * CompanyList -> CompanyCard
 */
// CompanyCard is a presentational component that displays a summary of a single company. 
// It is rendered by CompanyList.js for each company in the list.
// It Receives name, description, logoUrl, and handle as props from the CompanyList component.
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
        <div className="card mb-3 shadow-sm col-6 mx-auto">
            <div className="card-body row">
                <h4 className="card-title text-primary mb-3 row">
                    Real Property Master Data
                </h4>
                <h5 className="card-title text-secondary mb-3 row">
                    {document_id ? (
                        `Document ID: ${document_id} `
                    ) : (
                        ""
                    )}
                </h5>
                <h5 className="card-title text-secondary mb-3 row">
                    {crfn ? (
                        `CRFN: ${crfn}`
                    ) : (
                        ""
                    )}
                </h5>

                <div className="text-start">
                    {/* <h6 className="card-text">Document ID: {document_id}</h6>
                    <h6 className="card-text">City Register File Number ("CRFN"): {crfn}</h6> */}
                    <h6 className="card-text">Document Recorded in: {decodedBoroughName}</h6>
                    <h6 className="card-text">Document Class: {docTypeName.class_code_description}</h6>
                    <h6 className="card-text">Document Type: {docTypeName.doc__type_description}</h6>

                    <h6 className="card-text">Party 1 Role: {docTypeName.party1_type}</h6>

                    {docTypeName.party2_type ? (
                        <h6 className="card-text">Party 2 Role: {docTypeName.party2_type}</h6>
                    ) : (
                        <h6 className="card-text">* Party 2 Role Data is N/A</h6>
                    )}

                    {docTypeName.party3_type ? (
                        <h6 className="card-text">Party 3 Role: {docTypeName.party3_type}</h6>
                    ) : (
                        <h6 className="card-text">Party 3 Role Data is N/A</h6>
                    )}

                    <h6 className="card-text">Document Amount: {convertedDocAmt}</h6>
                    <h6 className="card-text">Property Interest Transferred: {convertedPercentTrans}</h6>

                    <h6 className="card-text">Document Date: {convertedDocumentDate}</h6>
                    <h6 className="card-text">Date Recorded: {convertedRecordedDate}</h6>
                    <h6 className="card-text">Date Last Modified: {convertedModifiedDate}</h6>

                    <h6 className="card-text">API Data Source: Real Property {decodedRecordTypeName} Dataset</h6>
                    <h6 className="card-text">Good Through Date: {convertedGoodThroughDate}</h6>

                    {isReelApplicable ? (
                        <>
                            <h6 className="card-text">Reel Year: {reel_yr}</h6>
                            <h6 className="card-text">Reel Number: {reel_nbr}</h6>
                            <h6 className="card-text">Reel Page: {reel_pg}</h6>
                        </>
                    ) : (
                        <>
                            <h6 className="card-text">*Reel references are not applicable for this record</h6>
                        </>
                    )}

                </div>
            </div>
        </div >
    );
}

export default RealPropertyMasterCard;

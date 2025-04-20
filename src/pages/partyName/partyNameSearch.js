import React, { useState } from "react";
import PartyNameSearchForm from "./PartyNameSearchForm";
import SnacrisApi from "../../api/api";
import RealPropertyMasterCard from "../../components/acris/RealPropertyMasterCard";
import RealPropertyLegalsCard from "../../components/acris/RealPropertyLegalsCard";
import RealPropertyPartiesCard from "../../components/acris/RealPropertyPartiesCard";
import RealPropertyRefsCard from "../../components/acris/RealPropertyRefsCard";
import RealPropertyRemarksCard from "../../components/acris/RealPropertyRemarksCard";

function PartyNameSearch() {
    console.debug("PartyNameSearch");

    const [results, setResults] = useState(null);

    async function search(
        masterSearchTerms,
        partySearchTerms,
        lotSearchTerms,
        remarkSearchTerms,
        referenceSearchTerms,
        primaryApiSources,
        secondaryApiSources
    ) {
        console.debug(
            "PartyNameSearch: search called with:",
            masterSearchTerms,
            partySearchTerms,
            lotSearchTerms,
            remarkSearchTerms,
            referenceSearchTerms,
            primaryApiSources,
            secondaryApiSources
        );
        try {
            const results = await SnacrisApi.queryAcrisPartyName(
                masterSearchTerms,
                partySearchTerms,
                lotSearchTerms,
                remarkSearchTerms,
                referenceSearchTerms,
                primaryApiSources,
                secondaryApiSources
            );
            console.log("PartyNameSearch: search results:", results);
            setResults(results);
        } catch (err) {
            console.error("Error fetching results:", err);
            setResults([]);
        }
    }

    return (
        <div className="container text-center">
            <h1 className="mb-4 fw-bold">Search By Party Name</h1>
            <h2 className="mb-4 fw-bold">Recorded Documents Only</h2>
            <hr />
            <PartyNameSearchForm searchFor={search} />
            {results && (
                <>
                    {results.some((result) => result.dataFound === false) &&
                        results
                            .filter((result) => result.dataFound === false)
                            .map((errorResult, index) => (
                                <h1 key={`error-${index}`} className="text-danger">
                                    Dataset: {errorResult.dataset}, Error: {errorResult.error}
                                </h1>
                            ))}
                    {results
                        .filter((result) => result.dataFound !== false)
                        .map((result, index) => {
                            switch (result.record_type) {
                                case "A":
                                    return (
                                        <RealPropertyMasterCard
                                            key={`master-${index}`}
                                            document_id={result.document_id}
                                            record_type={result.record_type}
                                            crfn={result.crfn}
                                            recorded_borough={result.recorded_borough}
                                            doc_type={result.doc_type}
                                            document_date={result.document_date}
                                            document_amt={result.document_amt}
                                            recorded_datetime={result.recorded_datetime}
                                            modified_date={result.modified_date}
                                            reel_yr={result.reel_yr}
                                            reel_nbr={result.reel_nbr}
                                            reel_pg={result.reel_pg}
                                            percent_trans={result.percent_trans}
                                            good_through_date={result.good_through_date}
                                        />
                                    );
                                case "L":
                                    return (
                                        <RealPropertyLegalsCard
                                            key={`legals-${index}`}
                                            document_id={result.document_id}
                                            record_type={result.record_type}
                                            borough={result.borough}
                                            block={result.block}
                                            lot={result.lot}
                                            easement={result.easement}
                                            partial_lot={result.partial_lot}
                                            air_rights={result.air_rights}
                                            subterranean_rights={result.subterranean_rights}
                                            property_type={result.property_type}
                                            street_number={result.street_number}
                                            street_name={result.street_name}
                                            unit_address={result.unit_address}
                                            good_through_date={result.good_through_date}
                                        />
                                    );
                                case "P":
                                    const docTypeForParties = results.find(
                                        (res) => res.record_type === "A" && res.document_id === result.document_id
                                    )?.doc_type;
                                    return (
                                        <RealPropertyPartiesCard
                                            key={`parties-${index}`}
                                            document_id={result.document_id}
                                            record_type={result.record_type}
                                            name={result.name}
                                            party_type={result.party_type}
                                            address_1={result.address_1}
                                            address_2={result.address_2}
                                            country={result.country}
                                            city={result.city}
                                            state={result.state}
                                            zip={result.zip}
                                            good_through_date={result.good_through_date}
                                            doc_type={docTypeForParties}
                                        />
                                    );
                                case "X":
                                    return (
                                        <RealPropertyRefsCard
                                            key={`refs-${index}`}
                                            document_id={result.document_id}
                                            record_type={result.record_type}
                                            reference_by_crfn_={result.reference_by_crfn_}
                                            reference_by_doc_id={result.reference_by_doc_id}
                                            reference_by_reel_year={result.reference_by_reel_year}
                                            reference_by_reel_borough={result.reference_by_reel_borough}
                                            reference_by_reel_nbr={result.reference_by_reel_nbr}
                                            reference_by_reel_page={result.reference_by_reel_page}
                                            good_through_date={result.good_through_date}
                                        />
                                    );
                                case "R":
                                    return (
                                        <RealPropertyRemarksCard
                                            key={`remarks-${index}`}
                                            document_id={result.document_id}
                                            record_type={result.record_type}
                                            sequence_number={result.sequence_number}
                                            remark_text={result.remark_text}
                                            good_through_date={result.good_through_date}
                                        />
                                    );
                                default:
                                    return null;
                            }
                        })}
                </>
            )}
        </div>
    );
}

export default PartyNameSearch;
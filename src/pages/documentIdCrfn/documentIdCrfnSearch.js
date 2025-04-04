import React, { useState } from "react";
import SnacrisApi from "../../api/api";
import DocumentIdCrfnSearchForm from "./documentIdCrfnSearchForm";
import RealPropertyMasterCard from "../../components/acris/RealPropertyMasterCard";

function DocumentIdCrfnSearch() {
  console.debug("DocumentIdCrfnSearch");

  //`results` is a state variable that holds the results of the ACRIS API call that is executed from the backend and is initially set to `null`.
  const [results, setResults] = useState(null);

  /** Triggered by search form submit; reloads companies. 
   * the DocumentIdCrfnSearchForm component allows users to filter companies by name. When the search form is submitted, the `search()` function is called with the search term, and the list of companies is updated.
  */
  async function search(searchTerms) {
    console.debug("DocumentIdCrfnSearch: search called with:", searchTerms);
    try {
      const results = await SnacrisApi.queryAcrisDocIdCrfn(searchTerms);
      console.debug("DocumentIdCrfnSearch: search results:", results);
      setResults(results);
    } catch (err) {
      console.error("Error fetching results:", err);
      setResults([]);
    }
  }

  return (
    <div className="container text-center">
      <h2 className="mb-4 fw-bold">Search By Document ID or CRFN</h2>
      <h6 className="mb-4 fw-bold">Recorded Documents Only</h6>
      <hr />
      <DocumentIdCrfnSearchForm searchFor={search} />
      {results && results.length > 0 && (
        <RealPropertyMasterCard
          document_id={results[0].document_id}
          record_type={results[0].record_type}
          crfn={results[0].crfn}
          recorded_borough={results[0].recorded_borough}
          doc_type={results[0].doc_type}
          document_date={results[0].document_date}
          document_amt={results[0].document_amt}
          recorded_datetime={results[0].recorded_datetime}
          modified_date={results[0].modified_date}
          reel_yr={results[0].reel_yr}
          reel_nbr={results[0].reel_nbr}
          reel_pg={results[0].reel_pg}
          percent_trans={results[0].percent_trans}
          good_through_date={results[0].good_through_date}
        />
      )}
    </div>
  );
}

export default DocumentIdCrfnSearch;

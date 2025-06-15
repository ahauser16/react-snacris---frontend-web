import React, { useState } from "react";
import SnacrisApi from "../../api/api";
import DocumentIdCrfnSearchForm from "./DocumentIdCrfnSearchForm";
import DocumentIdCrfnSearchDisplay from "./DocumentIdCrfnSearchDisplay";

function DocumentIdCrfnSearch() {
  console.debug("DocumentIdCrfnSearch");

  const [results, setResults] = useState(null);

  async function search(masterSearchTerms) {
    console.debug("DocumentIdCrfnSearch: search called with:", masterSearchTerms);
    try {
      const results = await SnacrisApi.queryAcrisDocIdCrfn(masterSearchTerms);
      console.log("DocumentIdCrfnSearch: search results:", results);
      setResults(results);
    } catch (err) {
      console.error("Error fetching results:", err);
      setResults([]);
    }
  }

  return (
    <div className="container">
      <div className="row mb-2">
        <div className="alert alert-info col-12 col-lg-12 d-flex flex-column align-items-start justify-content-start" role="alert">
          <div className="d-flex align-items-end justify-content-start mb-1">
            <h1 className="title mb-0 me-2">Search By Document ID or CRFN</h1>
            <em className="subtitle mb-0">Recorded Documents Only</em>
          </div>
          <p>
            Enter the Document ID or CRFN (City Register File Number) of the document you want to find below and press "Submit".
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-lg-4 col-md-4 mb-2">
          <DocumentIdCrfnSearchForm searchFor={search} />
        </div>
        <div className="col-12 col-lg-8 col-md-8">
          {results && (<DocumentIdCrfnSearchDisplay results={results} />)}
        </div>
      </div>
    </div>
  );
}

export default DocumentIdCrfnSearch;
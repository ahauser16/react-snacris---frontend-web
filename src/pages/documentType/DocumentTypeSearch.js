import React, { useState, useEffect } from "react";
import SnacrisApi from "../../api/api";
import DocumentTypeSearchForm from "./DocumentTypeSearchForm";
import DocumentTypeSearchDisplay from "./DocumentTypeSearchDisplay";

function DocumentTypeSearch() {
  console.debug("DocumentTypeSearch");

  const [results, setResults] = useState(null);

  async function search(masterSearchTerms, legalsSearchTerms) {
    console.debug("DocumentTypeSearch search called with:", masterSearchTerms, legalsSearchTerms);
    try {
      const results = await SnacrisApi.queryAcrisDocumentType(masterSearchTerms, legalsSearchTerms);
      console.debug("DocumentTypeSearch search results:", results);
      setResults(results);
    } catch (err) {
      console.error("Error fetching results:", err);
      setResults([]);
    }
  }

  return (
    <div className="container">
      <div className="row mb-2">
        <h1 className="title">Search By Document Type</h1>
        <em className="subtitle">Recorded Documents Only</em>
      </div>
      <div className="row">
        <div className="col-12 col-lg-4 col-md-4 mb-2">
          <DocumentTypeSearchForm searchFor={search} />
        </div>
        <div className="col-12 col-lg-8 col-md-8">
          {results && (<DocumentTypeSearchDisplay results={results} />)}
        </div>
      </div>
    </div>
  );
}

export default DocumentTypeSearch;

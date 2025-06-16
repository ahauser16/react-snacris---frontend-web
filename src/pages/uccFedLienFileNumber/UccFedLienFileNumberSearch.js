import React, { useState } from "react";
import SnacrisApi from "../../api/api";
import UccFedLienFileNumberSearchForm from "./UccFedLienFileNumberSearchForm";
import UccFedLienFileNumberSearchDisplay from "./UccFedLienFileNumberSearchDisplay";

function UccFedLienFileNumberSearch() {
  console.debug("UccFedLienFileNumberSearch");

  const [results, setResults] = useState(null);

  async function search(masterSearchTerms, legalsSearchTerms) {
    console.debug("UccFedLienFileNumberSearch search called with:", masterSearchTerms);
    try {
      const results = await SnacrisApi.queryAcrisUccFedLienNum(masterSearchTerms, legalsSearchTerms);
      console.debug("UccFedLienFileNumberSearch search results:", results);
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
            <h1 className="title mb-0 me-2">Search By UCC or Federal Lien File Number</h1>
            <em className="subtitle mb-0">Recorded Documents Only</em>
          </div>
          <p>
            Searching by File Number is only available for documents recorded or filed BEFORE January 2, 2003.  When a property is not associated with the document, the search will include the borough that recorded the document eliminating the need to select All Boroughs when searching for Federal Liens and similar documents.  Although Staten Island appears as an option in the Borough drop-down list, public documents for Staten Island are recorded in the Richmond County Clerk's office and NOT the City Register's office.
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-lg-4 col-md-4 mb-2">
          <UccFedLienFileNumberSearchForm searchFor={search} />
        </div>
        <div className="col-12 col-lg-8 col-md-8">
          {results && <UccFedLienFileNumberSearchDisplay results={results} />}
        </div>
      </div>
    </div>
  );
}

export default UccFedLienFileNumberSearch;
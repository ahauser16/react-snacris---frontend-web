import React, { useState } from "react";
import SnacrisApi from "../../api/api";
import ReelPageSearchForm from "./ReelPageSearchForm";
import ReelPageSearchDisplay from "./ReelPageSearchDisplay";

function ReelPageSearch() {
  const [results, setResults] = useState(null);

  async function search(masterSearchTerms, legalsSearchTerms) {
    console.debug("ReelPageSearch: search called with:", masterSearchTerms, legalsSearchTerms);
    try {
      const results = await SnacrisApi.queryAcrisReelPage(masterSearchTerms, legalsSearchTerms);
      console.log("ReelPageSearch: search results:", results);
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
            <h1 className="title mb-0 me-2">Search By Reel & Page</h1>
            <em className="subtitle mb-0">Recorded Documents Only</em>
          </div>
          <p>
            Enter the Year, Reel Number, Page Number and select the Borough below and press "Submit" to search for documents.  Keep in mind results will only include documents recorded before January 2, 2003.
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-lg-4 col-md-4 mb-2">
          <ReelPageSearchForm searchFor={search} />
        </div>
        <div className="col-12 col-lg-8 col-md-8">
          {results && <ReelPageSearchDisplay results={results} />}
        </div>
      </div>
    </div>
  );
}

export default ReelPageSearch;
import React, { useState } from "react";
import ParcelIdentifierSearchForm from "./ParcelIdentifierSearchForm";
import ParcelIdentifierSearchDisplay from "./ParcelIdentifierSearchDisplay";
import SnacrisApi from "../../api/api";


function ParcelIdentifierSearch() {
  console.debug("ParcelIdentifierSearch");

  const [results, setResults] = useState(null);

  async function search(masterSearchTerms, legalsSearchTerms) {
    console.debug(
      "ParcelIdentifierSearch: search called with: masterSearchTerms and legalsSearchTerms objects:",
      masterSearchTerms,
      legalsSearchTerms
    );
    try {
      const results = await SnacrisApi.queryAcrisParcel(
        masterSearchTerms,
        legalsSearchTerms
      );
      console.log("ParcelIdentifierSearch: search results:", results);
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
            <h1 className="title mb-0 me-2">Search By Parcel (Borough, Block & Lot)</h1>
            <em className="subtitle mb-0">Recorded Documents Only</em>
          </div>
          <p>
            Enter the Borough, Block & Lot (BBL) of the property you want to find documents for below.  Additionally, you can narrow your search by selecting a class or type of document and selecting a date range.
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-lg-4 col-md-4 mb-2">
          <ParcelIdentifierSearchForm searchFor={search} />
        </div>
        <div className="col-12 col-lg-8 col-md-8">
          {results && (<ParcelIdentifierSearchDisplay results={results} />)}
        </div>
      </div>
    </div>
  );
}

export default ParcelIdentifierSearch;
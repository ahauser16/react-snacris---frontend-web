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
        <h1 className="title">Search By Parcel (Borough, Block & Lot)</h1>
        <em className="subtitle">Recorded Documents Only</em>
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
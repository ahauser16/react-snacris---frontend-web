import React, { useState } from "react";
import PartyNameSearchForm from "./PartyNameSearchForm";
import PartyNameSearchDisplay from "./PartyNameSearchDisplay";
import SnacrisApi from "../../api/api";

function PartyNameSearch() {
  //console.debug("PartyNameSearch");

  const [results, setResults] = useState(null);

  async function search(
    masterSearchTerms,
    partySearchTerms,
    legalsSearchTerms,
    remarkSearchTerms,
    referenceSearchTerms
  ) {
    // console.debug(
    //   "PartyNameSearch: search called with:",
    //   masterSearchTerms,
    //   partySearchTerms,
    //   legalsSearchTerms,
    //   remarkSearchTerms,
    //   referenceSearchTerms
    // );
    try {
      const results = await SnacrisApi.queryAcrisPartyName(
        masterSearchTerms,
        partySearchTerms,
        legalsSearchTerms,
        remarkSearchTerms,
        referenceSearchTerms
      );
      console.log("PartyNameSearch: search results:", results);
      setResults(results);
    } catch (err) {
      console.error("Error fetching results:", err);
      setResults([]);
    }
  }

  return (
    <div className="container">
      <div className="row mb-2">
        <h1 className="title">Search By Party Name</h1>
        <em className="subtitle">Recorded Documents Only</em>
      </div>
      <div className="row">
        <div className="col-12 col-lg-4 col-md-4 mb-2">
          <PartyNameSearchForm searchFor={search} />
        </div>
        <div className="col-12 col-lg-8 col-md-8">
          {results && (<PartyNameSearchDisplay results={results} />)}
        </div>
      </div>
    </div>
  );
}

export default PartyNameSearch;
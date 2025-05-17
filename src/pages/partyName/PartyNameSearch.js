import React, { useState } from "react";
import PartyNameSearchForm from "./PartyNameSearchForm";
import PartyNameSearchDisplay from "./PartyNameSearchDisplay";
import SnacrisApi from "../../api/api";

function PartyNameSearch() {
  console.debug("PartyNameSearch");

  const [results, setResults] = useState(null);

  async function search(
    masterSearchTerms,
    partySearchTerms,
    legalsSearchTerms,
    remarkSearchTerms,
    referenceSearchTerms
  ) {
    console.debug(
      "PartyNameSearch: search called with:",
      masterSearchTerms,
      partySearchTerms,
      legalsSearchTerms,
      remarkSearchTerms,
      referenceSearchTerms
    );
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
    <div className="container text-center">
      <h1 className="mb-4 fw-bold">Search By Party Name</h1>
      <h2 className="mb-4 fw-bold">Recorded Documents Only</h2>
      <hr />
      <PartyNameSearchForm searchFor={search} />
      {results && (
        <PartyNameSearchDisplay results={results} />
      )}
    </div>
  );
}

export default PartyNameSearch;
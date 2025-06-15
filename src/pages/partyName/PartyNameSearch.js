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
        <div className="alert alert-info col-12 col-lg-12 d-flex flex-column align-items-start justify-content-start" role="alert">
          <div className="d-flex align-items-end justify-content-start mb-1">
            <h1 className="title mb-0 me-2">Search By Party Name</h1>
            <em className="subtitle mb-0">Recorded Documents Only</em>
          </div>
          <p>
            Enter the name of the party in the field below and press "Submit" to search for records where one of the associated party's name <em>contains</em> the search term provided.  For example, searching for "Smith" will return all documents where a party's name contains "Smith", such as "John Smith", "Smith & Co.", or "Smithson".  Additionally, you can narrow your search results by selecting a borough, a document class and/or document type, selecting a date range and a party type.
          </p>
        </div>
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
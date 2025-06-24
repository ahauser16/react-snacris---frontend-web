import React, { useState } from "react";
import PartyNameSearchForm from "./PartyNameSearchForm";
import PartyNameSearchDisplay from "./PartyNameSearchDisplay";
import SnacrisApi from "../../api/api";

function PartyNameSearch() {
  const [results, setResults] = useState(null);

  async function search(
    masterSearchTerms,
    partySearchTerms,
    legalsSearchTerms,
    setAlert
  ) {
    try {
      const response = await SnacrisApi.queryAcrisPartyName(
        masterSearchTerms,
        partySearchTerms,
        legalsSearchTerms,
        null, // remarkSearchTerms
        null  // referenceSearchTerms
      );
      
      if (response && response.status === "success" && response.analysis) {
        setResults(response);
        setAlert({ type: "success", messages: [response.message || "Results found."] });
      } else if (response && response.status === "success" && !response.analysis) {
        setResults(response);
        setAlert({ type: "danger", messages: ["No analysis data found."] });
      } else {
        setResults(response);
        setAlert({ type: "danger", messages: [response.message || "Unexpected response format."] });
      }
    } catch (err) {
      setResults(null);
      setAlert({ type: "danger", messages: ["An error occurred while fetching data. Please try again."] });
    }
  }

  return (
    <div className="container">
      <div className="row mb-1">
        <div className="alert alert-info col-12 col-lg-12 d-flex flex-column align-items-start justify-content-start mb-1 p-1" role="alert">
          <div className="d-flex align-items-end justify-content-start mb-0">
            <h2 className="title mb-0 me-2">Search By Party Name</h2>
            <em className="subtitle mb-0">Recorded Documents Only</em>
          </div>
          <p>
            Enter the name of the party in the field below and press "Submit" to search for records where one of the associated party's name <b>contains</b> the search term provided. For example, searching for "Smith" will return all documents where a party's name contains "Smith", such as "John Smith", "Smith & Co.", or "Smithson". Additionally, you can narrow your search results by selecting a borough, a document class and/or document type, selecting a date range and a party type.
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
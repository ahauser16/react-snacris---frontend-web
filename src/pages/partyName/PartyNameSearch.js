import React, { useState } from "react";
import PartyNameSearchForm from "./PartyNameSearchForm";
import PartyNameSearchDisplay from "./PartyNameSearchDisplay";
import SnacrisApi from "../../api/api";

function PartyNameSearch() {
  const [results, setResults] = useState(null);
  const [dataFound, setDataFound] = useState(null);

  async function search(
    masterSearchTerms,
    partySearchTerms,
    legalsSearchTerms,
    setAlert
  ) {
    try {
      // call backend; res === { dataFound: boolean, results: [...] }
      const res = await SnacrisApi.queryAcrisPartyName(
        masterSearchTerms,
        partySearchTerms,
        legalsSearchTerms,
        null, // remarkSearchTerms
        null // referenceSearchTerms
      );

      // unpack the shape
      setDataFound(res.dataFound);
      setResults(res.results || []);

      if (res.dataFound) {
        setAlert({ type: "success", messages: ["Results found."] });
      } else {
        // use server error message if provided, otherwise default
        // map specific backend errors to user-friendly messages
        let messages;
        if (
          Array.isArray(res.errMsg) &&
          res.errMsg.some((msg) =>
            msg.includes(
              "Failed to fetch document IDs from PartiesRealPropApi.fetchAcrisDocumentIdsCrossRef"
            )
          )
        ) {
          messages = [
            "Your Party Name query did not match any values in the ACRIS dataset.",
          ];
        } else if (
          Array.isArray(res.errMsg) &&
          res.errMsg.some((msg) =>
            msg.includes(
              "Failed to fetch document IDs from Real Property Master API"
            )
          )
        ) {
          messages = [
            "Your Recording Date, Document Class and/or Document Type query did not match any values in the ACRIS dataset.",
          ];
        } else if (Array.isArray(res.errMsg) && res.errMsg.length > 0) {
          messages = res.errMsg;
        } else {
          messages = ["No results found."];
        }
        setAlert({ type: "danger", messages });
      }
    } catch (err) {
      setDataFound(false);
      setResults([]);
      setAlert({
        type: "danger",
        messages: ["An error occurred while fetching data. Please try again."],
      });
    }
  }

  return (
    <div className="container">
      <div className="row mb-1">
        <div
          className="alert alert-info col-12 col-lg-12 d-flex flex-column align-items-start justify-content-start mb-1 p-1"
          role="alert"
        >
          <div className="d-flex align-items-end justify-content-start mb-0">
            <h2 className="title mb-0 me-2">Search By Party Name</h2>
            <em className="subtitle mb-0">Recorded Documents Only</em>
          </div>
          <p>
            Enter the name of the party in the field below and press "Submit" to
            search for records where one of the associated party's name{" "}
            <b>contains</b> the search term provided. For example, searching for
            "Smith" will return all documents where a party's name contains
            "Smith", such as "John Smith", "Smith & Co.", or "Smithson".
            Additionally, you can narrow your search results by selecting a
            borough, a document class and/or document type, selecting a date
            range and a party type.
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-lg-4 col-md-4 mb-2">
          <PartyNameSearchForm searchFor={search} />
        </div>
        <div className="col-12 col-lg-8 col-md-8">
          {/* only render display when dataFound is true */}
          {dataFound === true && <PartyNameSearchDisplay results={results} />}
        </div>
      </div>
    </div>
  );
}

export default PartyNameSearch;

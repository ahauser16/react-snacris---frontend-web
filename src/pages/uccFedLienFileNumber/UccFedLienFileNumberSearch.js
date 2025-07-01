import React, { useState } from "react";
import Alert from "../../common/Alert";
import SnacrisApi from "../../api/api";
import UccFedLienFileNumberSearchForm from "./UccFedLienFileNumberSearchForm";
import UccFedLienFileNumberSearchDisplay from "./UccFedLienFileNumberSearchDisplay";

function UccFedLienFileNumberSearch() {
  console.debug("UccFedLienFileNumberSearch");

  const [results, setResults] = useState([]);
  const [alert, setAlert] = useState({ type: "", messages: [] });

  async function search(masterSearchTerms, legalsSearchTerms) {
    console.debug(
      "UccFedLienFileNumberSearch: search called with:",
      masterSearchTerms,
      legalsSearchTerms
    );
    try {
      const res = await SnacrisApi.queryAcrisUccFedLienNum(
        masterSearchTerms,
        legalsSearchTerms
      );
      console.log("UccFedLienFileNumberSearch: search results:", res);
      console.log("UccFedLienFileNumberSearch: results type:", typeof res);
      console.log(
        "UccFedLienFileNumberSearch: results isArray:",
        Array.isArray(res)
      );
      console.log(
        "UccFedLienFileNumberSearch: res.results isArray:",
        Array.isArray(res?.results)
      );
      console.log(
        "UccFedLienFileNumberSearch: res.results length:",
        res?.results?.length
      );

      // Handle direct array response (like ReelPage) or object with results property
      const resultsArray = Array.isArray(res) ? res : res?.results || [];

      if (Array.isArray(resultsArray) && resultsArray.length > 0) {
        // Check if the results contain valid data
        const hasValidData = resultsArray.some(
          (result) =>
            result &&
            (result.masterRecords?.length > 0 ||
              result.partiesRecords?.length > 0 ||
              result.legalsRecords?.length > 0)
        );

        console.log("UccFedLienFileNumberSearch: hasValidData:", hasValidData);

        if (hasValidData) {
          setResults(resultsArray);
          setAlert({ type: "success", messages: ["Results found."] });
        } else {
          setResults([]);
          setAlert({
            type: "danger",
            messages: ["No valid records found in response."],
          });
        }
      } else {
        setResults([]);
        setAlert({ type: "danger", messages: ["No records found."] });
      }
    } catch (err) {
      console.error("Error fetching results:", err);
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
            <h2 className="title mb-0 me-2">
              Search By UCC or Federal Lien File Number
            </h2>
            <em className="subtitle mb-0">Recorded Documents Only</em>
          </div>
          <p>
            Searching by File Number is only available for documents recorded or
            filed BEFORE January 2, 2003. When a property is not associated with
            the document, the search will include the borough that recorded the
            document eliminating the need to select All Boroughs when searching
            for Federal Liens and similar documents. Although Staten Island
            appears as an option in the Borough drop-down list, public documents
            for Staten Island are recorded in the Richmond County Clerk's office
            and NOT the City Register's office.
          </p>
        </div>
      </div>
      <div className="row mb-2">
        <div className="col-12">
          {alert.messages.length > 0 && (
            <Alert type={alert.type} messages={alert.messages} />
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-lg-4 col-md-4 mb-2">
          <UccFedLienFileNumberSearchForm
            searchFor={search}
            setAlert={setAlert}
          />
        </div>
        <div className="col-12 col-lg-8 col-md-8">
          {results.length > 0 && (
            <UccFedLienFileNumberSearchDisplay results={results} />
          )}
        </div>
      </div>
    </div>
  );
}

export default UccFedLienFileNumberSearch;

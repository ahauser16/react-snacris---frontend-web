import React, { useState } from "react";
import Alert from "../../common/Alert";
import SnacrisApi from "../../api/api";
import ReelPageSearchForm from "./ReelPageSearchForm";
import ReelPageSearchDisplay from "./ReelPageSearchDisplay";

function ReelPageSearch() {
  console.debug("ReelPageSearch");

  const [results, setResults] = useState([]);
  const [alert, setAlert] = useState({ type: "", messages: [] });

  async function search(masterSearchTerms, legalsSearchTerms) {
    console.debug(
      "ReelPageSearch: search called with:",
      masterSearchTerms,
      legalsSearchTerms
    );
    try {
      const res = await SnacrisApi.queryAcrisReelPage(
        masterSearchTerms,
        legalsSearchTerms
      );
      console.log("ReelPageSearch: search results:", res);
      console.log("ReelPageSearch: results type:", typeof res);
      console.log("ReelPageSearch: results isArray:", Array.isArray(res));
      console.log(
        "ReelPageSearch: res.results isArray:",
        Array.isArray(res?.results)
      );
      console.log("ReelPageSearch: res.results length:", res?.results?.length);

      // Extract the results array from the response object
      const resultsArray = res?.results || [];

      if (Array.isArray(resultsArray) && resultsArray.length > 0) {
        // Check if the results contain valid data
        const hasValidData = resultsArray.some(
          (result) =>
            result &&
            (result.masterRecords?.length > 0 ||
              result.partiesRecords?.length > 0 ||
              result.legalsRecords?.length > 0)
        );

        console.log("ReelPageSearch: hasValidData:", hasValidData);

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
            <h2 className="title mb-0 me-2">Search By Reel & Page</h2>
            <em className="subtitle mb-0">Recorded Documents Only</em>
          </div>
          <p>
            Enter the Year, Reel Number, Page Number and select the Borough
            below and press "Submit" to search for documents. Keep in mind
            results will only include documents recorded before January 2, 2003.
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
          <ReelPageSearchForm searchFor={search} setAlert={setAlert} />
        </div>
        <div className="col-12 col-lg-8 col-md-8">
          {results.length > 0 && <ReelPageSearchDisplay results={results} />}
        </div>
      </div>
    </div>
  );
}

export default ReelPageSearch;

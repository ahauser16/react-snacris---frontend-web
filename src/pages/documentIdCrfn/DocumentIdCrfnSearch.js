import React, { useState } from "react";
import Alert from "../../common/Alert";
import SnacrisApi from "../../api/api";
import DocumentIdCrfnSearchForm from "./DocumentIdCrfnSearchForm";
import DocumentIdCrfnSearchDisplay from "./DocumentIdCrfnSearchDisplay";
import { Helmet } from "react-helmet";

function DocumentIdCrfnSearch() {
  console.debug("DocumentIdCrfnSearch");

  const [results, setResults] = useState([]);
  const [alert, setAlert] = useState({ type: "", messages: [] });

  async function search(masterSearchTerms) {
    console.debug(
      "DocumentIdCrfnSearch: search called with:",
      masterSearchTerms
    );
    try {
      const res = await SnacrisApi.queryAcrisDocIdCrfn(masterSearchTerms);
      console.log("DocumentIdCrfnSearch: search results:", res);
      console.log("DocumentIdCrfnSearch: results type:", typeof res);
      console.log("DocumentIdCrfnSearch: results isArray:", Array.isArray(res));
      console.log(
        "DocumentIdCrfnSearch: res.results isArray:",
        Array.isArray(res?.results)
      );
      console.log(
        "DocumentIdCrfnSearch: res.results length:",
        res?.results?.length
      );

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

        console.log("DocumentIdCrfnSearch: hasValidData:", hasValidData);

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
      <Helmet>
        <title>SNACRIS - Doc ID/CRFN Search</title>
      </Helmet>
      <div className="row mb-1">
        <div
          className="alert alert-info col-12 col-lg-12 d-flex flex-column align-items-start justify-content-start mb-1 p-1"
          role="alert"
        >
          <div className="d-flex align-items-end justify-content-start mb-0">
            <h2 className="title mb-0 me-2">Search By Document ID or CRFN</h2>
            <em className="subtitle mb-0">Recorded Documents Only</em>
          </div>
          <p>
            Enter either the <b>Document ID</b> or <b>CRFN</b> (City Register
            File Number) of the document you want to find below and press
            "Submit".
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
          <DocumentIdCrfnSearchForm searchFor={search} setAlert={setAlert} />
        </div>
        <div className="col-12 col-lg-8 col-md-8">
          {results.length > 0 && (
            <DocumentIdCrfnSearchDisplay results={results} />
          )}
        </div>
      </div>
    </div>
  );
}

export default DocumentIdCrfnSearch;

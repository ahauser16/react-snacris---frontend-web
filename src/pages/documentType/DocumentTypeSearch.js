import React, { useState } from "react";
import Alert from "../../common/Alert";
import SnacrisApi from "../../api/api";
import DocumentTypeSearchForm from "./DocumentTypeSearchForm";
import DocumentTypeSearchDisplay from "./DocumentTypeSearchDisplay";
import { Helmet } from "react-helmet";

function DocumentTypeSearch() {
  console.debug("DocumentTypeSearch");

  const [results, setResults] = useState([]);
  const [dataFound, setDataFound] = useState(null);
  const [alert, setAlert] = useState({ type: "", messages: [] });

  async function search(masterSearchTerms, legalsSearchTerms) {
    console.debug(
      "DocumentTypeSearch search called with:",
      masterSearchTerms,
      legalsSearchTerms
    );
    try {
      const res = await SnacrisApi.queryAcrisDocumentType(
        masterSearchTerms,
        legalsSearchTerms
      );
      console.debug("DocumentTypeSearch search results:", res);

      // handle backend shape: { dataFound, results, message }
      const hasData = res.dataFound === true;
      setDataFound(hasData);
      setResults(hasData ? res.results : []);
      setAlert({
        type: hasData ? "success" : "danger",
        messages: [
          res.message || (hasData ? "Results found." : "No documents found."),
        ],
      });
    } catch (err) {
      console.error("Error fetching results:", err);
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
      <Helmet>
        <title>SNACRIS - Document Type Search</title>
      </Helmet>
      <div className="row mb-1">
        <div
          className="alert alert-info col-12 col-lg-12 d-flex flex-column align-items-start justify-content-start mb-1 p-1"
          role="alert"
        >
          <div className="d-flex align-items-end justify-content-start mb-0">
            <h2 className="title mb-0 me-2">Search By Document Type</h2>
            <em className="subtitle mb-0">Recorded Documents Only</em>
          </div>
          <p>
            Select the document class and/or document type from the dropdown
            menu below and press "Submit" to search for documents of the chosen
            class/type. Additionally, you can narrow your search results by
            selecting a borough and a date range.
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
          <DocumentTypeSearchForm searchFor={search} setAlert={setAlert} />
        </div>
        <div className="col-12 col-lg-8 col-md-8">
          {dataFound === true && (
            <DocumentTypeSearchDisplay results={results} />
          )}
        </div>
      </div>
    </div>
  );
}

export default DocumentTypeSearch;

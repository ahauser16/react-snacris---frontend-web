import React, { useState } from "react";
import SnacrisApi from "../../api/api";
import TransNumSearchForm from "./TransNumSearchForm";
import TransNumSearchDisplay from "./TransNumSearchDisplay";

function TransactionNumberSearch() {
  console.debug("TransactionNumberSearch");

  const [results, setResults] = useState(null);

  async function search(masterSearchTerms) {
    console.debug("TransactionNumberSearch search called with:", masterSearchTerms);
    try {
      const results = await SnacrisApi.queryAcrisTransactionNumber(masterSearchTerms);
      console.debug("TransactionNumberSearch search results:", results);
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
            <h1 className="title mb-0 me-2">Search By Transaction Number</h1>
            <em className="subtitle mb-0">Recorded Documents Only</em>
          </div>
          <p>
            A Transaction Number is a unique number which is automatically assigned by ACRIS when a new cover page is created. It identifies a group of related documents. Only after printing the Cover Pages for a new document will the Transaction screen be presented.  Only documents recorded/filed on or after January 2, 2003 will have Transaction Numbers.
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-lg-4 col-md-4 mb-2">
          <TransNumSearchForm searchFor={search} />
        </div>
        <div className="col-12 col-lg-8 col-md-8">
          {results && <TransNumSearchDisplay results={results} />}
        </div>
      </div>
    </div>
  );
}

export default TransactionNumberSearch;
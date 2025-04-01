import React, { useState, useEffect } from "react";
import SnacrisApi from "../../api/api";
import LoadingSpinner from "../../common/LoadingSpinner";
import AddressParcelLookupForm from "../../common/acrisForms/addressParcelLookupForm";

function AddressParcelLookup() {
  console.debug("AddressParcelLookup");

  //`results` is a state variable that holds the results of the ACRIS API call that is executed from the backend and is initially set to `null`.
  const [results, setResults] = useState(null);

  /** Triggered by search form submit; reloads companies. 
   * the AddressParcelLookupForm component allows users search for a property using one of two sets of criteria. The first option includes the search terms: `borough`, `street number`, `street name` and `unit` (all required except for `unit` which is optional).  The second option includes the search terms `borough`, `block` and `lot` (all required).  When the search form is submitted, the `search()` function is called with the search term, and the list of companies is updated.
  */
  async function search(searchTerms) {
    try {
      const results = await SnacrisApi.queryAcrisAddressParcel(searchTerms);
      setResults(results);
    } catch (err) {
      console.error("Error fetching results:", err);
      setResults([]);
    }
  }

  //Rendering: If companies is null, a LoadingSpinner is displayed while data is being fetched.
  //if (!results) return <LoadingSpinner />;

  return (
    <div className="container text-center">
      {/* Provides the search functionality and calls the search() function in CompanyList with the search term. */}
      <h1 className="mb-4 fw-bold">Lookup Address or Parcel</h1>
      <hr />
      <AddressParcelLookupForm searchFor={search} />
      {results ? (
        results.length ? (
          <div className="results-list">
            {results.map((result, idx) => (
              <div key={idx} className="result-item">
                {/* Render result details */}
                {JSON.stringify(result)}
              </div>
            ))}
          </div>
        ) : (
          <p className="lead">Sorry, no results were found!</p>
        )
      ) : null}
    </div>
  );
}

export default AddressParcelLookup;

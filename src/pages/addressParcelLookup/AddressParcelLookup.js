import React, { useState } from "react";
import SnacrisApi from "../../api/api";
import AddressParcelLookupForm from "./AddressParcelLookupForm";
import AddressParcelCard from "./addressParcelCard";

function AddressParcelLookup() {
  console.debug("AddressParcelLookup");

  //`results` is a state variable that holds the results of the ACRIS API call that is executed from the backend and is initially set to `null`.
  const [results, setResults] = useState(null);

  /** Triggered by search form submit. 
   * the AddressParcelLookupForm component allows users search for a property using one of two sets of criteria. The first option includes the search terms: `borough`, `street number`, `street name` and `unit` (all required except for `unit` which is optional).  The second option includes the search terms `borough`, `block` and `lot` (all required).  When the search form is submitted, the `search()` function is called with the search term, and the list of companies is updated.
  */
  async function search(legalsSearchTerms) {
    console.debug("AddressParcelLookup search called with:", legalsSearchTerms);
    try {
      const results = await SnacrisApi.queryAcrisAddressParcel(legalsSearchTerms);
      console.debug("AddressParcelLookup: search results:", results);
      setResults(results);
    } catch (err) {
      console.error("Error fetching results:", err);
      setResults([]);
    }
  }

  return (
    <div className="container justify-content-center text-center">
      <h2 className="mb-2 fw-bold">Lookup Address or Parcel</h2>
      {results && results.length > 0 && (
        <AddressParcelCard
          borough={results[0].borough}
          block={results[0].block}
          lot={results[0].lot}
          street_number={results[0].street_number}
          street_name={results[0].street_name}
        />
      )}
      <AddressParcelLookupForm searchFor={search} />
    </div>
  );
}

export default AddressParcelLookup;

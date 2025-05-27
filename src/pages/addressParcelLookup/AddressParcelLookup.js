import React, { useState } from "react";
import SnacrisApi from "../../api/api";
import AddressParcelLookupForm from "./AddressParcelLookupForm";
import AddressParcelLookupDisplay from "./AddressParcelLookupDisplay";
import "./addressParcelLookup.css";

function AddressParcelLookup() {
  //console.debug("AddressParcelLookup");

  const [results, setResults] = useState(null);

  async function searchRPLegals(legalsSearchTerms, setAlert) {
    console.debug("AddressParcelLookup search called with:", legalsSearchTerms);
    try {
      const response = await SnacrisApi.queryAcrisAddressParcel(legalsSearchTerms);
      console.debug("AddressParcelLookup: search results:", response);

      // If response is an array, treat it as results
      if (Array.isArray(response) && response.length > 0) {
        setResults(response);
        setAlert({ type: "success", messages: ["Results found."] });
      } else if (Array.isArray(response) && response.length === 0) {
        setResults([]);
        setAlert({ type: "danger", messages: ["No results found."] });
      } else {
        setResults([]);
        setAlert({ type: "danger", messages: ["Unexpected response format."] });
      }
    } catch (err) {
      console.error("Error fetching results:", err);
      setResults([]);
      setAlert({ type: "danger", messages: ["An error occurred while fetching data. Please try again."] });
    }
  }

  return (
    <div className="container">
      <div className="row mb-2">
        <h1 className="title">Lookup Address or Parcel</h1>
        <em className="subtitle">Recorded Documents Only</em>
      </div>
      <div className="row">
        <p className="helper-text">
          If you know the property address, complete the fields below and press "Submit" to find the Borough/Block/Lot ("BBL") of the property. If an address is found, the results will show the BBL information along with any associated street address(es). Keep in mind that a property will have one BBL reference but may more than one street address.
        </p>
      </div>
      <div className="row">
        <div className="col-12 col-lg-4 col-md-4 mb-2">
          <AddressParcelLookupForm searchFor={searchRPLegals} />
        </div>
        <div className="col-12 col-lg-8 col-md-8">
          {results && (<AddressParcelLookupDisplay results={results} />)}
        </div>
      </div>
    </div>
  );
}

export default AddressParcelLookup;
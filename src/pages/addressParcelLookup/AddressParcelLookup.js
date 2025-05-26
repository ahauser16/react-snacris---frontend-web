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
    <div className="container justify-content-center text-center">
      <h2 className="mb-2 fw-bold">Lookup Address or Parcel</h2>
      <p className="helper-text">
        If you know the property address, complete the fields below and press "Submit" to find the Borough/Block/Lot ("BBL") of the property. If an address is found, the results will show the BBL information along with any associated street address(es). Keep in mind that a property will have one BBL reference but may have one or more street addresses.
      </p>
      <AddressParcelLookupForm searchFor={searchRPLegals} />
      <AddressParcelLookupDisplay results={results} />
    </div>
  );
}

export default AddressParcelLookup;
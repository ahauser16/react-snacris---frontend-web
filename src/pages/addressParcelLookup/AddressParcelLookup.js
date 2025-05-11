import React, { useState } from "react";
import SnacrisApi from "../../api/api";
import AddressParcelLookupForm from "./AddressParcelLookupForm";
import AddressParcelCard from "./AddressParcelCard";
import "./addressParcelLookup.css";

function AddressParcelLookup() {
  console.debug("AddressParcelLookup");

  const [results, setResults] = useState(null);

  async function searchRPLegals(legalsSearchTerms, setAlert) {
    console.debug("AddressParcelLookup search called with:", legalsSearchTerms);
    try {
      const response = await SnacrisApi.queryAcrisAddressParcel(legalsSearchTerms);
      console.debug("AddressParcelLookup: search results:", response);

      if (response.status === "success") {
        setResults(response.records); // Update results state with the records array
        setAlert({ type: "success", messages: [response.message] });
      } else {
        setResults([]); // Set results to an empty array if no records are found
        setAlert({ type: "danger", messages: [response.message] });
      }
    } catch (err) {
      console.error("Error fetching results:", err);
      setResults([]); // Set results to an empty array in case of an error
      setAlert({ type: "danger", messages: ["An error occurred while fetching data. Please try again."] });
    }
  }

  // Group results by borough, block, and lot
  const groupedResults = results
    ? results.reduce((acc, result) => {
      const key = `${result.borough}-${result.block}-${result.lot}`;
      if (!acc[key]) {
        acc[key] = {
          borough: result.borough,
          block: result.block,
          lot: result.lot,
          addresses: [],
        };
      }
      acc[key].addresses.push({
        street_number: result.street_number,
        street_name: result.street_name,
      });
      return acc;
    }, {})
    : {};

  return (
    <div className="container justify-content-center text-center">
      <h2 className="mb-2 fw-bold">Lookup Address or Parcel</h2>
      <p className="helper-text">
        If you know the property address, complete the fields below and press "Submit" to find the Borough/Block/Lot ("BBL") of the property. If an address is found, the results will show the BBL information along with any associated street address(es). Keep in mind that a property will have one BBL reference but may have one or more street addresses.
      </p>
      <AddressParcelLookupForm searchFor={searchRPLegals} />
      {results === null ? (
        <p className="text-muted">Please submit a search to see results.</p>
      ) : results.length > 0 ? (
        <div className="row">
          {Object.values(groupedResults).map((group, idx) => (
            <AddressParcelCard
              key={idx}
              borough={group.borough}
              block={group.block}
              lot={group.lot}
              addresses={group.addresses}
            />
          ))}
        </div>
      ) : (
        <p className="text-danger">No results found.</p>
      )}
    </div>
  );
}

export default AddressParcelLookup;
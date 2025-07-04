import React, { useState } from "react";
import Alert from "../../common/Alert";
import SnacrisApi from "../../api/api";
import AddressParcelLookupForm from "./AddressParcelLookupForm";
import AddressParcelLookupDisplay from "./AddressParcelLookupDisplay";
import "./addressParcelLookup.css";

function AddressParcelLookup() {
  const [results, setResults] = useState(null);
  const [alert, setAlert] = useState({ type: "", messages: [] });

  async function searchRPLegals(legalsSearchTerms) {
    console.debug("AddressParcelLookup search called with:", legalsSearchTerms);
    try {
      const response = await SnacrisApi.queryAcrisAddressParcel(
        legalsSearchTerms
      );
      console.debug("AddressParcelLookup: search results:", response);

      // show backend errors immediately
      if (response && response.status === "failed") {
        // map specific backend failure to friendly message
        const backendMsg = response.message || "";
        const userMsg = backendMsg.includes(
          "Failed to fetch records from Real Property Legals API"
        )
          ? "The combination of your Borough, Street Number and Street Name query did not match any values in the ACRIS dataset."
          : backendMsg;
        setResults(null);
        setAlert({ type: "danger", messages: [userMsg] });
        return;
      }
      if (response && response.status === "success" && response.analysis) {
        setResults(response);
        setAlert({
          type: "success",
          messages: [response.message || "Results found."],
        });
      } else if (
        response &&
        response.status === "success" &&
        !response.analysis
      ) {
        setResults(response);
        setAlert({ type: "danger", messages: ["No analysis data found."] });
      } else {
        setResults(response);
        setAlert({
          type: "danger",
          messages: [response.message || "Unexpected response format."],
        });
      }
    } catch (err) {
      console.error("Error fetching results:", err);
      setResults(null);
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
            <h2 className="title mb-0 me-2">Lookup Address or Parcel</h2>
            <em className="subtitle mb-0">Recorded Documents Only</em>
          </div>
          <p>
            If you know the property address, complete the fields below and
            press "Submit" to find the Borough, Block & Lot (<b>BBL</b>) of the
            property. If an address is found, the results will show the{" "}
            <b>BBL</b> information along with any associated street address(es).
            Keep in mind that a property will have one <b>BBL</b> reference but
            may have more than one street address.
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
          <AddressParcelLookupForm
            searchFor={searchRPLegals}
            setAlert={setAlert}
          />
        </div>
        <div className="col-12 col-lg-8 col-md-8">
          {results && <AddressParcelLookupDisplay results={results} />}
        </div>
      </div>
    </div>
  );
}

export default AddressParcelLookup;

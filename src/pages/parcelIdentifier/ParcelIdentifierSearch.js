import React, { useState } from "react";
import Alert from "../../common/Alert";
import ParcelIdentifierSearchForm from "./ParcelIdentifierSearchForm";
import ParcelIdentifierSearchDisplay from "./ParcelIdentifierSearchDisplay";
import SnacrisApi from "../../api/api";

function ParcelIdentifierSearch() {
  console.debug("ParcelIdentifierSearch");

  const [results, setResults] = useState(null);
  const [dataFound, setDataFound] = useState(null);
  const [alert, setAlert] = useState({ type: "", messages: [] });

  async function search(masterSearchTerms, legalsSearchTerms) {
    console.debug(
      "ParcelIdentifierSearch: search called with: masterSearchTerms and legalsSearchTerms objects:",
      masterSearchTerms,
      legalsSearchTerms
    );
    try {
      const res = await SnacrisApi.queryAcrisParcel(
        masterSearchTerms,
        legalsSearchTerms
      );
      console.log("ParcelIdentifierSearch: search results:", res);
      setDataFound(res.dataFound);
      setResults(res.results || []);
      if (res.dataFound) {
        setAlert({
          type: "success",
          messages: [res.message || "Results found."],
        });
      } else {
        // map specific backend error to friendly message
        let msgs;
        if (
          Array.isArray(res.errMsg) &&
          res.errMsg.some((msg) =>
            msg.includes(
              "Failed to fetch document IDs from Real Property Legals API"
            )
          )
        ) {
          msgs = [
            "The combination of your Borough, Tax Block and Tax Lot query did not match any values in the ACRIS dataset.",
          ];
        } else if (
          Array.isArray(res.errMsg) &&
          res.errMsg.some((msg) =>
            msg.includes(
              "Failed to fetch document IDs from Real Property Master API"
            )
          )
        ) {
          msgs = [
            "The combination of your Document Class and Document Type query did not match any values in the ACRIS dataset.",
          ];
        } else if (Array.isArray(res.errMsg) && res.errMsg.length > 0) {
          msgs = res.errMsg;
        } else {
          msgs = ["No results found."];
        }
        setAlert({ type: "danger", messages: msgs });
      }
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
      <div className="row mb-2">
        <div
          className="alert alert-info col-12 col-lg-12 d-flex flex-column align-items-start justify-content-start mb-1 p-1"
          role="alert"
        >
          <div className="d-flex align-items-end justify-content-start mb-1">
            <h2 className="title mb-0 me-2">
              Search By Parcel (Borough, Block & Lot)
            </h2>
            <em className="subtitle mb-0">Recorded Documents Only</em>
          </div>
          <p>
            Enter the Borough, Block & Lot (<b>BBL</b>) of the property you want
            to find documents for below. Additionally, you can narrow your
            search by selecting a class or type of document and selecting a date
            range.
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
          <ParcelIdentifierSearchForm searchFor={search} setAlert={setAlert} />
        </div>
        <div className="col-12 col-lg-8 col-md-8">
          {dataFound === true && (
            <ParcelIdentifierSearchDisplay results={results} />
          )}
        </div>
      </div>
    </div>
  );
}

export default ParcelIdentifierSearch;

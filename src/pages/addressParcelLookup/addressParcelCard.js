import React from "react";
import { Link } from "react-router-dom";
import "./addressParcelCard.css";

/** Show limited information about a company
 *
 * Is rendered by CompanyList to show a "card" for each company.
 * 
 * Clicking on a CompanyCard navigates to the CompanyDetail page for the selected company.
 *
 * CompanyList -> CompanyCard
 */
// CompanyCard is a presentational component that displays a summary of a single company. 
// It is rendered by CompanyList.js for each company in the list.
// It Receives name, description, logoUrl, and handle as props from the CompanyList component.
function AddressParcelCard({ borough, block, lot, street_number, street_name }) {
  console.debug("AddressParcelCard", borough, block, lot, street_number, street_name);

  const boroughName = {
    1: "Manhattan",
    2: "Bronx",
    3: "Brooklyn",
    4: "Queens",
    5: "Staten Island"
  }[borough] || "Unknown";

  return (
    <div className="card mb-3 shadow-sm col-6 mx-auto">
      <div className="card-body row">
        <h4 className="card-title text-primary mb-3">
          Street Address & Borough, Block & Lot
        </h4>
        <div className="col-6 text-start">
          <h6 className="card-text">Borough: {boroughName}</h6>
          <h6 className="card-text">Block: {block}</h6>
          <h6 className="card-text">Lot: {lot}</h6>
        </div>
        <div className="col-6 text-start">
        <h6 className="card-text">Street Number: {street_number}</h6>
        <h6 className="card-text">Street Name: {street_name}</h6>
      </div>
    </div>
    </div >
  );
}

export default AddressParcelCard;

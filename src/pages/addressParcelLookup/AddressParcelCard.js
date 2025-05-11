import React from "react";
import "./addressParcelCard.css";
import { Link } from "react-router-dom";


function AddressParcelCard({ borough, block, lot, addresses }) {
  console.debug("AddressParcelCard", borough, block, lot, addresses);

  const boroughName = {
    1: "Manhattan",
    2: "Bronx",
    3: "Brooklyn",
    4: "Queens",
    5: "Staten Island",
  }[borough] || "Unknown";

  return (
    <div className="card mb-3 shadow-sm col-6 mx-auto">
      <div className="card-body">
        <h4 className="card-title text-primary mb-3">
          {boroughName}, Block {block}, Lot {lot}
        </h4>
        <h5 className="card-subtitle mb-2 text-muted">Street Addresses:</h5>
        <ul className="list-unstyled">
          {addresses.map((address, idx) => (
            <li key={idx}>
              {address.street_number} {address.street_name}
            </li>
          ))}
        </ul>
        <Link className="btn btn-primary fw-bold me-3" to="/ParcelIdentifierSearch">Search For Documents</Link>
      </div>
    </div>
  );
}

export default AddressParcelCard;
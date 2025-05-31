import React from "react";
import AddressParcelCard from "./AddressParcelCard";

const AddressParcelLookupDisplay = ({ results }) => {
  if (!results) {
    return <p className="text-muted">Please submit a search to see results.</p>;
  }
  if (results.error) {
    return <p className="text-danger">{results.error}</p>;
  }
  if (!results.analysis) {
    return <p className="text-danger">No analysis data found.</p>;
  }

  return (
    <div className="row pt-3">
      <AddressParcelCard {...results.analysis} />
    </div>
  );
};

export default AddressParcelLookupDisplay;
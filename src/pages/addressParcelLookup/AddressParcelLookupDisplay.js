import React from "react";
import AddressParcelCard from "./AddressParcelCard";

const AddressParcelLookupDisplay = ({ results }) => {
  if (results === null) {
    return <p className="text-muted">Please submit a search to see results.</p>;
  }

  const groupedResults = results.length
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

  return results.length > 0 ? (
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
    <p className="text-danger">No results found</p>
  );
};

export default AddressParcelLookupDisplay;
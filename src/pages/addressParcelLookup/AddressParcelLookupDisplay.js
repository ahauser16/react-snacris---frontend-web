import React from "react";
import AddressParcelCard from "./AddressParcelCard";

const FIELDS_TO_CHECK = [
  "easement",
  "partial_lot",
  "air_rights",
  "subterranean_rights",
  "property_type",
];

function getGroupFields(records) {
  const first = records[0];
  const exceptions = [];
  const base = {};

  FIELDS_TO_CHECK.forEach((field) => {
    const allSame = records.every((rec) => rec[field] === first[field]);
    if (allSame) {
      base[field] = first[field];
    } else {
      // Collect exceptions for this field
      records.forEach((rec) => {
        if (rec[field] !== first[field]) {
          exceptions.push({
            document_id: rec.document_id,
            field,
            value: rec[field],
          });
        }
      });
    }
  });

  return { ...base, exceptions };
}

const AddressParcelLookupDisplay = ({ results }) => {
  if (results === null) {
    return <p className="text-muted">Please submit a search to see results.</p>;
  }

  // Group by borough-block-lot
  const groupedResults = results.length
    ? results.reduce((acc, result) => {
      const key = `${result.borough}-${result.block}-${result.lot}`;
      if (!acc[key]) {
        acc[key] = {
          borough: result.borough,
          block: result.block,
          lot: result.lot,
          records: [],
        };
      }
      acc[key].records.push(result);
      return acc;
    }, {})
    : {};

  return results.length > 0 ? (
    <div className="row pt-3">
      {Object.values(groupedResults).map((group, idx) => {
        // Gather all addresses for this group, including document_id
        const addresses = group.records
          .filter((rec) => rec.street_number && rec.street_name)
          .map((rec) => ({
            street_number: rec.street_number,
            street_name: rec.street_name,
            document_id: rec.document_id, // <-- include document_id
          }));

        const { exceptions, ...fields } = getGroupFields(group.records);

        return (
          <AddressParcelCard
            key={idx}
            borough={group.borough}
            block={group.block}
            lot={group.lot}
            addresses={addresses}
            easement={fields.easement}
            partial_lot={fields.partial_lot}
            air_rights={fields.air_rights}
            subterranean_rights={fields.subterranean_rights}
            property_type={fields.property_type}
            exceptions={exceptions}
          />
        );
      })}
    </div>
  ) : (
    <p className="text-danger">No results found</p>
  );
};

export default AddressParcelLookupDisplay;
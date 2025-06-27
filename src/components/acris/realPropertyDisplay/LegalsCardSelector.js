import React, { useState } from "react";
import RealPropertyLegalsCard from "./RealPropertyLegalsCard";

function LegalsCardSelector({ legalsRecords }) {
  const [selectedIdx, setSelectedIdx] = useState(0);

  // Debug logging
  console.log("LegalsCardSelector: legalsRecords", legalsRecords);
  console.log(
    "LegalsCardSelector: legalsRecords length",
    legalsRecords?.length
  );

  // Ensure legalsRecords is an array
  const safeRecords = Array.isArray(legalsRecords) ? legalsRecords : [];

  return (
    <div className="w-100 mb-3">
      <div className="btn-group mb-2 d-flex flex-wrap">
        {safeRecords.length > 0 ? (
          safeRecords.map((rec, idx) => (
            <button
              key={idx}
              className={`btn btn-sm flex-fill ${
                selectedIdx === idx ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setSelectedIdx(idx)}
            >
              {`Lot ${rec.lot || rec.property_lot || "N/A"}`}
            </button>
          ))
        ) : (
          <button className="btn btn-sm btn-outline-secondary" disabled>
            No Legal Records Available
          </button>
        )}
      </div>
      {safeRecords.length > 0 ? (
        <RealPropertyLegalsCard {...safeRecords[selectedIdx]} />
      ) : (
        <div className="card mb-3 shadow-sm w-100">
          <div
            className="card-body notApplic"
            aria-label="Legal data not available"
          >
            <span aria-hidden="true">
              Legal Data is N/A - This document may not have associated legal
              records
            </span>
            <span className="visually-hidden">
              Legal data not available for this document
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default LegalsCardSelector;

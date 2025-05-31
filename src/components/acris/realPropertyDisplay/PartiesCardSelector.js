import React, { useState } from "react";
import RealPropertyPartiesCard from "./RealPropertyPartiesCard";
import "./commonRealPropCardDisplay.css";

function PartiesCardSelector({ partiesRecords, docType }) {
  const partyTypes = [1, 2, 3];
  const [selectedParty, setSelectedParty] = useState(
    partiesRecords?.[0]?.party_type?.toString() || "1"
  );
  const partyRecords = partyTypes.map((type) =>
    partiesRecords.find((rec) => String(rec.party_type) === String(type))
  );

  return (
    <div className="w-100 mb-3">
      <div className="btn-group mb-2 d-flex flex-wrap">
        {partyTypes.map((type, idx) =>
          partyRecords[idx] ? (
            <button
              key={type}
              className={`btn btn-sm flex-fill ${selectedParty === String(type) ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setSelectedParty(String(type))}
            >
              {`Party ${type}: ${partyRecords[idx].name}`}
            </button>
          ) : (
            <button
              key={type}
              className="btn btn-sm btn-outline-secondary notApplic flex-fill"
              disabled
              aria-label={`Party ${type} data not available`}
            >
              <span aria-hidden="true">{`Party ${type} is N/A`}</span>
              <span className="visually-hidden">{`Party ${type} data not available`}</span>
            </button>
          )
        )}
      </div>
      {partyRecords.some((rec, idx) => String(idx + 1) === selectedParty && rec) ? (
        <RealPropertyPartiesCard
          {...partyRecords[Number(selectedParty) - 1]}
          doc_type={docType}
        />
      ) : (
        <div className="card mb-3 shadow-sm w-100">
          <div className="card-body notApplic" aria-label="Party data not available">
            <span aria-hidden="true">N/A</span>
            <span className="visually-hidden">Party data not available</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default PartiesCardSelector;
import React, { useState } from "react";
import RealPropertyPartiesCard from "./RealPropertyPartiesCard";
import "./commonRealPropCardDisplay.css";

function PartiesCardSelector({ partiesRecords, docType }) {
  // Group parties by party_type
  const partyGroups = {};
  if (partiesRecords && partiesRecords.length > 0) {
    partiesRecords.forEach((party) => {
      const partyType = String(party.party_type);
      if (!partyGroups[partyType]) {
        partyGroups[partyType] = [];
      }
      partyGroups[partyType].push(party);
    });
  }

  // Get available party types and sort them
  const availablePartyTypes = Object.keys(partyGroups).sort();

  // State for selected party type and selected party index within that type
  const [selectedPartyType, setSelectedPartyType] = useState(
    availablePartyTypes.length > 0 ? availablePartyTypes[0] : "1"
  );
  const [selectedPartyIndex, setSelectedPartyIndex] = useState(0);

  // Get the current parties for the selected type
  const currentPartyGroup = partyGroups[selectedPartyType] || [];
  const currentParty = currentPartyGroup[selectedPartyIndex];

  // Reset party index when party type changes
  const handlePartyTypeChange = (partyType) => {
    setSelectedPartyType(partyType);
    setSelectedPartyIndex(0);
  };

  if (!partiesRecords || partiesRecords.length === 0) {
    return (
      <div className="w-100 mb-3">
        <div className="card mb-3 shadow-sm w-100">
          <div
            className="card-body notApplic"
            aria-label="Party data not available"
          >
            <span aria-hidden="true">Party Data is N/A</span>
            <span className="visually-hidden">Party data not available</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-100 mb-3">
      {/* Party Type Selection */}
      <div className="btn-group mb-2 d-flex flex-wrap">
        {availablePartyTypes.map((partyType) => {
          const partyCount = partyGroups[partyType].length;
          const displayName =
            partyCount > 1
              ? `Party ${partyType} (${partyCount} records)`
              : `Party ${partyType}: ${
                  partyGroups[partyType][0]?.name || "Unknown"
                }`;

          return (
            <button
              key={partyType}
              className={`btn btn-sm flex-fill ${
                selectedPartyType === partyType
                  ? "btn-primary"
                  : "btn-outline-primary"
              }`}
              onClick={() => handlePartyTypeChange(partyType)}
            >
              {displayName}
            </button>
          );
        })}
      </div>

      {/* Party Navigation within Type (if multiple parties of same type) */}
      {currentPartyGroup.length > 1 && (
        <div className="d-flex align-items-center mb-2 gap-2">
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() =>
              setSelectedPartyIndex(Math.max(0, selectedPartyIndex - 1))
            }
            disabled={selectedPartyIndex === 0}
          >
            ← Previous
          </button>
          <span className="text-muted">
            {selectedPartyIndex + 1} of {currentPartyGroup.length} Party{" "}
            {selectedPartyType} records
          </span>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() =>
              setSelectedPartyIndex(
                Math.min(currentPartyGroup.length - 1, selectedPartyIndex + 1)
              )
            }
            disabled={selectedPartyIndex === currentPartyGroup.length - 1}
          >
            Next →
          </button>
        </div>
      )}

      {/* Current Party Display */}
      {currentParty ? (
        <div>
          {currentPartyGroup.length > 1 && (
            <h6 className="text-primary mb-2">
              {currentParty.name} (Record {selectedPartyIndex + 1})
            </h6>
          )}
          <RealPropertyPartiesCard {...currentParty} doc_type={docType} />
        </div>
      ) : (
        <div className="card mb-3 shadow-sm w-100">
          <div
            className="card-body notApplic"
            aria-label="Party data not available"
          >
            <span aria-hidden="true">N/A</span>
            <span className="visually-hidden">Party data not available</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default PartiesCardSelector;

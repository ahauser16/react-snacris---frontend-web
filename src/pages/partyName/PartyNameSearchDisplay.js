import React, { useState } from "react";
import RealPropertyMasterCard from "../../components/acris/RealPropertyMasterCard";
import RealPropertyLegalsCard from "../../components/acris/RealPropertyLegalsCard";
import RealPropertyPartiesCard from "../../components/acris/RealPropertyPartiesCard";
import RealPropertyRefsCard from "../../components/acris/RealPropertyRefsCard";
import RealPropertyRemarksCard from "../../components/acris/RealPropertyRemarksCard";

// Helper to get doc_type for parties
function getDocTypeForParties(masterRecords) {
  return masterRecords?.[0]?.doc_type || "";
}

// Parties Card with selector
function PartiesCardSelector({ partiesRecords, docType }) {
  const partyTypes = [1, 2, 3];
  const [selectedParty, setSelectedParty] = useState(
    partiesRecords?.[0]?.party_type?.toString() || "1"
  );
  const partyRecords = partyTypes.map((type) =>
    partiesRecords.find((rec) => String(rec.party_type) === String(type))
  );

  return (
    <div className="col-md-4 d-flex flex-column align-items-center">
      <div className="btn-group mb-2">
        {partyTypes.map((type, idx) =>
          partyRecords[idx] ? (
            <button
              key={type}
              className={`btn btn-sm ${selectedParty === String(type) ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setSelectedParty(String(type))}
            >
              {`Party ${type}: ${partyRecords[idx].name}`}
            </button>
          ) : (
            <button key={type} className="btn btn-sm btn-outline-secondary" disabled>
              {`Party ${type} is N/A`}
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
        <div className="card mb-3 shadow-sm col-12 mx-auto">
          <div className="card-body">Party Data is N/A</div>
        </div>
      )}
    </div>
  );
}

// Legals Card with selector
function LegalsCardSelector({ legalsRecords }) {
  const [selectedIdx, setSelectedIdx] = useState(0);

  return (
    <div className="col-md-4 d-flex flex-column align-items-center">
      <div className="btn-group mb-2">
        {legalsRecords.length > 0
          ? legalsRecords.map((rec, idx) => (
              <button
                key={idx}
                className={`btn btn-sm ${selectedIdx === idx ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setSelectedIdx(idx)}
              >
                {`Lot ${idx + 1}`}
              </button>
            ))
          : <button className="btn btn-sm btn-outline-secondary" disabled>No Legals</button>
        }
      </div>
      {legalsRecords.length > 0 ? (
        <RealPropertyLegalsCard {...legalsRecords[selectedIdx]} />
      ) : (
        <div className="card mb-3 shadow-sm col-12 mx-auto">
          <div className="card-body">Legals Data is N/A</div>
        </div>
      )}
    </div>
  );
}

// Always show a card for Refs, even if empty
function RefsCardDisplay({ referencesRecords, document_id }) {
  if (!referencesRecords || referencesRecords.length === 0) {
    return (
      <div className="card mb-3 shadow-sm col-12 mx-auto">
        <div className="card-body">Reference Data is N/A</div>
      </div>
    );
  }
  return referencesRecords.map((rec, idx) => (
    <RealPropertyRefsCard key={`refs-${document_id}-${idx}`} {...rec} />
  ));
}

// Always show a card for Remarks, even if empty
function RemarksCardDisplay({ remarksRecords, document_id }) {
  if (!remarksRecords || remarksRecords.length === 0) {
    return (
      <div className="card mb-3 shadow-sm col-12 mx-auto">
        <div className="card-body">Remarks Data is N/A</div>
      </div>
    );
  }
  return remarksRecords.map((rec, idx) => (
    <RealPropertyRemarksCard key={`remarks-${document_id}-${idx}`} {...rec} />
  ));
}

// Main container for all cards for a single document_id
function RealPropertyCardContainer({ group }) {
  const docType = getDocTypeForParties(group.masterRecords);

  return (
    <div className="card mb-3 shadow-sm col-12 mx-auto p-3">
      <h4>Document ID: {group.document_id}</h4>
      <div className="row justify-content-center">
        {/* Legals - left */}
        <LegalsCardSelector legalsRecords={group.legalsRecords || []} />
        {/* Master - center */}
        <div className="col-md-4 d-flex flex-column align-items-center">
          {group.masterRecords?.length > 0 ? (
            <RealPropertyMasterCard {...group.masterRecords[0]} />
          ) : (
            <div className="card mb-3 shadow-sm col-12 mx-auto">
              <div className="card-body">Master Data is N/A</div>
            </div>
          )}
        </div>
        {/* Parties - right */}
        <PartiesCardSelector
          partiesRecords={group.partiesRecords || []}
          docType={docType}
        />
      </div>
      {/* Refs and Remarks below */}
      <div className="row justify-content-center mt-4">
        <div className="col-md-6">
          <RefsCardDisplay referencesRecords={group.referencesRecords || []} document_id={group.document_id} />
        </div>
        <div className="col-md-6">
          <RemarksCardDisplay remarksRecords={group.remarksRecords || []} document_id={group.document_id} />
        </div>
      </div>
    </div>
  );
}

function PartyNameSearchDisplay({ results }) {
  const [selectedDocId, setSelectedDocId] = useState(
    results && results.length > 0 ? results[0].document_id : null
  );

  if (!results || results.length === 0) {
    return <p className="text-danger">No results found.</p>;
  }

  // DocumentIdIndex: clickable list of document_ids
  function DocumentIdIndex({ results, selectedDocId, setSelectedDocId }) {
    return (
      <div className="mb-3">
        <h5>Select a Document ID:</h5>
        <div className="d-flex flex-wrap gap-2 justify-content-center">
          {results.map((group) => (
            <button
              key={group.document_id}
              className={`btn btn-sm ${selectedDocId === group.document_id ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setSelectedDocId(group.document_id)}
            >
              {group.document_id}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const selectedGroup = results.find((g) => g.document_id === selectedDocId);

  return (
    <>
      <DocumentIdIndex
        results={results}
        selectedDocId={selectedDocId}
        setSelectedDocId={setSelectedDocId}
      />
      {selectedGroup && <RealPropertyCardContainer group={selectedGroup} />}
    </>
  );
}

export default PartyNameSearchDisplay;
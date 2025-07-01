import React, { useState } from "react";
import RealPropertyCardContainer from "../../components/acris/realPropertyDisplay/RealPropertyCardContainer";
import DocumentIdMenu from "../../components/acris/realPropertyDisplay/DocumentIdMenu";

function ParcelIdentifierSearchDisplay({ results }) {
  const [selectedDocId, setSelectedDocId] = useState(
    results && results.length > 0 ? results[0].document_id : null
  );

  if (!results || results.length === 0) {
    return <p className="text-danger">No results found.</p>;
  }

  const selectedGroup = results.find((g) => g.document_id === selectedDocId);

  return (
    <>
      <DocumentIdMenu
        results={results}
        selectedDocId={selectedDocId}
        setSelectedDocId={setSelectedDocId}
      />
      {selectedGroup && <RealPropertyCardContainer group={selectedGroup} />}
    </>
  );
}

export default ParcelIdentifierSearchDisplay;

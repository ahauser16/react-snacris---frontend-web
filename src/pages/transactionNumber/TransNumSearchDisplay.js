import React, { useState } from "react";
import RealPropertyCardContainer from "../../components/acris/realPropertyDisplay/RealPropertyCardContainer";
import DocumentIdMenu from "../../components/acris/realPropertyDisplay/DocumentIdMenu";

function TransNumSearchDisplay({ results }) {
  console.log("TransNumSearchDisplay: received results:", results);

  const [selectedDocId, setSelectedDocId] = useState(
    results && results.length > 0 ? results[0].document_id : null
  );

  if (!results || results.length === 0) {
    console.log("TransNumSearchDisplay: No results to display");
    return <p className="text-danger">No results found.</p>;
  }

  const selectedGroup = results.find((g) => g.document_id === selectedDocId);
  console.log("TransNumSearchDisplay: selectedGroup:", selectedGroup);

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

export default TransNumSearchDisplay;

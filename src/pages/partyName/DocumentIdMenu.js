import React from "react";

function DocumentIdMenu({ results, selectedDocId, setSelectedDocId }) {
  return (
    <div className="card mb-3 shadow-sm w-100 p-1">
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

export default DocumentIdMenu;
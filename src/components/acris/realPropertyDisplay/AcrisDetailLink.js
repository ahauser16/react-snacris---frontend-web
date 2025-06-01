import React from "react";

function AcrisDetailLink({ document_id }) {
  return (
    <a
      href={`https://a836-acris.nyc.gov/DS/DocumentSearch/DocumentDetail?doc_id=${document_id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-outline-primary btn-sm ms-2 m-1"
    >
      Document Detail
    </a>
  );
}

export default AcrisDetailLink;
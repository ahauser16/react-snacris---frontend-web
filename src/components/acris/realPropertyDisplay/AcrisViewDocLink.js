import React from "react";

function AcrisViewDocLink({ document_id }) {
  return (
    <a
      href={`https://a836-acris.nyc.gov/DS/DocumentSearch/DocumentImageView?doc_id=${document_id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-outline-primary btn-sm ms-2 m-1"
    >
      View Document
    </a>
  );
}

export default AcrisViewDocLink;
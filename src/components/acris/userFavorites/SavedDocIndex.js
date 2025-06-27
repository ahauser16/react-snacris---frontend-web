import React, { useState, useEffect } from "react";
import SnacrisApi from "../../../api/api";

/**
 * SavedDocIndex component
 *
 * Displays a list of saved documents in a compact format.
 * Each item shows document_id, doc_type, and party information with proper roles.
 * Users can click on an item to view the full document details.
 */
function SavedDocIndex({ documents, selectedDocumentId, onDocumentSelect }) {
  const [docControlCodes, setDocControlCodes] = useState({
    deedsAndOtherConveyances: [],
    mortgagesAndInstruments: [],
    uccAndFederalLiens: [],
    otherDocuments: [],
  });
  const [isLoadingCodes, setIsLoadingCodes] = useState(true);

  useEffect(() => {
    async function getDocControlCodes() {
      try {
        const { docControlCodes } = await SnacrisApi.getDocControlCodesFromDb();
        setDocControlCodes(docControlCodes);
      } catch (error) {
        console.error("Error fetching document control codes:", error);
      } finally {
        setIsLoadingCodes(false);
      }
    }
    getDocControlCodes();
  }, []);

  /**
   * Get all document types from all categories
   */
  const getAllDocTypes = () => {
    return [
      ...docControlCodes.deedsAndOtherConveyances,
      ...docControlCodes.mortgagesAndInstruments,
      ...docControlCodes.uccAndFederalLiens,
      ...docControlCodes.otherDocuments,
    ];
  };

  /**
   * Get party role based on doc_type, doc_class, and party_type
   */
  const getPartyRole = (docType, docClass, partyType) => {
    if (isLoadingCodes) return "Loading...";

    const allDocTypes = getAllDocTypes();
    const docTypeInfo = allDocTypes.find((doc) => doc.doc_type === docType);

    if (!docTypeInfo) return `Party ${partyType}`;

    // Map party_type to the appropriate role from the document type info
    switch (partyType) {
      case "1":
        return docTypeInfo.party1_type || `Party 1`;
      case "2":
        return docTypeInfo.party2_type || `Party 2`;
      case "3":
        return docTypeInfo.party3_type || `Party 3`;
      default:
        return `Party ${partyType}`;
    }
  };

  /**
   * Format a document for display in the index
   */
  const formatDocumentDisplay = (doc) => {
    const docId = doc.document_id || "Unknown ID";
    const docType = doc.masterRecords?.[0]?.doc_type || "Unknown Type";
    const docClass = doc.masterRecords?.[0]?.doc_class || "";
    const parties = doc.partyRecords || doc.partiesRecords || [];

    return {
      documentId: docId,
      documentType: docType,
      parties: parties.map((party, index) => {
        // Try different possible field names for party name
        const name =
          party.party_name ||
          party.name ||
          party.party1_name ||
          party.party2_name ||
          party.party3_name ||
          "Unknown Name";

        const partyType = party.party_type || party.type || "1";
        const role = getPartyRole(docType, docClass, partyType);

        return {
          name,
          role,
          partyNumber: index + 1,
        };
      }),
    };
  };

  if (!documents || documents.length === 0) {
    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Saved Documents</h5>
          <p className="text-muted">No saved documents found.</p>
        </div>
      </div>
    );
  }

  if (isLoadingCodes) {
    return (
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Saved Documents ({documents.length})</h5>
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-center">
            <div
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></div>
            Loading document details...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Saved Documents ({documents.length})</h5>
        <small className="text-muted">
          Click on a document to view details
        </small>
      </div>
      <div className="card-body p-0">
        <ul className="list-group list-group-flush">
          {documents.map((doc, index) => {
            const docDisplay = formatDocumentDisplay(doc);
            return (
              <li
                key={`doc-index-${doc.document_id}-${index}`}
                className={`list-group-item list-group-item-action ${
                  selectedDocumentId === doc.document_id ? "active" : ""
                }`}
                style={{ cursor: "pointer" }}
                onClick={() => onDocumentSelect(doc.document_id)}
                title="Click to view full document details"
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1" style={{ fontSize: "0.9rem" }}>
                    <div className="mb-1">
                      <strong>Document ID:</strong> {docDisplay.documentId}
                    </div>
                    <div className="mb-1">
                      <strong>Document Type:</strong> {docDisplay.documentType}
                    </div>
                    {docDisplay.parties.map((party, partyIndex) => (
                      <div key={`party-${partyIndex}`} className="mb-1">
                        <strong>Party {party.partyNumber}:</strong> {party.name}{" "}
                        ({party.role})
                      </div>
                    ))}
                    {docDisplay.parties.length === 0 && (
                      <div className="mb-1 text-muted">
                        <strong>Parties:</strong> No parties available
                      </div>
                    )}
                  </div>
                  {selectedDocumentId === doc.document_id && (
                    <span className="badge bg-primary ms-2">Selected</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default SavedDocIndex;

import React, { useState, useEffect, useContext } from "react";
import RealPropertyCardContainer from "../realPropertyDisplay/RealPropertyCardContainer";
import SavedDocIndex from "./SavedDocIndex";
import SnacrisApi from "../../../api/api";
import UserContext from "../../../auth/UserContext";
import LoadingSpinner from "../../../common/LoadingSpinner";
import Alert from "../../../common/Alert";

/**
 * RetrieveDisplayRealPropertyDoc component
 *
 * Retrieves and displays saved real property documents for the current user.
 * Shows an index of all documents and displays one selected document at a time.
 */
function RetrieveDisplayRealPropertyDoc() {
  const { currentUser } = useContext(UserContext);
  const [documents, setDocuments] = useState([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    async function fetchSavedDocuments() {
      if (!currentUser) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const savedDocs = await SnacrisApi.getRealPropertyDocuments();

        // Transform the backend data structure to match what RealPropertyCardContainer expects
        const transformedDocs = transformDocumentsForDisplay(savedDocs);
        setDocuments(transformedDocs);

        // Auto-select the first document if available
        if (transformedDocs.length > 0) {
          setSelectedDocumentId(transformedDocs[0].document_id);
        }

        console.log("Retrieved saved documents:", transformedDocs);
      } catch (error) {
        console.error("Error fetching saved documents:", error);
        setAlert({
          type: "danger",
          messages: Array.isArray(error)
            ? error
            : ["Failed to load saved documents"],
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchSavedDocuments();
  }, [currentUser]);

  /**
   * Transform the backend document structure to match RealPropertyCardContainer expectations
   */
  function transformDocumentsForDisplay(backendDocs) {
    console.log(
      "RetrieveDisplayRealPropertyDoc: Raw backend docs:",
      backendDocs
    );

    return backendDocs.map((doc, index) => {
      console.log(`RetrieveDisplayRealPropertyDoc: Document ${index}:`, doc);
      console.log(
        `RetrieveDisplayRealPropertyDoc: Document ${index} legals:`,
        doc.legals
      );
      console.log(
        `RetrieveDisplayRealPropertyDoc: Document ${index} parties:`,
        doc.parties
      );

      // Log each party in detail
      if (doc.parties && doc.parties.length > 0) {
        doc.parties.forEach((party, partyIndex) => {
          console.log(
            `RetrieveDisplayRealPropertyDoc: Document ${index} Party ${partyIndex}:`,
            party
          );
          console.log(
            `RetrieveDisplayRealPropertyDoc: Document ${index} Party ${partyIndex} keys:`,
            Object.keys(party)
          );
        });
      }

      return {
        document_id: doc.master.document_id,
        masterRecords: [doc.master],
        legalsRecords: doc.legals || [],
        partyRecords: doc.parties || [],
        partiesRecords: doc.parties || [], // Support both naming conventions
        referencesRecords: doc.references || [],
        remarksRecords: doc.remarks || [],
      };
    });
  }

  /**
   * Handle successful deletion by removing the document from the local state
   */
  const handleDeleteSuccess = (deletedDocumentId) => {
    setDocuments((prevDocs) => {
      const updatedDocs = prevDocs.filter(
        (doc) => doc.document_id !== deletedDocumentId
      );

      // If the deleted document was selected, select another one or clear selection
      if (selectedDocumentId === deletedDocumentId) {
        if (updatedDocs.length > 0) {
          setSelectedDocumentId(updatedDocs[0].document_id);
        } else {
          setSelectedDocumentId(null);
        }
      }

      return updatedDocs;
    });

    // Show success message
    setAlert({
      type: "success",
      messages: ["Document deleted successfully!"],
    });

    // Clear success message after 3 seconds
    setTimeout(() => setAlert(null), 3000);
  };

  /**
   * Handle document selection from the index
   */
  const handleDocumentSelect = (documentId) => {
    setSelectedDocumentId(documentId);
  };

  /**
   * Get the currently selected document
   */
  const getSelectedDocument = () => {
    return (
      documents.find((doc) => doc.document_id === selectedDocumentId) || null
    );
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!currentUser) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">
          Please log in to view your saved documents.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-12">
          <h2 className="text-center mb-4">My Favorites</h2>

          {alert && <Alert type={alert.type} messages={alert.messages} />}

          {documents.length === 0 ? (
            <div className="text-center">
              <div className="alert alert-info">
                <h4>No Saved Documents</h4>
                <p>You haven't saved any real property documents yet.</p>
                <p>
                  Use the search features to find documents and click the "Save"
                  button to add them to your favorites.
                </p>
              </div>
            </div>
          ) : (
            <div className="row">
              {/* Document Index Column */}
              <div className="col-lg-4 mb-4">
                <SavedDocIndex
                  documents={documents}
                  selectedDocumentId={selectedDocumentId}
                  onDocumentSelect={handleDocumentSelect}
                />
              </div>

              {/* Selected Document Details Column */}
              <div className="col-lg-8">
                {getSelectedDocument() ? (
                  <div>
                    <h4 className="mb-3">Document Details</h4>
                    <RealPropertyCardContainer
                      group={getSelectedDocument()}
                      isSavedDocument={true}
                      onDeleteSuccess={handleDeleteSuccess}
                    />
                  </div>
                ) : (
                  <div className="alert alert-info">
                    <h5>Select a Document</h5>
                    <p>
                      Click on a document from the list to view its details.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RetrieveDisplayRealPropertyDoc;

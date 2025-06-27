import React, { useState, useEffect } from "react";
import SnacrisApi from "../../../api/api";

/**
 * DeleteRealPropertyDoc component - handles deleting saved real property documents
 * Receives the document ID and provides a delete button with feedback
 */
function DeleteRealPropertyDoc({ documentId, onDeleteSuccess }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState(null); // 'success', 'error', or null

  // Reset state when documentId changes to prevent state from lingering between documents
  useEffect(() => {
    setDeleteStatus(null);
    setIsDeleting(false);
  }, [documentId]);

  const handleDeleteDocument = async () => {
    if (
      !window.confirm("Are you sure you want to delete this saved document?")
    ) {
      return;
    }

    setIsDeleting(true);
    setDeleteStatus(null);

    try {
      const deletedMasterId = await SnacrisApi.deleteRealPropertyDocument(
        documentId
      );

      console.log(
        "Document deleted successfully with master ID:",
        deletedMasterId
      );
      setDeleteStatus("success");

      // Call the callback function to notify parent component of successful deletion
      if (onDeleteSuccess) {
        onDeleteSuccess(documentId);
      }

      // Don't clear success message here - let the useEffect handle state reset
      // when the component is used for a different document
    } catch (error) {
      console.error("Error deleting document:", error);
      setDeleteStatus("error");

      // Clear error message after 5 seconds
      setTimeout(() => setDeleteStatus(null), 5000);
    } finally {
      setIsDeleting(false);
    }
  };

  const getButtonClass = () => {
    if (deleteStatus === "success") return "btn btn-success me-2";
    if (deleteStatus === "error") return "btn btn-danger me-2";
    return "btn btn-outline-danger me-2";
  };

  const getButtonText = () => {
    if (isDeleting) return "Deleting...";
    if (deleteStatus === "success") return "Deleted!";
    if (deleteStatus === "error") return "Delete Failed";
    return "Delete Document";
  };

  return (
    <button
      className={getButtonClass()}
      onClick={handleDeleteDocument}
      disabled={isDeleting}
      aria-label="Delete saved document"
    >
      {getButtonText()}
    </button>
  );
}

export default DeleteRealPropertyDoc;

import React, { useState, useEffect, useContext } from "react";
import SnacrisApi from "../../../api/api";
import UserContext from "../../../auth/UserContext";

/**
 * SaveRealPropertyDoc component - handles saving real property document data
 * Receives the complete group data and transforms it for the backend API
 * Checks if document is already saved and shows persistent "Saved" state
 */
function SaveRealPropertyDoc({ group }) {
  const { currentUser } = useContext(UserContext);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'saved', 'error', or null
  const [isAlreadySaved, setIsAlreadySaved] = useState(false);
  const [isCheckingSaved, setIsCheckingSaved] = useState(true);

  // Check if document is already saved when component mounts
  useEffect(() => {
    async function checkIfDocumentSaved() {
      if (!currentUser || !group?.masterRecords?.[0]?.document_id) {
        setIsCheckingSaved(false);
        return;
      }

      try {
        const savedDocs = await SnacrisApi.getRealPropertyDocuments();
        const currentDocId = group.masterRecords[0].document_id;

        // Ensure savedDocs is an array and has the expected structure
        if (!Array.isArray(savedDocs)) {
          console.warn(
            "SaveRealPropertyDoc: savedDocs is not an array:",
            savedDocs
          );
          setIsAlreadySaved(false);
          return;
        }

        const isSaved = savedDocs.some(
          (doc) => doc?.master?.document_id === currentDocId
        );

        console.log("SaveRealPropertyDoc: Checking document", currentDocId);
        console.log(
          "SaveRealPropertyDoc: Saved docs:",
          savedDocs.map((doc) => doc?.master?.document_id)
        );
        console.log("SaveRealPropertyDoc: Is document saved?", isSaved);

        setIsAlreadySaved(isSaved);
        // Don't set saveStatus here - let isAlreadySaved handle the "Saved" state
      } catch (error) {
        console.error("Error checking if document is saved:", error);
        // Continue as if not saved on error
      } finally {
        setIsCheckingSaved(false);
      }
    }

    checkIfDocumentSaved();
  }, [currentUser, group?.masterRecords?.[0]?.document_id]);

  const handleSaveDocument = async () => {
    // If already saved, show alert and don't save again
    if (isAlreadySaved) {
      alert("This document is already saved to your favorites!");
      return;
    }

    setIsSaving(true);
    setSaveStatus(null);

    try {
      // Transform the group data to match the backend model structure
      const documentData = {
        master: group.masterRecords?.[0] || {},
        legals: group.legalsRecords || [],
        parties: group.partyRecords || group.partiesRecords || [],
        references: group.referencesRecords || [],
        remarks: group.remarksRecords || [],
      };

      // Call the API to save the document
      const savedMasterId = await SnacrisApi.saveRealPropertyDocument(
        documentData
      );

      console.log("Document saved successfully with master ID:", savedMasterId);
      setSaveStatus("saved");
      setIsAlreadySaved(true);

      // Don't clear the "Saved" status - keep it permanent
    } catch (error) {
      console.error("Error saving document:", error);
      setSaveStatus("error");

      // Clear error message after 5 seconds
      setTimeout(() => setSaveStatus(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const getButtonClass = () => {
    if (isCheckingSaved) return "btn btn-outline-secondary me-2";
    if (isAlreadySaved) return "btn btn-success me-2";
    if (saveStatus === "error") return "btn btn-danger me-2";
    return "btn btn-outline-success me-2";
  };

  const getButtonText = () => {
    console.log(
      "SaveRealPropertyDoc: Button text logic - isCheckingSaved:",
      isCheckingSaved,
      "isSaving:",
      isSaving,
      "isAlreadySaved:",
      isAlreadySaved,
      "saveStatus:",
      saveStatus
    );

    if (isCheckingSaved) return "Checking...";
    if (isSaving) return "Saving...";
    if (isAlreadySaved) return "Saved";
    if (saveStatus === "error") return "Save Failed";
    return "Save Document";
  };

  // If user is not logged in, don't show the save button
  if (!currentUser) {
    return null;
  }

  return (
    <button
      className={getButtonClass()}
      onClick={handleSaveDocument}
      disabled={isSaving || isCheckingSaved || isAlreadySaved}
      title={
        isAlreadySaved
          ? "This document is already saved"
          : saveStatus === "error"
          ? "Click to retry saving"
          : "Save this document to your account"
      }
    >
      {(isSaving || isCheckingSaved) && (
        <span
          className="spinner-border spinner-border-sm me-2"
          role="status"
          aria-hidden="true"
        ></span>
      )}
      {getButtonText()}
    </button>
  );
}

export default SaveRealPropertyDoc;

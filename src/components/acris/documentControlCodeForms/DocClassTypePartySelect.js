import React, { useState, useEffect } from "react";
import SnacrisApi from "../../../api/api";
import "../commonFormStyles.css";
import Tooltip from "../../utils/Tooltip";
import "./DocClassTypePartySelect.css";

function DocClassTypePartySelect({
    masterSearchTerms,
    setMasterSearchTerms,
    partySearchTerms,
    setPartySearchTerms,
}) {
    const [docControlCodes, setDocControlCodes] = useState({
        deedsAndOtherConveyances: [],
        mortgagesAndInstruments: [],
        uccAndFederalLiens: [],
        otherDocuments: [],
    });
    const [selectedDocType, setSelectedDocType] = useState(null);

    const isDocTypeDisabled = masterSearchTerms.doc_class === "all-classes-default";

    useEffect(() => {
        console.debug("DocClassTypePartySelect useEffect getDocControlCodesOnMount");
        getDocControlCodes();
    }, []);

    async function getDocControlCodes() {
        const { docControlCodes } = await SnacrisApi.getDocControlCodesFromDb();
        setDocControlCodes(docControlCodes);
    }

    function handleMasterChange(evt) {
        const { name, value } = evt.target;

        if (name === "doc_class") {
            setMasterSearchTerms((data) => ({
                ...data,
                doc_class: value,
                doc_type: "doc-type-default", // Reset Doc Type Select
            }));
            setSelectedDocType(null); // Reset selectedDocType
            return;
        }

        if (name === "doc_type") {
            const docTypeOptions = getDocTypeOptions();
            const selectedDoc = docTypeOptions.find((doc) => doc.doc_type === value);
            setSelectedDocType(selectedDoc || null);
        }

        setMasterSearchTerms((data) => ({
            ...data,
            [name]: value,
        }));
    }

    function handlePartyChange(evt) {
        const { name, value } = evt.target;
        setPartySearchTerms((data) => ({
            ...data,
            [name]: value,
        }));
    }

    const getDocTypeOptions = () => {
        switch (masterSearchTerms.doc_class) {
            case "DEEDS AND OTHER CONVEYANCES":
                return docControlCodes.deedsAndOtherConveyances;
            case "MORTGAGES & INSTRUMENTS":
                return docControlCodes.mortgagesAndInstruments;
            case "UCC AND FEDERAL LIENS":
                return docControlCodes.uccAndFederalLiens;
            case "OTHER DOCUMENTS":
                return docControlCodes.otherDocuments;
            default:
                return [];
        }
    };

    const getPartyTypeOptions = () => {
        if (!selectedDocType) {
            return [
                { value: "1", label: "Party 1 (default)" },
                { value: "2", label: "Party 2 (default)" },
                { value: "3", label: "Party 3 (default)" },
            ];
        }
        const partyTypes = [
            { value: "1", label: selectedDocType.party1_type },
            { value: "2", label: selectedDocType.party2_type },
            { value: "3", label: selectedDocType.party3_type },
        ];
        return partyTypes.filter((party) => party.label && party.label !== "null");
    };

    return (
        <div className="mb-1">
            {/* Document Class */}
            <div className="mb-1">
                <div className="d-flex align-items-center justify-content-between">
                    <label htmlFor="doc-class-select" className="form-label fw-bold mb-0">
                        Document Class
                    </label>
                    <Tooltip
                        helperText="Select the broad category of legal document. This determines which specific document types will be available in the next dropdown. Choose from Deeds, Mortgages, UCC Liens, or Other Documents."
                        label="Document Class field information"
                        iconName="icon-information"
                        iconClassName="ms-1"
                        iconSize={20}
                    />
                </div>
                <select
                    className="form-select form-select-md mb-1"
                    id="doc-class-select"
                    name="doc_class"
                    value={masterSearchTerms.doc_class}
                    onChange={handleMasterChange}
                    aria-describedby="doc-class-desc"
                >
                    <option value="all-classes-default">Select Document Class</option>
                    <option value="DEEDS AND OTHER CONVEYANCES">DEEDS AND OTHER CONVEYANCES</option>
                    <option value="MORTGAGES & INSTRUMENTS">MORTGAGES & INSTRUMENTS</option>
                    <option value="UCC AND FEDERAL LIENS">UCC AND FEDERAL LIENS</option>
                    <option value="OTHER DOCUMENTS">OTHER DOCUMENTS</option>
                </select>
                <div id="doc-class-desc" className="form-text visually-hidden">
                    Select the broad category of legal document to determine available document types.
                </div>
            </div>

            {/* Document Type */}
            <div className="mb-1">
                <div className="d-flex align-items-center justify-content-between">
                    <label htmlFor="doc-type-select" className="form-label fw-bold mb-0">
                        Document Type
                    </label>
                    <Tooltip
                        helperText="Select the specific type of document within the chosen class. Options are filtered based on your Document Class selection. Each document type has specific party roles and requirements.  You must select a Document Class before choosing a Document Type."
                        label="Document Type field information"
                        iconName="icon-information"
                        iconClassName="ms-1"
                        iconSize={20}
                    />
                </div>
                <select
                    className={`form-select form-select-md mb-1 ${isDocTypeDisabled ? "disabled-select" : ""}`}
                    id="doc-type-select"
                    name="doc_type"
                    value={masterSearchTerms.doc_type}
                    onChange={handleMasterChange}
                    disabled={isDocTypeDisabled}
                    aria-describedby="doc-type-desc"
                >
                    <option value="doc-type-default">Select Document Type</option>
                    {getDocTypeOptions().map((doc) => (
                        <option key={doc.doc_type} value={doc.doc_type}>
                            {doc.doc_type_description}
                        </option>
                    ))}
                </select>
                <div id="doc-type-desc" className="form-text visually-hidden">
                    Document type options are determined by the selected document class.
                </div>
            </div>

            {/* Party Type */}
            <div className="mb-1">
                <div className="d-flex align-items-center justify-content-between">
                    <label htmlFor="party-type-select" className="form-label fw-bold mb-0">
                        Party Type
                    </label>
                    <Tooltip
                        helperText="Select the role of the party in the document transaction. Party types are specific to the chosen document type (e.g., Grantor/Grantee for deeds, Mortgagor/Mortgagee for mortgages). Generic options show until a document type is selected."
                        label="Party Type field information"
                        iconName="icon-information"
                        iconClassName="ms-1"
                        iconSize={20}
                    />
                </div>
                <select
                    className="form-select form-select-md mb-1"
                    id="party-type-select"
                    name="party_type"
                    value={partySearchTerms.party_type}
                    onChange={handlePartyChange}
                    aria-describedby="party-type-desc"
                >
                    <option value="">Select Party Type</option>
                    {getPartyTypeOptions().map((party) => (
                        <option key={party.value} value={party.value}>
                            {party.label}
                        </option>
                    ))}
                </select>
                <div id="party-type-desc" className="form-text visually-hidden">
                    Party type options are determined by the selected document type.
                </div>
            </div>
        </div>
    );
}

export default DocClassTypePartySelect;
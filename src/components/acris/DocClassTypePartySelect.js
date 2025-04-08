import React, { useState, useEffect } from "react";
import SnacrisApi from "../../api/api";
import "./DocClassTypePartySelect.css"; // Assuming you have a CSS file for styles

function DocClassTypePartySelect({ searchTerms, setSearchTerms }) {
    const [docControlCodes, setDocControlCodes] = useState({
        deedsAndOtherConveyances: [],
        mortgagesAndInstruments: [],
        uccAndFederalLiens: [],
        otherDocuments: [],
    });
    const [selectedDocType, setSelectedDocType] = useState(null);

    // Derived state to manage whether the Doc Type Select is disabled
    const isDocTypeDisabled = searchTerms.doc_class === "all-classes-default";

    // Fetch document control codes when the component mounts
    useEffect(() => {
        console.debug("DocClassTypePartySelect useEffect getDocControlCodesOnMount");
        getDocControlCodes();
    }, []);

    async function getDocControlCodes() {
        const { docControlCodes } = await SnacrisApi.getDocControlCodesFromDb();
        setDocControlCodes(docControlCodes);
    }

    function handleChange(evt) {
        const { name, value } = evt.target;

        // Reset dependent fields when doc_class changes
        if (name === "doc_class") {
            setSearchTerms((data) => ({
                ...data,
                doc_class: value,
                doc_type: "doc-type-default", // Reset Doc Type Select
                party_type: "", // Reset Party Type Select
            }));
            setSelectedDocType(null); // Reset selectedDocType
            return;
        }

        // Handle changes for doc_type to update selectedDocType
        if (name === "doc_type") {
            const docTypeOptions = getDocTypeOptions();
            const selectedDoc = docTypeOptions.find((doc) => doc.doc_type === value);
            setSelectedDocType(selectedDoc || null);
        }

        // Update searchTerms for other fields
        setSearchTerms((data) => ({
            ...data,
            [name]: value,
        }));
    }

    const getDocTypeOptions = () => {
        switch (searchTerms.doc_class) {
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
            // Default options when no doc_type is selected
            return [
                { value: "1", label: "Party 1 (default)" },
                { value: "2", label: "Party 2 (default)" },
                { value: "3", label: "Party 3 (default)" },
            ];
        }
        // Options based on the selected doc_type
        const partyTypes = [
            { value: "1", label: selectedDocType.party1_type },
            { value: "2", label: selectedDocType.party2_type },
            { value: "3", label: selectedDocType.party3_type },
        ];
        return partyTypes.filter((party) => party.label && party.label !== "null");
    };

    return (
        <>
            <h3 className="mb-1 fw-bold">Select Document Class:</h3>
            <select
                className="form-select form-select-lg mb-1"
                name="doc_class"
                value={searchTerms.doc_class}
                onChange={handleChange}
            >
                <option value="all-classes-default">Select Document Class</option>
                <option value="DEEDS AND OTHER CONVEYANCES">DEEDS AND OTHER CONVEYANCES</option>
                <option value="MORTGAGES & INSTRUMENTS">MORTGAGES & INSTRUMENTS</option>
                <option value="UCC AND FEDERAL LIENS">UCC AND FEDERAL LIENS</option>
                <option value="OTHER DOCUMENTS">OTHER DOCUMENTS</option>
            </select>

            <h3 className="mb-1 fw-bold">Select Document Type:</h3>
            <select
                className={`form-select form-select-lg mb-1 ${isDocTypeDisabled ? "disabled-select" : ""}`}
                name="doc_type"
                value={searchTerms.doc_type}
                onChange={handleChange}
                disabled={isDocTypeDisabled} // Disable when Doc Class is in default state
            >
                <option value="doc-type-default">Select Document Type</option>
                {getDocTypeOptions().map((doc) => (
                    <option key={doc.doc_type} value={doc.doc_type}>
                        {doc.doc_type_description}
                    </option>
                ))}
            </select>

            <h3 className="mb-1 fw-bold">Select Party Type:</h3>
            <select
                className="form-select form-select-lg mb-1"
                name="party_type"
                value={searchTerms.party_type}
                onChange={handleChange}
            >
                <option value="">Select Party Type</option>
                {getPartyTypeOptions().map((party) => (
                    <option key={party.value} value={party.value}>
                        {party.label}
                    </option>
                ))}
            </select>
        </>
    );
}

export default DocClassTypePartySelect;
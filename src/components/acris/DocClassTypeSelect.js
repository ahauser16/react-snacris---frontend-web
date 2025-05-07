import React, { useState, useEffect } from "react";
import SnacrisApi from "../../api/api";
import "./DocClassTypeSelect.css";

function DocClassTypeSelect({ masterSearchTerms, setMasterSearchTerms }) {
    const [docControlCodes, setDocControlCodes] = useState({
        deedsAndOtherConveyances: [],
        mortgagesAndInstruments: [],
        uccAndFederalLiens: [],
        otherDocuments: [],
    });
    const [selectedDocType, setSelectedDocType] = useState(null);

    const isDocTypeDisabled = masterSearchTerms.doc_class === "all-classes-default";

    useEffect(() => {
        console.debug("DocClassTypeSelect useEffect getDocControlCodesOnMount");
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

    return (
        <>
            <select
                className="form-select form-select-lg mb-1"
                name="doc_class"
                value={masterSearchTerms.doc_class}
                onChange={handleMasterChange}
            >
                <option value="all-classes-default">Select Document Class</option>
                <option value="DEEDS AND OTHER CONVEYANCES">DEEDS AND OTHER CONVEYANCES</option>
                <option value="MORTGAGES & INSTRUMENTS">MORTGAGES & INSTRUMENTS</option>
                <option value="UCC AND FEDERAL LIENS">UCC AND FEDERAL LIENS</option>
                <option value="OTHER DOCUMENTS">OTHER DOCUMENTS</option>
            </select>
            <select
                className={`form-select form-select-lg mb-1 ${isDocTypeDisabled ? "disabled-select" : ""}`}
                name="doc_type"
                value={masterSearchTerms.doc_type}
                onChange={handleMasterChange}
                disabled={isDocTypeDisabled}
            >
                <option value="doc-type-default">Select Document Type</option>
                {getDocTypeOptions().map((doc) => (
                    <option key={doc.doc_type} value={doc.doc_type}>
                        {doc.doc_type_description}
                    </option>
                ))}
            </select>
        </>
    );
}

export default DocClassTypeSelect;
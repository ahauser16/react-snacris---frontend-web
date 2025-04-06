import React, { useState, useEffect } from "react";
import "./partyNameSearchForm.css";
import SnacrisApi from "../../api/api";

function PartyNameSearchForm({ searchFor }) {
    console.debug("PartyNameSearchForm", "searchFor=", typeof searchFor);

    const [docControlCodes, setDocControlCodes] = useState(null);
    const [deedsAndOtherConveyances, setDeedsAndOtherConveyances] = useState([]);
    const [mortgagesAndInstruments, setMortgagesAndInstruments] = useState([]);
    const [uccAndFederalLiens, setUccAndFederalLiens] = useState([]);
    const [otherDocuments, setOtherDocuments] = useState([]);
    const [selectedDocType, setSelectedDocType] = useState(null);

    const [searchTerms, setSearchTerms] = useState({
        name: "",
        document_date: "", //add input field for this as TODO
        recorded_borough: "", //add input field for this as TODO
        party_type: "",
        doc_type: "",
        doc_class: "",
    });

    const [apiSearchSources, setApiSearchSources] = useState({
        masterDataset: true,
        lotDataset: false,
        partiesDataset: true,
        referencesDataset: false,
        remarksDataset: false,
    });

    const handleCheckboxChange = (datasetKey) => (event) => {
        setApiSearchSources((prev) => ({
          ...prev,
          [datasetKey]: event.target.checked,
        }));
      };

    useEffect(() => {
        console.debug("PartyNameSearchForm useEffect getDocControlCodesOnMount");
        getDocControlCodes();
    }, []);

    async function getDocControlCodes() {
        let docControlCodes = await SnacrisApi.getDocControlCodes();
        setDocControlCodes(docControlCodes);
    }

    useEffect(() => {
        if (docControlCodes && Array.isArray(docControlCodes.docControlCodes)) {
            setDeedsAndOtherConveyances(
                docControlCodes.docControlCodes.filter(
                    (docControlCode) => docControlCode.class_code_description === "DEEDS AND OTHER CONVEYANCES"
                )
            );
            setMortgagesAndInstruments(
                docControlCodes.docControlCodes.filter(
                    (docControlCode) => docControlCode.class_code_description === "MORTGAGES & INSTRUMENTS"
                )
            );
            setUccAndFederalLiens(
                docControlCodes.docControlCodes.filter(
                    (docControlCode) => docControlCode.class_code_description === "UCC AND FEDERAL LIENS"
                )
            );
            setOtherDocuments(
                docControlCodes.docControlCodes.filter(
                    (docControlCode) => docControlCode.class_code_description === "OTHER DOCUMENTS"
                )
            );
        }
    }, [docControlCodes]);

    function handleSubmit(evt) {
        evt.preventDefault();
        console.debug("PartyNameSearchForm: handleSubmit called with:", searchTerms, apiSearchSources);
        searchFor(searchTerms, apiSearchSources);
    }

    function handleChange(evt) {
        const { name, value } = evt.target;
        setSearchTerms((data) => ({
            ...data,
            [name]: value,
        }));

        // Handle changes for doc_type to update selectedDocType
        if (name === "doc_type") {
            const docTypeOptions = getDocTypeOptions();
            const selectedDoc = docTypeOptions.find((doc) => doc.doc_type === value);
            setSelectedDocType(selectedDoc || null);
        }
    }

    const getDocTypeOptions = () => {
        switch (searchTerms.doc_class) {
            case "DEEDS AND OTHER CONVEYANCES":
                return deedsAndOtherConveyances;
            case "MORTGAGES & INSTRUMENTS":
                return mortgagesAndInstruments;
            case "UCC AND FEDERAL LIENS":
                return uccAndFederalLiens;
            case "OTHER DOCUMENTS":
                return otherDocuments;
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
        <div className="PartyNameSearchForm mb-4">
            <form onSubmit={handleSubmit}>
                <div className="row justify-content-center justify-content-lg-start gx-4 gy-4">
                    <fieldset className="col-6 justify-content-start text-start">
                        <h3 className="mb-1 fw-bold">Name:</h3>
                        <input
                            className="form-control form-control-lg mb-4"
                            name="name"
                            placeholder="e.g. John Doe"
                            value={searchTerms.name}
                            onChange={handleChange}
                        />

                        <h3 className="mb-1 fw-bold">Select Document Class:</h3>
                        <select
                            className="form-select form-select-lg mb-1"
                            name="doc_class"
                            value={searchTerms.doc_class}
                            onChange={handleChange}
                        >
                            <option value="">Select Document Class</option>
                            <option value="DEEDS AND OTHER CONVEYANCES">DEEDS AND OTHER CONVEYANCES</option>
                            <option value="MORTGAGES & INSTRUMENTS">MORTGAGES & INSTRUMENTS</option>
                            <option value="UCC AND FEDERAL LIENS">UCC AND FEDERAL LIENS</option>
                            <option value="OTHER DOCUMENTS">OTHER DOCUMENTS</option>
                        </select>

                        <h3 className="mb-1 fw-bold">Select Document Type:</h3>
                        <select
                            className="form-select form-select-lg mb-1"
                            name="doc_type"
                            value={searchTerms.doc_type}
                            onChange={handleChange}
                        >
                            <option value="">Select Document Type</option>
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
                    </fieldset>
                    <fieldset className="col-6">
                        <h3 className="mb-1 fw-bold">Select Datasets:</h3>
                        <div className="form-check d-flex align-items-center me-3">
                            <input
                                type="checkbox"
                                id="master-record-checkbox"
                                className="form-check-input me-2"
                                checked={apiSearchSources.masterDataset}
                                onChange={handleCheckboxChange("masterDataset")}
                            />
                            <label htmlFor="master-record-checkbox" className="form-check-label">
                                Master Record
                            </label>
                        </div>
                        <div className="form-check d-flex align-items-center me-3">
                            <input
                                type="checkbox"
                                id="lot-record-checkbox"
                                className="form-check-input me-2"
                                checked={apiSearchSources.lotDataset}
                                onChange={handleCheckboxChange("lotDataset")}
                            />
                            <label htmlFor="lot-record-checkbox" className="form-check-label">
                                Lot Record
                            </label>
                        </div>
                        <div className="form-check d-flex align-items-center me-3">
                            <input
                                type="checkbox"
                                id="parties-record-checkbox"
                                className="form-check-input me-2"
                                checked={apiSearchSources.partiesDataset}
                                onChange={handleCheckboxChange("partiesDataset")}
                            />
                            <label htmlFor="parties-record-checkbox" className="form-check-label">
                                Parties Record
                            </label>
                        </div>
                        <div className="form-check d-flex align-items-center me-3">
                            <input
                                type="checkbox"
                                id="references-record-checkbox"
                                className="form-check-input me-2"
                                checked={apiSearchSources.referencesDataset}
                                onChange={handleCheckboxChange("referencesDataset")}
                            />
                            <label htmlFor="references-record-checkbox" className="form-check-label">
                                References Record
                            </label>
                        </div>
                        <div className="form-check d-flex align-items-center me-3">
                            <input
                                type="checkbox"
                                id="remarks-record-checkbox"
                                className="form-check-input me-2"
                                checked={apiSearchSources.remarksDataset}
                                onChange={handleCheckboxChange("remarksDataset")}
                            />
                            <label htmlFor="remarks-record-checkbox" className="form-check-label">
                                Remarks Record
                            </label>
                        </div>
                    </fieldset>
                    <button type="submit" className="btn btn-lg btn-primary mx-auto">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}

export default PartyNameSearchForm;
import React, { useState } from "react";
import "./partyNameSearchForm.css";
import DocClassTypePartySelect from "../../components/acris/DocClassTypePartySelect";

function PartyNameSearchForm({ searchFor }) {
    console.debug("PartyNameSearchForm", "searchFor=", typeof searchFor);

    const [searchTerms, setSearchTerms] = useState({
        name: "",
        document_date: "", //add input field for this as TODO
        recorded_borough: "", //add input field for this as TODO
        party_type: "",
        doc_type: "doc-type-default",
        doc_class: "all-classes-default",
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
    }

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

                        <DocClassTypePartySelect
                            searchTerms={searchTerms}
                            setSearchTerms={setSearchTerms}
                        />
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

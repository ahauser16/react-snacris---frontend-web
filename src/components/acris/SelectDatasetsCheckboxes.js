import React from "react";

function SelectDatasetsCheckboxes({ apiSearchSources, handleCheckboxChange }) {
    return (
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
    );
}

export default SelectDatasetsCheckboxes;
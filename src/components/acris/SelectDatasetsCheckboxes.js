import React from "react";

function SelectDatasetsCheckboxes({ primaryApiSources, secondaryApiSources, handleCheckboxChange, disabledDatasets }) {
  return (
    <fieldset className="col-6">
      <h3 className="mb-1 fw-bold">Select Datasets:</h3>
      <div className="form-check d-flex align-items-center me-3">
        <input
          type="checkbox"
          id="master-record-checkbox"
          className="form-check-input me-2"
          checked={primaryApiSources.masterDataset}
          disabled={disabledDatasets.masterDataset}
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
          checked={primaryApiSources.lotDataset}
          disabled={disabledDatasets.lotDataset}
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
          checked={primaryApiSources.partiesDataset}
          disabled={disabledDatasets.partiesDataset}
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
          checked={secondaryApiSources.referencesDataset}
          onChange={handleCheckboxChange("referencesDataset")}
          disabled={disabledDatasets.referencesDataset}
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
          checked={secondaryApiSources.remarksDataset}
          onChange={handleCheckboxChange("remarksDataset")}
          disabled={disabledDatasets.remarksDataset}
        />
        <label htmlFor="remarks-record-checkbox" className="form-check-label">
          Remarks Record
        </label>
      </div>
    </fieldset>
  );
}

export default SelectDatasetsCheckboxes;
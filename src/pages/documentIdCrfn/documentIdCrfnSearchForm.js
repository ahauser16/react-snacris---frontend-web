import React, { useState } from "react";
import "./documentIdCrfnSearchForm.css";

function DocumentIdCrfnSearchForm({ searchFor }) {
  console.debug("DocumentIdCrfnSearchForm", "searchFor=", typeof searchFor);

  const [searchTerms, setSearchTerms] = useState({
    document_id: "",
    crfn: "",
  });

  const [apiSearchSources, setApiSearchSources] = useState({
    masterDataset: true,
    lotDataset: false,
    partiesDataset: false,
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
    console.debug("DocumentIdCrfnSearchForm: handleSubmit called with:", searchTerms, apiSearchSources);
    const { document_id, crfn } = searchTerms;

    // Determine which group of data to submit
    if (document_id) {
      searchFor({ document_id }, apiSearchSources);
    } else if (crfn) {
      searchFor({ crfn }, apiSearchSources);
    } else {
      console.error("Please fill out either the Document ID or CRFN field.");
    }
  }

  function handleChange(evt) {
    const { name, value } = evt.target;
    setSearchTerms((data) => ({
      ...data,
      [name]: value,
    }));
  }

  return (
    <div className="DocumentIdCrfnSearchForm mb-4">
      <form onSubmit={handleSubmit}>
        <div className="row justify-content-center justify-content-lg-start gx-4 gy-4">
          <fieldset className="col-6 justify-content-start text-start">
            <div className="d-flex justify-content-start text-start">
              <p>Please fill in only one number (Document ID Number or CityRegister File Number "CRFN")</p>
            </div>
            <h3 className="mb-1 fw-bold">Document ID Number:</h3>
            <input
              className="form-control form-control-lg mb-4"
              name="document_id"
              placeholder="Enter as YYYYMMDDNNNNNSSS"
              value={searchTerms.document_id}
              onChange={handleChange}
            />
            <h3 className="mb-1 fw-bold">City Register File Number:</h3>
            <input
              className="form-control form-control-lg mb-4"
              name="crfn"
              placeholder="Enter as YYYYNNNNNNNNN"
              value={searchTerms.crfn}
              onChange={handleChange}
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

export default DocumentIdCrfnSearchForm;
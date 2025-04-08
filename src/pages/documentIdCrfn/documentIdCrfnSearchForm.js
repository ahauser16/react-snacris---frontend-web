import React, { useState } from "react";
import "./documentIdCrfnSearchForm.css";
import SelectDatasetsCheckboxes from "../../components/acris/SelectDatasetsCheckboxes";

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
          <SelectDatasetsCheckboxes
            apiSearchSources={apiSearchSources}
            handleCheckboxChange={handleCheckboxChange}
          />
          <button type="submit" className="btn btn-lg btn-primary mx-auto">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default DocumentIdCrfnSearchForm;
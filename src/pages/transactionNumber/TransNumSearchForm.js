import React, { useState } from "react";


const TransNumSearchForm = ({ searchFor }) => {
  console.debug("TransNumSearchForm", "searchFor=", typeof searchFor);

  const [masterSearchTerms, setMasterSearchTerms] = useState({
    transaction_number: "",
  });

  function handleSubmit(evt) {
    evt.preventDefault();
    console.debug(
      "TransNumSearchForm: handleSubmit called with:",
      masterSearchTerms
    );
    searchFor(masterSearchTerms);
  }

  function handleMasterChange(evt) {
    const { name, value } = evt.target;
    setMasterSearchTerms((data) => ({
      ...data,
      [name]: value,
    }));
  }

  return (
    <div className="TransNumSearchForm">
      <form onSubmit={handleSubmit}>
        <fieldset className="text-start">
          <div className="mb-3">
            <label htmlFor="transaction_number" className="form-label fw-bold">
              Transaction Number
            </label>
            <input
              type="text"
              className="form-control"
              id="transaction_number"
              name="transaction_number"
              value={masterSearchTerms.transaction_number}
              onChange={handleMasterChange}
              placeholder="Enter as YYYYMMDDNNNNN"
            />
          </div>
        </fieldset>
        <button type="submit" className="btn btn-lg btn-primary mx-auto">
          Submit
        </button>
      </form>
    </div>
  );
};

export default TransNumSearchForm;
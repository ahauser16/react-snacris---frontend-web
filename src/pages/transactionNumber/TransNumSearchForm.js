import React, { useState } from "react";
import Alert from "../../common/Alert";

const TransNumSearchForm = ({ searchFor }) => {
  console.debug("TransNumSearchForm", "searchFor=", typeof searchFor);

  const [masterSearchTerms, setMasterSearchTerms] = useState({
    transaction_number: "",
  });
  const [formErrors, setFormErrors] = useState([]);

  function handleSubmit(evt) {
    evt.preventDefault();
    if (!masterSearchTerms.transaction_number.trim()) {
      setFormErrors(["Transaction Number is required."]);
      return;
    }
    setFormErrors([]);
    searchFor(masterSearchTerms);
  }

  function handleMasterChange(evt) {
    const { name, value } = evt.target;
    setMasterSearchTerms((data) => ({
      ...data,
      [name]: value,
    }));
    setFormErrors([]); // clear errors on change
  }

  return (
    <div className="TransNumSearchForm">
      <form onSubmit={handleSubmit}>
        {formErrors.length > 0 && (
          <Alert type="danger" messages={formErrors} />
        )}
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
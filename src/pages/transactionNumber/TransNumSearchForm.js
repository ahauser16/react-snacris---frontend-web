import React, { useState } from "react";
import Alert from "../../common/Alert";
import TransNumberInput from "../../components/acris/masterForms/TransNumberInput";

const TransNumSearchForm = ({ searchFor }) => {
  console.debug("TransNumSearchForm", "searchFor=", typeof searchFor);

  const [masterSearchTerms, setMasterSearchTerms] = useState({
    transaction_number: "",
  });
  const [formErrors, setFormErrors] = useState([]);
  const [alert, setAlert] = useState({ type: "", messages: [] });

  async function handleSubmit(evt) {
    evt.preventDefault();
    if (!masterSearchTerms.transaction_number.trim()) {
      setFormErrors(["Transaction Number is required."]);
      return;
    }
    setFormErrors([]);
    setAlert({ type: "", messages: [] });
    await searchFor(masterSearchTerms, setAlert);
  }

  function handleMasterChange(evt) {
    const { name, value } = evt.target;
    setMasterSearchTerms((data) => ({
      ...data,
      [name]: value,
    }));
    setFormErrors([]); // clear errors on change
    setAlert({ type: "", messages: [] });
  }

  return (
    <div className="TransNumSearchForm">
      <form onSubmit={handleSubmit}>
        {formErrors.length > 0 && <Alert type="danger" messages={formErrors} />}
        {alert.messages.length > 0 && (
          <Alert type={alert.type} messages={alert.messages} />
        )}
        <fieldset className="text-start p-2 mb-1 bg-blue-transparent">
          <TransNumberInput
            value={masterSearchTerms.transaction_number}
            onChange={handleMasterChange}
          />
        </fieldset>
        <button type="submit" className="btn btn-lg btn-primary mx-auto">
          Submit
        </button>
      </form>
    </div>
  );
};

export default TransNumSearchForm;

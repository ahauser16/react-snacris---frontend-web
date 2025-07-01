import React, { useState } from "react";
import Alert from "../../common/Alert";
import ReelPageWrapperBoroughSelect from "./ReelPageWrapperBoroughSelect";
import ReelYearInput from "../../components/acris/masterForms/ReelYearInput";
import ReelNumInput from "../../components/acris/masterForms/ReelNumInput";
import ReelPageNumInput from "../../components/acris/masterForms/ReelPageNumInput";

function ReelPageSearchForm({ searchFor, setAlert }) {
  const [masterSearchTerms, setMasterSearchTerms] = useState({
    reel_yr: "",
    reel_nbr: "",
    reel_pg: "",
  });

  const [legalsSearchTerms, setLegalsSearchTerms] = useState({
    borough: "",
  });

  const [formErrors, setFormErrors] = useState([]);

  function handleMasterChange(evt) {
    const { name, value } = evt.target;
    setMasterSearchTerms((data) => ({
      ...data,
      [name]: value,
    }));
    setFormErrors([]); // clear errors on change
    setAlert({ type: "", messages: [] });
  }

  function handleLegalsChange(evt) {
    const { name, value } = evt.target;
    setLegalsSearchTerms((data) => ({
      ...data,
      [name]: value,
    }));
    setFormErrors([]); // clear errors on change
    setAlert({ type: "", messages: [] });
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    const errors = [];
    if (!masterSearchTerms.reel_yr.trim())
      errors.push("Reel Year is required.");
    if (!masterSearchTerms.reel_nbr.trim())
      errors.push("Reel Number is required.");
    if (!masterSearchTerms.reel_pg.trim())
      errors.push("Page Number is required.");
    if (!legalsSearchTerms.borough.trim()) errors.push("Borough is required.");
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors([]);
    setAlert({ type: "", messages: [] }); // clear alerts before search
    await searchFor(masterSearchTerms, legalsSearchTerms);
  }

  return (
    <div className="ReelPageSearchForm">
      <form onSubmit={handleSubmit}>
        {formErrors.length > 0 && <Alert type="danger" messages={formErrors} />}
        <fieldset className="text-start p-2 mb-1 bg-blue-transparent">
          <ReelYearInput
            value={masterSearchTerms.reel_yr}
            onChange={handleMasterChange}
          />
          <ReelNumInput
            value={masterSearchTerms.reel_nbr}
            onChange={handleMasterChange}
          />
          <ReelPageNumInput
            value={masterSearchTerms.reel_pg}
            onChange={handleMasterChange}
          />
          <ReelPageWrapperBoroughSelect
            legalsSearchTerms={legalsSearchTerms}
            handleLegalsChange={handleLegalsChange}
          />
        </fieldset>
        <button type="submit" className="btn btn-lg btn-primary mx-auto">
          Submit
        </button>
      </form>
    </div>
  );
}

export default ReelPageSearchForm;

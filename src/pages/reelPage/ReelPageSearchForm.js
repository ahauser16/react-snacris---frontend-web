import React, { useState } from "react";
import Alert from "../../common/Alert";
import ReelPageWrapperBoroughSelect from "./ReelPageWrapperBoroughSelect";

function ReelPageSearchForm({ searchFor }) {
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
    }

    function handleLegalsChange(evt) {
        const { name, value } = evt.target;
        setLegalsSearchTerms((data) => ({
            ...data,
            [name]: value,
        }));
        setFormErrors([]); // clear errors on change
    }

    function handleSubmit(evt) {
        evt.preventDefault();
        const errors = [];
        if (!masterSearchTerms.reel_yr.trim()) errors.push("Reel Year is required.");
        if (!masterSearchTerms.reel_nbr.trim()) errors.push("Reel Number is required.");
        if (!masterSearchTerms.reel_pg.trim()) errors.push("Page Number is required.");
        if (!legalsSearchTerms.borough.trim()) errors.push("Borough is required.");
        if (errors.length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors([]);
        searchFor(masterSearchTerms, legalsSearchTerms);
    }

    return (
        <div className="ReelPageSearchForm">
            <form onSubmit={handleSubmit}>
                {formErrors.length > 0 && (
                    <Alert type="danger" messages={formErrors} />
                )}
                <fieldset className="text-start">
                    <div className="mb-3">
                        <label htmlFor="reel_yr" className="form-label fw-bold">
                            Reel Year
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="reel_yr"
                            name="reel_yr"
                            value={masterSearchTerms.reel_yr}
                            onChange={handleMasterChange}
                            placeholder="e.g. 2005"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="reel_nbr" className="form-label fw-bold">
                            Reel Number
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="reel_nbr"
                            name="reel_nbr"
                            value={masterSearchTerms.reel_nbr}
                            onChange={handleMasterChange}
                            placeholder="e.g. 12345"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="reel_pg" className="form-label fw-bold">
                            Page Number
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="reel_pg"
                            name="reel_pg"
                            value={masterSearchTerms.reel_pg}
                            onChange={handleMasterChange}
                            placeholder="e.g. 67"
                        />
                    </div>
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
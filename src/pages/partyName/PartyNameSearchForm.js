import React, { useState } from "react";
import "./partyNameSearchForm.css";
import DocClassTypePartySelect from "../../components/acris/DocClassTypePartySelect";
import SelectDatasetsCheckboxes from "../../components/acris/SelectDatasetsCheckboxes";

function PartyNameSearchForm({ searchFor }) {
    console.debug("PartyNameSearchForm", "searchFor=", typeof searchFor);

    const [masterSearchTerms, setMasterSearchTerms] = useState({
        document_date_range: "to-current-date-default",
        document_date_start: "start-date-default",
        document_date_end: "end-date-default",
        doc_type: "doc-type-default",
        doc_class: "all-classes-default",
    });

    const [partySearchTerms, setPartySearchTerms] = useState({
        name: "name-default",
        party_type: "all-party-types-default",
    });

    const [legalsSearchTerms, setLegalsSearchTerms] = useState({
        borough: "all-boroughs-default",
    });

    const [remarkSearchTerms] = useState({});
    const [referenceSearchTerms] = useState({});

    const [primaryApiSources] = useState({
        masterDataset: true,
        partiesDataset: true,
        lotDataset: true,
    });

    const [secondaryApiSources, setSecondaryApiSources] = useState({
        referencesDataset: false,
        remarksDataset: false,
    });

    const handleCheckboxChange = (datasetKey) => (event) => {
        setSecondaryApiSources((prev) => ({
            ...prev,
            [datasetKey]: event.target.checked,
        }));
    };

    function handleSubmit(evt) {
        evt.preventDefault();
        console.debug(
            "PartyNameSearchForm: handleSubmit called with:",
            masterSearchTerms,
            partySearchTerms,
            legalsSearchTerms,
            remarkSearchTerms,
            referenceSearchTerms,
            primaryApiSources,
            secondaryApiSources
        );
        searchFor(
            masterSearchTerms,
            partySearchTerms,
            legalsSearchTerms,
            remarkSearchTerms,
            referenceSearchTerms,
            primaryApiSources,
            secondaryApiSources
        );
    }

    function handleMasterChange(evt) {
        const { name, value } = evt.target;

        if (name === "document_date_range") {
            if (value === "custom-date-range") {
                setMasterSearchTerms((data) => ({
                    ...data,
                    document_date_range: value,
                    document_date_start: "",
                    document_date_end: "",
                }));
            } else {
                const dateRange = getPredefinedDateRange(value);
                setMasterSearchTerms((data) => ({
                    ...data,
                    document_date_range: value,
                    document_date_start: dateRange.start,
                    document_date_end: dateRange.end,
                }));
            }
        } else {
            setMasterSearchTerms((data) => ({
                ...data,
                [name]: value,
            }));
        }
    }

    function handlePartyChange(evt) {
        const { name, value } = evt.target;
        setPartySearchTerms((data) => ({
            ...data,
            [name]: value,
        }));
    }

    function handleLotChange(evt) {
        const { name, value } = evt.target;
        setLegalsSearchTerms((data) => ({
            ...data,
            [name]: value,
        }));
    }

    function calculateDateRange(days) {
        const currentDate = new Date();
        const startDate = new Date();
        startDate.setDate(currentDate.getDate() - days);
        return {
            start: startDate.toISOString().split("T")[0],
            end: currentDate.toISOString().split("T")[0],
        };
    }

    function getPredefinedDateRange(option) {
        switch (option) {
            case "last-7-days":
                return calculateDateRange(7);
            case "last-30-days":
                return calculateDateRange(30);
            case "last-90-days":
                return calculateDateRange(90);
            case "last-1-year":
                return calculateDateRange(365);
            case "last-2-years":
                return calculateDateRange(365 * 2);
            case "last-5-years":
                return calculateDateRange(365 * 5);
            default:
                return { start: "", end: "" };
        }
    }

    const disabledDatasets = {
        masterDataset: true,
        lotDataset: true,
        partiesDataset: true,
        referencesDataset: false,
        remarksDataset: false,
    };

    return (
        <div className="PartyNameSearchForm mb-4">
            <form onSubmit={handleSubmit}>
                <div className="row justify-content-center justify-content-lg-start gx-4 gy-4">
                    <fieldset className="col-6 justify-content-start text-start">
                        <h3 className="mb-1 fw-bold">Name:</h3>
                        <input
                            className="form-control form-control-lg mb-1"
                            name="name"
                            placeholder="e.g. John Doe"
                            value={partySearchTerms.name}
                            onChange={handlePartyChange}
                        />

                        <h3 className="mb-1 fw-bold">Document Date Range:</h3>
                        <select
                            className="form-select form-select-lg mb-1"
                            name="document_date_range"
                            value={masterSearchTerms.document_date_range}
                            onChange={handleMasterChange}
                        >
                            <option value="to-current-date-default">To Current Date</option>
                            <option value="last-7-days">Last 7 Days</option>
                            <option value="last-30-days">Last 30 Days</option>
                            <option value="last-90-days">Last 90 Days</option>
                            <option value="last-1-year">Last 1 Year</option>
                            <option value="last-2-years">Last 2 Years</option>
                            <option value="last-5-years">Last 5 Years</option>
                            <option value="custom-date-range">Choose Custom Date Range</option>
                        </select>

                        {masterSearchTerms.document_date_range === "custom-date-range" && (
                            <div className="mt-3">
                                <label htmlFor="document_date_start" className="form-label">
                                    Start Date:
                                </label>
                                <input
                                    type="date"
                                    id="document_date_start"
                                    name="document_date_start"
                                    className="form-control mb-3"
                                    value={masterSearchTerms.document_date_start}
                                    onChange={handleMasterChange}
                                />
                                <label htmlFor="document_date_end" className="form-label">
                                    End Date:
                                </label>
                                <input
                                    type="date"
                                    id="document_date_end"
                                    name="document_date_end"
                                    className="form-control"
                                    value={masterSearchTerms.document_date_end}
                                    onChange={handleMasterChange}
                                />
                            </div>
                        )}

                        <DocClassTypePartySelect
                            masterSearchTerms={masterSearchTerms}
                            setMasterSearchTerms={setMasterSearchTerms}
                            partySearchTerms={partySearchTerms}
                            setPartySearchTerms={setPartySearchTerms}
                        />
                        <h3 className="mb-1 fw-bold">Select Borough</h3>
                        <select
                            className="form-select form-select-lg mb-1"
                            name="borough"
                            value={legalsSearchTerms.borough}
                            onChange={handleLotChange}
                        >
                            <option value="all-boroughs-default">Select Borough</option>
                            <option value="1">Manhattan</option>
                            <option value="2">Bronx</option>
                            <option value="3">Brooklyn</option>
                            <option value="4">Queens</option>
                            <option value="5">Staten Island</option>
                        </select>
                    </fieldset>
                    <SelectDatasetsCheckboxes
                        primaryApiSources={primaryApiSources}
                        secondaryApiSources={secondaryApiSources}
                        handleCheckboxChange={handleCheckboxChange}
                        disabledDatasets={disabledDatasets}
                    />
                    <button type="submit" className="btn btn-lg btn-primary mx-auto">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}

export default PartyNameSearchForm;
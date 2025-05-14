import React from "react";

// this component should be adapted to be used for any date range selection.  I realized ACRIS searches for documents by the date of recording (`recorded_datetime`) and not the date of the document (`document_date`).  There is also a queryable field called `modified_date` which represents the date a document was modified which I don't fully understand yet.  Also, each API endpoint has a `good_through_date` which I also don't fully understand yet.  These fields are all associated with the Real Property Master API dataset.  The Real Property Legals, Parties, Remarks and References only have a `good_through_date` field that can use this component.  The Personal Property Master endpoint has the same `recorded_datetime`, `modified_date`, `fedtax_assessment_date` and `good_through_date` fields as the Real Property Master endpoint.  Keep in mind the Personal Property Master endpoint does NOT have a `document_date` field.

function DocumentDateRange({ masterSearchTerms, setMasterSearchTerms }) {
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

    function handleDateRangeChange(evt) {
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

    return (
        <div>
            <select
                className="form-select form-select-lg mb-1"
                name="document_date_range"
                value={masterSearchTerms.document_date_range}
                onChange={handleDateRangeChange}
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
                        onChange={handleDateRangeChange}
                    />
                    <label htmlFor="document_date_end" className="form-label">
                        End Date:
                    </label>
                    <input 
                        type="date"
                        id="document_date_end"
                        name="document_date_end"
                        className="form-control mb-1"
                        value={masterSearchTerms.document_date_end}
                        onChange={handleDateRangeChange}
                    />
                </div>
            )}
        </div>
    );
}

export default DocumentDateRange;
// DocumentDateRangeWrapper.js
import React from "react";
import DateRange from "./DateRange";

const DocumentDateRangeWrapper = ({ masterSearchTerms, setMasterSearchTerms }) => {
  const config = {
    label: "Document Date",
    helperText: "Select the date range for when documents were originally created or executed. This may differ from the recording date. Choose predefined ranges or set a custom date range for specific periods."
  };

  return (
    <DateRange
      dateRange={masterSearchTerms}
      setDateRange={setMasterSearchTerms}
      rangeName="document_date"
      label={config.label}
      helperText={config.helperText}
      id="document-date-range"
    />
  );
};

export default DocumentDateRangeWrapper;
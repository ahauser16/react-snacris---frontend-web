import React from "react";
import DateRange from "./DateRange";

const RecordedDateRangeWrapper = ({ masterSearchTerms, setMasterSearchTerms }) => {
  const config = {
    label: "Recording Date",
    helperText: "Select the date range for when documents were recorded with the city. 'To Current Date' includes all documents from 1901 to present. Use predefined ranges for recent documents or choose custom range for specific periods."
  };

  return (
    <DateRange
      dateRange={masterSearchTerms}
      setDateRange={setMasterSearchTerms}
      rangeName="recorded_date"
      label={config.label}
      helperText={config.helperText}
      id="recorded-date-range"
    />
  );
};

export default RecordedDateRangeWrapper;
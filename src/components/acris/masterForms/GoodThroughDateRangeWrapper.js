import React from "react";
import DateRange from "./DateRange";

const GoodThroughDateRangeWrapper = ({ masterSearchTerms, setMasterSearchTerms }) => {
  const config = {
    label: "Good Through Date",
    helperText: "Select the date range for when documents or filings are valid through. This applies to time-sensitive documents with expiration dates. Choose appropriate ranges to find active or expired documents."
  };

  return (
    <DateRange
      dateRange={masterSearchTerms}
      setDateRange={setMasterSearchTerms}
      rangeName="good_through_date"
      label={config.label}
      helperText={config.helperText}
      id="good-through-date-range"
    />
  );
};

export default GoodThroughDateRangeWrapper;
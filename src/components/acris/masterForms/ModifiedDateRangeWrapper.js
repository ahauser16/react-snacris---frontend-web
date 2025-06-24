import React from "react";
import DateRange from "./DateRange";

const ModifiedDateRangeWrapper = ({ masterSearchTerms, setMasterSearchTerms }) => {
  const config = {
    label: "Date Modified",
    helperText: "Select the date range for when document records were last modified in the system. Use this to find recently updated entries or track changes within specific time periods."
  };

  return (
    <DateRange
      dateRange={masterSearchTerms}
      setDateRange={setMasterSearchTerms}
      rangeName="modified_date"
      label={config.label}
      helperText={config.helperText}
      id="modified-date-range"
    />
  );
};

export default ModifiedDateRangeWrapper;
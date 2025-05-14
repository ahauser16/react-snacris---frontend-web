import React from "react";
import DateRange from "./DateRange";

const DocumentDateRangeWrapper = ({ masterSearchTerms, setMasterSearchTerms }) => {
  return (
    <DateRange
      dateRange={masterSearchTerms}
      setDateRange={setMasterSearchTerms}
      rangeName="document_date"
    />
  );
};

export default DocumentDateRangeWrapper;
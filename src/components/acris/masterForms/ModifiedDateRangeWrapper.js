import React from "react";
import DateRange from "./DateRange";

const ModifiedDateRangeWrapper = ({ masterSearchTerms, setMasterSearchTerms }) => {
  return (
    <DateRange
      dateRange={masterSearchTerms}
      setDateRange={setMasterSearchTerms}
      rangeName="modified_date"
    />
  );
};

export default ModifiedDateRangeWrapper;
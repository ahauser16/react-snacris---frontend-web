import React from "react";
import DateRange from "./DateRange";

const RecordedDateRangeWrapper = ({ masterSearchTerms, setMasterSearchTerms }) => {
  return (
    <DateRange
      dateRange={masterSearchTerms}
      setDateRange={setMasterSearchTerms}
      rangeName="recorded_date"
    />
  );
};

export default RecordedDateRangeWrapper;
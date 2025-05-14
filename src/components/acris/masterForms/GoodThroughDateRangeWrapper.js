import React from "react";
import DateRange from "./DateRange";

const GoodThroughDateRangeWrapper = ({ masterSearchTerms, setMasterSearchTerms }) => {
  return (
    <DateRange
      dateRange={masterSearchTerms}
      setDateRange={setMasterSearchTerms}
      rangeName="good_through_date"
    />
  );
};

export default GoodThroughDateRangeWrapper;
import React from "react";
import BoroughSelect from "../../components/acris/legalsForms/BoroughSelect";

const ReelPageWrapperBoroughSelect = ({
  legalsSearchTerms = { borough: "" },
  handleLegalsChange,
}) => {
  return (
    <BoroughSelect
      value={legalsSearchTerms.borough}
      onChange={handleLegalsChange}
    />
  );
};

export default ReelPageWrapperBoroughSelect;

import React from "react";
import BoroughSelect from "../../components/acris/legalsForms/BoroughSelect";

const UccFedLienWrapperBoroughSelect = ({ legalsSearchTerms, handleLegalsChange }) => {
  return (
    <BoroughSelect
      value={legalsSearchTerms.borough}
      onChange={handleLegalsChange}
    />
  );
};

export default UccFedLienWrapperBoroughSelect;
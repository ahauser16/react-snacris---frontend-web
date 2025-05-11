import React from "react";
import BoroughSelect from "../../components/acris/legalsForms/BoroughSelect";

const PartyNameWrapperBoroughSelect = ({ legalsSearchTerms, handleLegalsChange }) => {
  return (
    <BoroughSelect
      value={legalsSearchTerms.borough}
      onChange={handleLegalsChange}
    />
  );
};

export default PartyNameWrapperBoroughSelect;
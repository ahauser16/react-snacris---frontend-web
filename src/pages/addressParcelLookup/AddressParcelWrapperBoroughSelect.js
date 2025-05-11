import React from "react";
import BoroughSelect from "../../components/acris/legalsForms/BoroughSelect";

const AddressParcelWrapperBoroughSelect = ({ value, onChange }) => {
  return <BoroughSelect value={value} onChange={onChange} />;
};

export default AddressParcelWrapperBoroughSelect;
import React from "react";
import BoroughSelect from "../../components/acris/legalsForms/BoroughSelect";

const AddressParcelWrapperBoroughSelect = ({ value, onChange, id }) => {
  return (
    <BoroughSelect
      value={value}
      onChange={onChange}
      id={id}
      label="Borough"
    />
  );
};

export default AddressParcelWrapperBoroughSelect;
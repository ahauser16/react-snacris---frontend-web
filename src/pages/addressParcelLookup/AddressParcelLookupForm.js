import React, { useState } from "react";
import Alert from "../../common/Alert";
import "./addressParcelLookupForm.css";
// import BoroughSelect from "../../components/acris/legalsForms/BoroughSelect";
import AddressParcelWrapperBoroughSelect from "./AddressParcelWrapperBoroughSelect";
import StreetNumber from "../../components/acris/legalsForms/StreetNumber";
import StreetName from "../../components/acris/legalsForms/StreetName";
import Unit from "../../components/acris/legalsForms/Unit";
import TaxBlock from "../../components/acris/legalsForms/TaxBlock";
import TaxLot from "../../components/acris/legalsForms/TaxLot";

function AddressParcelLookupForm({ searchFor }) {
  console.debug("AddressParcelLookupForm", "searchFor=", typeof searchFor);

  const [addressFields, setAddressFields] = useState({
    borough: "",
    street_number: "",
    street_name: "",
    unit: "",
  });

  const [bblFields, setBblFields] = useState({
    borough: "",
    block: "",
    lot: "",
  });

  const [formErrors, setFormErrors] = useState([]);
  const [alert, setAlert] = useState({ type: "", messages: [] });

  async function handleSubmit(evt) {
    evt.preventDefault();
    console.debug("AddressParcelLookupForm-handleSubmit called with:", {
      addressFields,
      bblFields,
    });

    // Check if all required fields in the address fieldset are filled
    const isAddressFilled =
      addressFields.borough && addressFields.street_number && addressFields.street_name;

    // Check if all required fields in the BBL fieldset are filled
    const isBblFilled =
      bblFields.borough && bblFields.block && bblFields.lot;

    // Check if any fields in the address fieldset are filled
    const isAddressPartiallyFilled = Object.values(addressFields).some(
      (value) => value
    );

    // Check if any fields in the BBL fieldset are filled
    const isBblPartiallyFilled = Object.values(bblFields).some(
      (value) => value
    );

    // Ensure only one fieldset is fully filled and the other is completely empty
    if ((isAddressFilled && isBblPartiallyFilled) || (isBblFilled && isAddressPartiallyFilled)) {
      setFormErrors([
        "Submit the form with either Property Address or Property Borough, Block & Lot but not both.",
      ]);
      return;
    }

    if (isAddressFilled) {
      const legalsSearchTerms = {
        borough: addressFields.borough,
        street_number: addressFields.street_number,
        street_name: addressFields.street_name,
        unit: addressFields.unit || "",
        block: "",
        lot: "",
      };
      await searchFor(legalsSearchTerms, setAlert);
      setFormErrors([]);
    } else if (isBblFilled) {
      const legalsSearchTerms = {
        borough: bblFields.borough,
        street_number: "",
        street_name: "",
        unit: "",
        block: bblFields.block,
        lot: bblFields.lot,
      };
      await searchFor(legalsSearchTerms, setAlert);
      setFormErrors([]);
    } else {
      setFormErrors([
        "Please fill out either the Property Address or Property Borough, Block & Lot fields.",
      ]);
    }
  }

  function handleAddressChange(evt) {
    const { name, value } = evt.target;
    setAddressFields((data) => ({
      ...data,
      [name]: value,
    }));
    setFormErrors([]);
    setAlert({ type: "", messages: [] });
  }

  function handleBblChange(evt) {
    const { name, value } = evt.target;
    setBblFields((data) => ({
      ...data,
      [name]: value,
    }));
    setFormErrors([]);
    setAlert({ type: "", messages: [] });
  }

  return (
    <div className="AddressParcelLookupForm mb-2">
      <form onSubmit={handleSubmit}>
        <div className="row justify-content-center justify-content-lg-start gx-4 gy-4">
          {formErrors.length > 0 && (
            <Alert type="danger" messages={formErrors} />
          )}
          <fieldset className="col-6 justify-content-start text-start property-address">
            <h3 className="mb-2 fw-bold">Property Address</h3>
            <AddressParcelWrapperBoroughSelect
              value={addressFields.borough}
              onChange={handleAddressChange}
            />
            <StreetNumber
              value={addressFields.street_number}
              onChange={handleAddressChange}
            />
            <StreetName
              value={addressFields.street_name}
              onChange={handleAddressChange}
            />
            <Unit
              value={addressFields.unit}
              onChange={handleAddressChange}
            />
          </fieldset>
          <fieldset className="col-6 justify-content-start text-start property-bbl">
            <h3 className="mb-2 fw-bold">Property Borough, Block & Lot</h3>
            <AddressParcelWrapperBoroughSelect
              value={bblFields.borough}
              onChange={handleBblChange}
            />
            <TaxBlock value={bblFields.block} onChange={handleBblChange} />
            <TaxLot value={bblFields.lot} onChange={handleBblChange} />
          </fieldset>
          <button type="submit" className="btn btn-lg btn-primary mx-auto">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddressParcelLookupForm;
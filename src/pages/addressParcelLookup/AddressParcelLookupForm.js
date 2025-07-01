import React, { useState } from "react";
import Alert from "../../common/Alert";
import "./addressParcelLookupForm.css";
import AddressParcelWrapperBoroughSelect from "./AddressParcelWrapperBoroughSelect";
import StreetNumber from "../../components/acris/legalsForms/StreetNumber";
import StreetName from "../../components/acris/legalsForms/StreetName";
import Unit from "../../components/acris/legalsForms/Unit";
import TaxBlock from "../../components/acris/legalsForms/TaxBlock";
import TaxLot from "../../components/acris/legalsForms/TaxLot";

function AddressParcelLookupForm({ searchFor, setAlert }) {
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

  async function handleSubmit(evt) {
    evt.preventDefault();
    console.debug("AddressParcelLookupForm-handleSubmit called with:", {
      addressFields,
      bblFields,
    });

    // Check if all required fields in the address fieldset are filled
    const isAddressFilled =
      addressFields.borough &&
      addressFields.street_number &&
      addressFields.street_name;

    // Check if all required fields in the BBL fieldset are filled
    const isBblFilled = bblFields.borough && bblFields.block && bblFields.lot;

    // Check if any fields in the address fieldset are filled
    const isAddressPartiallyFilled = Object.values(addressFields).some(
      (value) => value
    );

    // Check if any fields in the BBL fieldset are filled
    const isBblPartiallyFilled = Object.values(bblFields).some(
      (value) => value
    );

    // Ensure only one fieldset is fully filled and the other is completely empty
    if (
      (isAddressFilled && isBblPartiallyFilled) ||
      (isBblFilled && isAddressPartiallyFilled)
    ) {
      setFormErrors([
        "Submit the form with either Property Address or Property Borough, Block & Lot but not both.",
      ]);
      return;
    }

    setFormErrors([]);
    setAlert({ type: "", messages: [] }); // clear alerts before search

    if (isAddressFilled) {
      const legalsSearchTerms = {
        borough: addressFields.borough,
        street_number: addressFields.street_number,
        street_name: addressFields.street_name,
        unit: addressFields.unit || "",
        block: "",
        lot: "",
      };
      await searchFor(legalsSearchTerms);
    } else if (isBblFilled) {
      const legalsSearchTerms = {
        borough: bblFields.borough,
        street_number: "",
        street_name: "",
        unit: "",
        block: bblFields.block,
        lot: bblFields.lot,
      };
      await searchFor(legalsSearchTerms);
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
    <div className="AddressParcelLookupForm">
      <form onSubmit={handleSubmit}>
        {formErrors.length > 0 && <Alert type="danger" messages={formErrors} />}
        <fieldset className="text-start p-2 mb-1 bg-blue-transparent">
          <h4 className="mb-1 fw-bold">Address</h4>
          <AddressParcelWrapperBoroughSelect
            value={addressFields.borough}
            onChange={handleAddressChange}
            id="address-borough"
          />
          <StreetNumber
            value={addressFields.street_number}
            onChange={handleAddressChange}
            id="address-street-number"
          />
          <StreetName
            value={addressFields.street_name}
            onChange={handleAddressChange}
            id="address-street-name"
            required={true}
          />
          <Unit
            value={addressFields.unit}
            onChange={handleAddressChange}
            id="address-unit"
            label="Unit"
            description="coop only (optional)"
          />
        </fieldset>
        <fieldset className="text-start bg-blue-transparent p-2">
          <h4 className="mb-1 fw-bold">Borough, Block & Lot</h4>
          <AddressParcelWrapperBoroughSelect
            value={bblFields.borough}
            onChange={handleBblChange}
            id="bbl-borough"
          />
          <TaxBlock
            value={bblFields.block}
            onChange={handleBblChange}
            id="bbl-block"
          />
          <TaxLot
            value={bblFields.lot}
            onChange={handleBblChange}
            id="bbl-lot"
          />
        </fieldset>
        <button
          type="submit"
          className="btn btn-lg btn-primary mt-3 w-100 w-lg-auto"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default AddressParcelLookupForm;

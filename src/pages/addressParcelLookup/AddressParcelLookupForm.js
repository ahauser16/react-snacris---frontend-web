import React, { useState } from "react";
import Alert from "../../common/Alert";
import "./addressParcelLookupForm.css";
import BoroughSelect from "../../components/acris/legalsForms/BoroughSelect";
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

  function handleSubmit(evt) {
    evt.preventDefault();
    console.debug("AddressParcelLookupForm: handleSubmit called with:", {
      addressFields,
      bblFields,
    });

    // Check if any fields in addressFields are filled
    const isAddressFilled =
      addressFields.borough || addressFields.street_number || addressFields.street_name;

    // Check if any fields in bblFields are filled
    const isBblFilled = bblFields.borough || bblFields.block || bblFields.lot;

    // Check if both fieldsets have any fields filled
    if (isAddressFilled && isBblFilled) {
      setFormErrors(["Submit the form with either Property Address or Property Borough, Block & Lot but not both."]);
      return;
    }

    // Check if addressFields are fully filled
    if (addressFields.borough && addressFields.street_number && addressFields.street_name) {
      const legalsSearchTerms = {
        borough: addressFields.borough,
        street_number: addressFields.street_number,
        street_name: addressFields.street_name,
        unit: addressFields.unit || "",
        block: "",
        lot: "",
      };
      searchFor(legalsSearchTerms);
      setFormErrors([]); // Clear errors on successful submission
    } else if (bblFields.borough && bblFields.block && bblFields.lot) {
      const legalsSearchTerms = {
        borough: bblFields.borough,
        street_number: "",
        street_name: "",
        unit: "",
        block: bblFields.block,
        lot: bblFields.lot,
      };
      searchFor(legalsSearchTerms);
      setFormErrors([]); // Clear errors on successful submission
    } else {
      setFormErrors(["Please fill out either the Property Address or Property Borough, Block & Lot fields."]);
    }
  }

  function handleAddressChange(evt) {
    const { name, value } = evt.target;
    setAddressFields((data) => ({
      ...data,
      [name]: value,
    }));

    // Clear errors when the user modifies the form
    setFormErrors([]);
  }

  function handleBblChange(evt) {
    const { name, value } = evt.target;
    setBblFields((data) => ({
      ...data,
      [name]: value,
    }));

    // Clear errors when the user modifies the form
    setFormErrors([]);
  }

  return (
    <div className="AddressParcelLookupForm mb-4">
      <form onSubmit={handleSubmit}>
        <div className="row justify-content-center justify-content-lg-start gx-4 gy-4">
          {formErrors.length ? <Alert type="danger" messages={formErrors} /> : null}
          <fieldset className="col-6 justify-content-start text-start property-address">
            <h3 className="mb-1 fw-bold">Property Address:</h3>
            <div className="d-flex justify-content-start text-start">
              <p>If you know the property address, complete the fields below and press "Find BBL" to find the Borough/Block/Lot of the property. Address fields indicated by an asterisk (*) are required. If an address is found, the fields in the Property Borough/Block/Lot section will be populated.</p>
            </div>

            <BoroughSelect value={addressFields.borough} onChange={handleAddressChange} />
            <StreetNumber value={addressFields.street_number} onChange={handleAddressChange} />
            <StreetName value={addressFields.street_name} onChange={handleAddressChange} />
            <Unit value={addressFields.unit} onChange={handleAddressChange} />
          </fieldset>
          <fieldset className="col-6 justify-content-start text-start property-bbl">
            <h3 className="mb-1 fw-bold">Property Borough, Block & Lot:</h3>
            <p>If you know the Borough, Block and Lot of the property, complete the fields below and press the "Find Address" button to find the address of the property. Fields indicated by an asterisk (*) are required. If the BBL is found, the fields in the Property Address section will be populated.</p>
            <BoroughSelect value={bblFields.borough} onChange={handleBblChange} />
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
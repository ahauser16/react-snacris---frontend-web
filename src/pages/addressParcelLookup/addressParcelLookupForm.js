import React, { useState } from "react";
import "./addressParcelLookupForm.css";

function AddressParcelLookupForm({ searchFor }) {
  console.debug("AddressParcelLookupForm", "searchFor=", typeof searchFor);

  const [searchTerms, setSearchTerms] = useState({
    borough: "",
    street_number: "",
    street_name: "",
    unit: "",
    block: "",
    lot: "",
  });

  function handleSubmit(evt) {
    evt.preventDefault();
    console.debug("AddressParcelLookupForm: handleSubmit called with:", searchTerms);
    const { borough, street_number, street_name, unit, block, lot } = searchTerms;

    // Determine which group of data to submit
    if (borough && street_number && street_name) {
      searchFor({ borough, street_number, street_name, unit: unit || undefined });
    } else if (borough && block && lot) {
      searchFor({ borough, block, lot });
    } else {
      console.error("Please fill out either the address or BBL fields.");
    }
  }

  function handleChange(evt) {
    const { name, value } = evt.target;
    setSearchTerms((data) => ({
      ...data,
      [name]: value,
    }));
  }

  return (
    <div className="AddressParcelLookupForm mb-4">
      <form onSubmit={handleSubmit}>
        <div className="row justify-content-center justify-content-lg-start gx-4 gy-4">
          <fieldset className="col-6 justify-content-start text-start">
            <h3 className="mb-1 fw-bold">Property Address:</h3>
            <div className="d-flex justify-content-start text-start">
              <p>If you know the property address, complete the fields below and press "Find BBL" to find the Borough/Block/Lot of the property. Address fields indicated by an asterisk (*) are required. If an address is found, the fields in the Property Borough/Block/Lot section will be populated.</p>
            </div>

            <select
              className="form-select form-select-lg mb-1"
              name="borough"
              value={searchTerms.borough}
              onChange={handleChange}
            >
              <option value="">Select Borough</option>
              <option value="1">Manhattan</option>
              <option value="2">Bronx</option>
              <option value="3">Brooklyn</option>
              <option value="4">Queens</option>
              <option value="5">Staten Island</option>
            </select>
            <input
              className="form-control form-control-lg mb-1"
              name="street_number"
              placeholder="Enter Street Number"
              value={searchTerms.street_number}
              onChange={handleChange}
            />
            <input
              className="form-control form-control-lg mb-1"
              name="street_name"
              placeholder="Enter Street Name"
              value={searchTerms.street_name}
              onChange={handleChange}
            />
            <input
              className="form-control form-control-lg"
              name="unit"
              placeholder="Enter Unit"
              value={searchTerms.unit}
              onChange={handleChange}
            />
          </fieldset>
          <fieldset className="col-6">
            <h3 className="mb-1 fw-bold">Property Borough, Block & Lot:</h3>
            <p>If you know the Borough, Block and Lot of the property, complete the fields below and press the "Find Address" button to find the address of the property. Fields indicated by an asterisk (*) are required. If the BBL is found, the fields in the Property Address section will be populated.</p>

            <select
              className="form-select form-select-lg mb-1"
              name="borough"
              value={searchTerms.borough}
              onChange={handleChange}
            >
              <option value="">Select Borough...</option>
              <option value="1">Manhattan</option>
              <option value="2">Bronx</option>
              <option value="3">Brooklyn</option>
              <option value="4">Queens</option>
              <option value="5">Staten Island</option>
            </select>
            <input
              className="form-control form-control-lg mb-1"
              name="block"
              placeholder="Enter Block"
              value={searchTerms.block}
              onChange={handleChange}
            />
            <input
              className="form-control form-control-lg"
              name="lot"
              placeholder="Enter Lot"
              value={searchTerms.lot}
              onChange={handleChange}
            />
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

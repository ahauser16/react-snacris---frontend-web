# AddressParcelLookup & Related Component Notes

## Table of Contents

- [AddressParcelLookup \& Related Component Notes](#addressparcellookup--related-component-notes)
  - [Table of Contents](#table-of-contents)
  - [Planned Improvements/To Dos](#planned-improvementsto-dos)
    - [`AddressParcelLookup.js`](#addressparcellookupjs)
      - [Issues](#issues)
      - [Refactor Plan](#refactor-plan)
    - [`AddressParcelLookupForm.js`](#addressparcellookupformjs)
      - [Issues](#issues-1)
      - [Refactor Plan](#refactor-plan-1)
    - [`SnacrisApi`](#snacrisapi)
      - [Issues](#issues-2)
      - [Refactor](#refactor)
    - [Navigation.js](#navigationjs)
      - [Issues](#issues-3)
      - [Refactor Plan](#refactor-plan-2)
    - [AddressParcelLookup, BoroughSelect and architecture](#addressparcellookup-boroughselect-and-architecture)
      - [Prompt:](#prompt)
      - [Response:](#response)
      - [my prompt response 1 - refactor plan for creating \& implementing wrappers](#my-prompt-response-1---refactor-plan-for-creating--implementing-wrappers)
      - [ChatGPT response 1 - refactor plan for creating \& implementing wrappers](#chatgpt-response-1---refactor-plan-for-creating--implementing-wrappers)

## Planned Improvements/To Dos

### `AddressParcelLookup.js`

#### Issues

- The `search` function name is generic and could be more descriptive.  I will rename this to "searchRealPropertyLegals" since it identifies the name of the ACRIS API that is being queried by my server.
- The `results` state is directly accessed to render the first result, which assumes the API always returns a non-empty array.  Add a check to handle cases where `results` is empty or null.
- The `AddressParcelCard` is tightly coupled to the first result, which could lead to issues if the API response changes.  I will address this issue on the back end.  I would prefer to display the result or an error message as communicated by my server which is making the GET request to the 3rd party API on behalf of this front end form submission.

[Back to TOC]((#table-of-contents))

#### Refactor Plan

- [ ] Rename search to handleSearch for clarity.
- [ ] Add a check to handle cases where results is empty or null.
- [ ] Pass the entire results array to AddressParcelCard for better flexibility.

### `AddressParcelLookupForm.js`

#### Issues
- The `searchFor` prop name is inconsistent with the `handleSearch` function in the parent component.
- The `handleSubmit` function has redundant checks for `addressFields` and `bblFields`.
- The `formErrors` state is cleared in multiple places, which could be centralized.

#### Refactor Plan
- [ ] Rename `searchFor` to `onSearch` for consistency.
- [ ] Simplify the `handleSubmit` logic.
- [ ] Centralize error clearing logic.

[Back to TOC]((#table-of-contents))

### `SnacrisApi`

#### Issues
- The `queryAcrisAddressParcel` method name is verbose.
- The `request` method could benefit from better error handling.

#### Refactor
- Rename `queryAcrisAddressParcel` to `fetchAddressParcel`.
- Add a default error message in the request method.

[Back to TOC]((#table-of-contents))

### Navigation.js

#### Issues
- The route paths are verbose and inconsistent in naming conventions.
- The RoutesList component could benefit from a centralized route configuration.

#### Refactor Plan
- Use a centralized route configuration object for better maintainability.
```js
const routes = [
  { path: "/address-lookup", element: <AddressParcelLookup /> },
  { path: "/party-name", element: <PartyNameSearch /> },
  { path: "/parcel-identifier", element: <ParcelIdentifierSearch /> },
  { path: "/document-type", element: <DocumentTypeSearch /> },
  { path: "/document-id-crfn", element: <DocumentIdCrfnSearch /> },
  { path: "/transaction-number", element: <TransactionNumberSearch /> },
  { path: "/reel-page", element: <ReelPageSearch /> },
  { path: "/ucc-lien", element: <UccFedLienFileNumberSearch /> },
  { path: "/profile", element: <ProfileForm /> },
];

function RoutesList({ login, signup, currentUser }) {
  return (
    <div className="pt-5">
      <Routes>
        {!currentUser ? (
          <>
            <Route path="/login" element={<LoginForm login={login} />} />
            <Route path="/signup" element={<SignupForm signup={signup} />} />
          </>
        ) : (
          routes.map(({ path, element }) => <Route key={path} path={path} element={element} />)
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default RoutesList;
```

[Back to TOC]((#table-of-contents))

### AddressParcelLookup, BoroughSelect and architecture

#### Prompt: 

@workspace I recently refactored my `PartyNameSearchForm` code below to work with my `BoroughSelect` component in terms of handling its state using the `legalsSearchTerms` and `handleLegalsChange` props.  This is the pattern that I want to keep going forward.  However, my other component `AddressParcelLookupForm` used the `BoroughSelect` component differently instead of using the props: `legalsSearchTerms` and `handleLegalsChange` it relied on the `value` and `onChange` props and passed `bblFields.borough` and `handleBblChange` to one implementation of the `BoroughSelect` component and `addressFields.borough` and `handleAddressChange` to the second implementation, respectively.  This was necessary for the `AddressParcelLookupForm` to have two `fieldset` groups with one `submit` button.  The desired behavior was to allow the user to fill out one `fieldset` input fields but not the other and then submit the form.  When attempting to submit the form after filling out a fieldset's input fields if any of the input fields were filled out from the other fieldset then I wanted an error message to appear and prevent the form from being submitted.  Currently, the `PartyNameSearchForm` and `BoroughSelect` components work together but the `AddressParcelLookupForm` and `BoroughSelect` components do not.  I'm at a "crossroads" where I want to make the correct architectural design choice to refactor the code below  to implement the `BoroughSelect` code as a reuseable component.  In addition to refactoring the `BoroughSelect` component I need to refactor my `PartyNameSearchForm` and `AddressParcelLookupForm` so they can implement the `BoroughSelect` component in their own ways.  I need you to review my code below and given the aforementioned behavior explain my options for refactoring the code so that it adheres to best practices of creating and implementing reuseable components while adhering to the aforementioned behavior and maintaining its expected functionality.

```js
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
    if (
      (isAddressFilled && isBblPartiallyFilled) ||
      (isBblFilled && isAddressPartiallyFilled)
    ) {
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
            <BoroughSelect
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
            <BoroughSelect
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
```

```js
import React, { useState } from "react";
import "./partyNameSearchForm.css";
import DocClassTypePartySelect from "../../components/acris/DocClassTypePartySelect";
import DocumentDateRange from "../../components/acris/DocumentDateRange";
import BoroughSelect from "../../components/acris/legalsForms/BoroughSelect";

function PartyNameSearchForm({ searchFor }) {
  console.debug("PartyNameSearchForm", "searchFor=", typeof searchFor);

  const [masterSearchTerms, setMasterSearchTerms] = useState({
    document_date_range: "to-current-date-default",
    document_date_start: "start-date-default",
    document_date_end: "end-date-default",
    doc_type: "doc-type-default",
    doc_class: "all-classes-default",
  });

  const [partySearchTerms, setPartySearchTerms] = useState({
    name: "name-default",
    party_type: "all-party-types-default",
  });

  const [legalsSearchTerms, setLegalsSearchTerms] = useState({
    borough: "all-boroughs-default",
  });

  function handleSubmit(evt) {
    evt.preventDefault();
    console.debug(
      "PartyNameSearchForm: handleSubmit called with:",
      masterSearchTerms,
      partySearchTerms,
      legalsSearchTerms
    );
    searchFor(
      masterSearchTerms,
      partySearchTerms,
      legalsSearchTerms
    );
  }

  function handleMasterChange(evt) {
    const { name, value } = evt.target;
    setMasterSearchTerms((data) => ({
      ...data,
      [name]: value,
    }));
  }

  function handlePartyChange(evt) {
    const { name, value } = evt.target;
    setPartySearchTerms((data) => ({
      ...data,
      [name]: value,
    }));
  }

  function handleLegalsChange(evt) {
    const { name, value } = evt.target;
    setLegalsSearchTerms((data) => ({
      ...data,
      [name]: value,
    }));
  }

  return (
    <div className="PartyNameSearchForm mb-4">
      <form onSubmit={handleSubmit}>
        <div className="row justify-content-center justify-content-lg-start gx-4 gy-4">
          <fieldset className="col-6 justify-content-start text-start">
            <h3 className="mb-1 fw-bold">Name:</h3>
            <input
              className="form-control form-control-lg mb-1"
              name="name"
              placeholder="e.g. John Doe"
              value={partySearchTerms.name}
              onChange={handlePartyChange}
            />
            <DocumentDateRange
              masterSearchTerms={masterSearchTerms}
              setMasterSearchTerms={setMasterSearchTerms}
            />
            <DocClassTypePartySelect
              masterSearchTerms={masterSearchTerms}
              setMasterSearchTerms={setMasterSearchTerms}
              partySearchTerms={partySearchTerms}
              setPartySearchTerms={setPartySearchTerms}
            />
            <BoroughSelect
              legalsSearchTerms={legalsSearchTerms}
              handleLegalsChange={handleLegalsChange}
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

export default PartyNameSearchForm;
```

```js
import React from "react";

const BoroughSelect = ({ legalsSearchTerms, handleLegalsChange }) => {
  return (
    <>
      <select
        className="form-select form-select-lg mb-1"
        name="borough"
        value={legalsSearchTerms.borough}
        onChange={handleLegalsChange}
      >
        <option value="">Select Borough</option>
        <option value="1">Manhattan</option>
        <option value="2">Bronx</option>
        <option value="3">Brooklyn</option>
        <option value="4">Queens</option>
        <option value="5">Staten Island</option>
      </select>
    </>
  );
};

export default BoroughSelect;
```

[Back to TOC]((#table-of-contents))


#### Response: 

To refactor the BoroughSelect component and its usage in both PartyNameSearchForm and AddressParcelLookupForm while adhering to best practices for reusable components, you have two main options. Each option has its pros and cons, and the choice depends on your architectural goals and the level of flexibility you want.

Option 1: Make BoroughSelect a Fully Flexible Component
Refactor BoroughSelect to accept generic value and onChange props instead of tying it to specific state structures like legalsSearchTerms. This approach makes the component reusable in any context.

**Refactored BoroughSelect**

```js
import React from "react";

const BoroughSelect = ({ value, onChange, name = "borough" }) => {
  return (
    <select
      className="form-select form-select-lg mb-1"
      name={name}
      value={value}
      onChange={onChange}
    >
      <option value="">Select Borough</option>
      <option value="1">Manhattan</option>
      <option value="2">Bronx</option>
      <option value="3">Brooklyn</option>
      <option value="4">Queens</option>
      <option value="5">Staten Island</option>
    </select>
  );
};

export default BoroughSelect;
```

**Updated AddressParcelLookupForm**

```js
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

  function handleAddressChange(evt) {
    const { name, value } = evt.target;
    setAddressFields((data) => ({
      ...data,
      [name]: value,
    }));
    setFormErrors([]);
  }

  function handleBblChange(evt) {
    const { name, value } = evt.target;
    setBblFields((data) => ({
      ...data,
      [name]: value,
    }));
    setFormErrors([]);
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    const isAddressFilled =
      addressFields.borough && addressFields.street_number && addressFields.street_name;
    const isBblFilled = bblFields.borough && bblFields.block && bblFields.lot;

    if (isAddressFilled && isBblFilled) {
      setFormErrors(["Submit the form with either Property Address or Property Borough, Block & Lot but not both."]);
      return;
    }

    if (isAddressFilled) {
      await searchFor({
        borough: addressFields.borough,
        street_number: addressFields.street_number,
        street_name: addressFields.street_name,
        unit: addressFields.unit || "",
        block: "",
        lot: "",
      });
    } else if (isBblFilled) {
      await searchFor({
        borough: bblFields.borough,
        block: bblFields.block,
        lot: bblFields.lot,
        street_number: "",
        street_name: "",
        unit: "",
      });
    } else {
      setFormErrors(["Please fill out either the Property Address or Property Borough, Block & Lot fields."]);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {formErrors.length > 0 && <Alert type="danger" messages={formErrors} />}
      <fieldset>
        <h3>Property Address</h3>
        <BoroughSelect value={addressFields.borough} onChange={handleAddressChange} />
        <StreetNumber value={addressFields.street_number} onChange={handleAddressChange} />
        <StreetName value={addressFields.street_name} onChange={handleAddressChange} />
        <Unit value={addressFields.unit} onChange={handleAddressChange} />
      </fieldset>
      <fieldset>
        <h3>Property Borough, Block & Lot</h3>
        <BoroughSelect value={bblFields.borough} onChange={handleBblChange} />
        <TaxBlock value={bblFields.block} onChange={handleBblChange} />
        <TaxLot value={bblFields.lot} onChange={handleBblChange} />
      </fieldset>
      <button type="submit">Submit</button>
    </form>
  );
}

export default AddressParcelLookupForm;
```

**Updated PartyNameSearchForm**

```js
import React, { useState } from "react";
import BoroughSelect from "../../components/acris/legalsForms/BoroughSelect";

function PartyNameSearchForm({ searchFor }) {
  const [legalsSearchTerms, setLegalsSearchTerms] = useState({
    borough: "",
  });

  function handleLegalsChange(evt) {
    const { name, value } = evt.target;
    setLegalsSearchTerms((data) => ({
      ...data,
      [name]: value,
    }));
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    searchFor(legalsSearchTerms);
  }

  return (
    <form onSubmit={handleSubmit}>
      <BoroughSelect value={legalsSearchTerms.borough} onChange={handleLegalsChange} />
      <button type="submit">Submit</button>
    </form>
  );
}

export default PartyNameSearchForm;
```

Option 2: Create a Wrapper Component for BoroughSelect
Instead of modifying BoroughSelect, create a wrapper component for each use case (AddressBoroughSelect and PartyBoroughSelect). These wrapper components handle the specific state and logic for their respective forms.

**Wrapper for AddressParcelLookupForm**

```js
import React from "react";
import BoroughSelect from "./BoroughSelect";

const AddressBoroughSelect = ({ value, onChange }) => {
  return <BoroughSelect value={value} onChange={onChange} />;
};

export default AddressBoroughSelect;
```

**Wrapper for PartyNameSearchForm**

```js
import React from "react";
import BoroughSelect from "./BoroughSelect";

const PartyBoroughSelect = ({ legalsSearchTerms, handleLegalsChange }) => {
  return <BoroughSelect value={legalsSearchTerms.borough} onChange={handleLegalsChange} />;
};

export default PartyBoroughSelect;
```

**Recommendation**
- Option 1 is better if you want a single, flexible BoroughSelect component that can be reused in any context.
- Option 2 is better if you want to keep the BoroughSelect component simple and delegate context-specific logic to wrapper components.

Both approaches adhere to best practices for reusable components and maintain the expected functionality.

[Back to TOC]((#table-of-contents))


#### my prompt response 1 - refactor plan for creating & implementing wrappers

@workspace I think I would prefer to choose the first option of making `BoroughSelect` a fully flexible component for the following reasons.  For context, I am currently implementing `BoroughSelect` in forms where data is being sent to my server which uses that data to make GET requests to a third party API called "Real Property Legals" that has a column named "borough".  This is why I want both the `PartyNameSearchForm` and `AddressParcelLookupForm` to include the value of `borough` in a state variable called "legalsSearchTerms" which is passed to the `searchFor` function which sends the data to my server.  I intentionally named the variable "legalsSearchTerms" so that when my server receives it it knows it's associated with the "Real Property Legals" API and dataset.  There is another API called "Real Property Master" which has a column named "recorded_borough" associated with its endpoint which I could reuse the `BoroughSelect` component in a new form eventually since its values are the same.  If I were to create wrappers for the `BoroughSelect` component how would I refactor my `PartyNameSearchForm` and `AddressParcelLookupForm` components to maintain their current implementation of the `BoroughSelect` component and what would each wrapper look like?  Keep in mind that the `AddressParcelLookupForm` uses the `BoroughSelect` component twice due to the two fieldset's and associated form submission logic.  What code could be included in the wrapper functions that could be considered a best practice or improvement besides handling the state management of the `BoroughSelect` component?

```js
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
    if (
      (isAddressFilled && isBblPartiallyFilled) ||
      (isBblFilled && isAddressPartiallyFilled)
    ) {
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
            <BoroughSelect
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
            <BoroughSelect
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
```

```js
import React, { useState } from "react";
import "./partyNameSearchForm.css";
import DocClassTypePartySelect from "../../components/acris/DocClassTypePartySelect";
import DocumentDateRange from "../../components/acris/DocumentDateRange";
import BoroughSelect from "../../components/acris/legalsForms/BoroughSelect";

function PartyNameSearchForm({ searchFor }) {
  console.debug("PartyNameSearchForm", "searchFor=", typeof searchFor);

  const [masterSearchTerms, setMasterSearchTerms] = useState({
    document_date_range: "to-current-date-default",
    document_date_start: "start-date-default",
    document_date_end: "end-date-default",
    doc_type: "doc-type-default",
    doc_class: "all-classes-default",
  });

  const [partySearchTerms, setPartySearchTerms] = useState({
    name: "name-default",
    party_type: "all-party-types-default",
  });

  const [legalsSearchTerms, setLegalsSearchTerms] = useState({
    borough: "all-boroughs-default",
  });

  function handleSubmit(evt) {
    evt.preventDefault();
    console.debug(
      "PartyNameSearchForm: handleSubmit called with:",
      masterSearchTerms,
      partySearchTerms,
      legalsSearchTerms
    );
    searchFor(
      masterSearchTerms,
      partySearchTerms,
      legalsSearchTerms
    );
  }

  function handleMasterChange(evt) {
    const { name, value } = evt.target;
    setMasterSearchTerms((data) => ({
      ...data,
      [name]: value,
    }));
  }

  function handlePartyChange(evt) {
    const { name, value } = evt.target;
    setPartySearchTerms((data) => ({
      ...data,
      [name]: value,
    }));
  }

  function handleLegalsChange(evt) {
    const { name, value } = evt.target;
    setLegalsSearchTerms((data) => ({
      ...data,
      [name]: value,
    }));
  }

  return (
    <div className="PartyNameSearchForm mb-4">
      <form onSubmit={handleSubmit}>
        <div className="row justify-content-center justify-content-lg-start gx-4 gy-4">
          <fieldset className="col-6 justify-content-start text-start">
            <h3 className="mb-1 fw-bold">Name:</h3>
            <input
              className="form-control form-control-lg mb-1"
              name="name"
              placeholder="e.g. John Doe"
              value={partySearchTerms.name}
              onChange={handlePartyChange}
            />
            <DocumentDateRange
              masterSearchTerms={masterSearchTerms}
              setMasterSearchTerms={setMasterSearchTerms}
            />
            <DocClassTypePartySelect
              masterSearchTerms={masterSearchTerms}
              setMasterSearchTerms={setMasterSearchTerms}
              partySearchTerms={partySearchTerms}
              setPartySearchTerms={setPartySearchTerms}
            />
            <BoroughSelect
              legalsSearchTerms={legalsSearchTerms}
              handleLegalsChange={handleLegalsChange}
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

export default PartyNameSearchForm;
```

```js
import React from "react";

const BoroughSelect = ({ legalsSearchTerms, handleLegalsChange }) => {
  return (
    <>
      <select
        className="form-select form-select-lg mb-1"
        name="borough"
        value={legalsSearchTerms.borough}
        onChange={handleLegalsChange}
      >
        <option value="">Select Borough</option>
        <option value="1">Manhattan</option>
        <option value="2">Bronx</option>
        <option value="3">Brooklyn</option>
        <option value="4">Queens</option>
        <option value="5">Staten Island</option>
      </select>
    </>
  );
};

export default BoroughSelect;
```

[Back to TOC]((#table-of-contents))

#### ChatGPT response 1 - refactor plan for creating & implementing wrappers

If you prefer to make BoroughSelect a fully flexible component, you can still create wrapper components for specific use cases to encapsulate additional logic or provide default props. This approach allows you to maintain the flexibility of BoroughSelect while simplifying its usage in forms like PartyNameSearchForm and AddressParcelLookupForm.

Here’s how you can refactor your code to include wrapper components for BoroughSelect while maintaining its current implementation in both forms:

**Refactored BoroughSelect**

Keep `BoroughSelect` as a fully flexible component that accepts `value`, `onChange`, and an optional `name` prop.

```js
import React from "react";

const BoroughSelect = ({ value, onChange, name = "borough" }) => {
  return (
    <select
      className="form-select form-select-lg mb-1"
      name={name}
      value={value}
      onChange={onChange}
    >
      <option value="">Select Borough</option>
      <option value="1">Manhattan</option>
      <option value="2">Bronx</option>
      <option value="3">Brooklyn</option>
      <option value="4">Queens</option>
      <option value="5">Staten Island</option>
    </select>
  );
};

export default BoroughSelect;
```

**Wrapper for PartyNameSearchForm**

Create a wrapper component for `PartyNameSearchForm` that handles the `legalsSearchTerms` state and passes it to `BoroughSelect`.

```js
import React from "react";
import BoroughSelect from "./BoroughSelect";

const PartyBoroughSelect = ({ legalsSearchTerms, handleLegalsChange }) => {
  return (
    <BoroughSelect
      value={legalsSearchTerms.borough}
      onChange={handleLegalsChange}
    />
  );
};

export default PartyBoroughSelect;
```

**Updated PartyNameSearchForm**

Use the `PartyBoroughSelect` wrapper in the form.

```js
import React, { useState } from "react";
import PartyBoroughSelect from "../../components/acris/legalsForms/PartyBoroughSelect";

function PartyNameSearchForm({ searchFor }) {
  const [legalsSearchTerms, setLegalsSearchTerms] = useState({
    borough: "",
  });

  function handleLegalsChange(evt) {
    const { name, value } = evt.target;
    setLegalsSearchTerms((data) => ({
      ...data,
      [name]: value,
    }));
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    searchFor(legalsSearchTerms);
  }

  return (
    <form onSubmit={handleSubmit}>
      <PartyBoroughSelect
        legalsSearchTerms={legalsSearchTerms}
        handleLegalsChange={handleLegalsChange}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

export default PartyNameSearchForm;
```

**Wrapper for AddressParcelLookupForm**

Create a wrapper component for `AddressParcelLookupForm` that handles the `borough` state for each fieldset.

```js
import React from "react";
import BoroughSelect from "./BoroughSelect";

const AddressBoroughSelect = ({ value, onChange }) => {
  return <BoroughSelect value={value} onChange={onChange} />;
};

export default AddressBoroughSelect;
```

**Updated AddressParcelLookupForm**

Use the `AddressBoroughSelect` wrapper for both fieldsets.

```js
import React, { useState } from "react";
import AddressBoroughSelect from "../../components/acris/legalsForms/AddressBoroughSelect";

function AddressParcelLookupForm({ searchFor }) {
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

  function handleAddressChange(evt) {
    const { name, value } = evt.target;
    setAddressFields((data) => ({
      ...data,
      [name]: value,
    }));
  }

  function handleBblChange(evt) {
    const { name, value } = evt.target;
    setBblFields((data) => ({
      ...data,
      [name]: value,
    }));
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    const isAddressFilled =
      addressFields.borough && addressFields.street_number && addressFields.street_name;
    const isBblFilled = bblFields.borough && bblFields.block && bblFields.lot;

    if (isAddressFilled && isBblFilled) {
      alert("Fill out only one fieldset.");
      return;
    }

    if (isAddressFilled) {
      await searchFor({
        borough: addressFields.borough,
        street_number: addressFields.street_number,
        street_name: addressFields.street_name,
        unit: addressFields.unit || "",
        block: "",
        lot: "",
      });
    } else if (isBblFilled) {
      await searchFor({
        borough: bblFields.borough,
        block: bblFields.block,
        lot: bblFields.lot,
        street_number: "",
        street_name: "",
        unit: "",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <h3>Property Address</h3>
        <AddressBoroughSelect
          value={addressFields.borough}
          onChange={handleAddressChange}
        />
      </fieldset>
      <fieldset>
        <h3>Property Borough, Block & Lot</h3>
        <AddressBoroughSelect
          value={bblFields.borough}
          onChange={handleBblChange}
        />
      </fieldset>
      <button type="submit">Submit</button>
    </form>
  );
}

export default AddressParcelLookupForm;
```

**Best Practices for Wrappers**

1. Encapsulation - Wrappers encapsulate logic specific to the form, such as state management or default props.
2. Consistency - Wrappers ensure consistent usage of `BoroughSelect` across different forms.
3. Flexibility - The base `BoroughSelect` remains flexible and reusable in other contexts.
4. Future-Proofing - If additional logic is needed for `PartyNameSearchForm` or `AddressParcelLookupForm`, it can be added to the respective wrapper without modifying the base `BoroughSelect`.

[Back to TOC]((#table-of-contents))

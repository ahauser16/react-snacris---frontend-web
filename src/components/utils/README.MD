# Utils Notes

## InfoIcon

example of implementation

```js
// src/components/NameInput/NameInput_Exact.jsx
import React, { useState } from "react";
import InfoIcon from '../../../../InfoIcon/InfoIcon';

const NameInputExact = ({
  nameExactFS,
  nameExactES,
  handleInputChange,
  handleErrorDisplay,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const validateName = (value) => {
    if (value.length > 70) {
      handleErrorDisplay("nameExactES", "Name must be 70 characters or less.");
    } else if (!value) {
      handleErrorDisplay("nameExactES", "This field is required for form submission");
    } else {
      handleErrorDisplay("nameExactES", null);
    }
  };

  const handleValidationPlusDataTransferToSoql = (e) => {
    validateName(e.target.value);
    handleInputChange(e);
  };

  return (
    <div
      className={`form-group form-group--name-exact ${nameExactES ? "field-error" : ""}`}
    >
      <label htmlFor="name-exact">
        <span>Exact Name</span>
        <InfoIcon
          isHovered={isHovered}
          setIsHovered={setIsHovered}
          hoverMessage="Name must be 70 characters or less and is required for form submission."
        />
      </label>
      <input
        type="text"
        id="name-exact"
        name="nameExact"
        value={nameExactFS}
        onChange={handleValidationPlusDataTransferToSoql}
        className="form-field"
        aria-describedby="name-exact-description"
        placeholder="Enter exact name"
        maxLength="70"
        aria-required="true"
        required
      />
      <span className="field-description" id="name-exact-description">
        {nameExactES}
      </span>
    </div>
  );
};

export default NameInputExact;
```

```js
import React from 'react';
import NameInputContains from "./NameInputContains";
import NameInputExact from "./NameInputExact";
import NameInputNameParts from "./NameInputNameParts";
import NameInputBusiness from "./NameInputBusiness";
import NameInputExclusion from "./NameInputExclusion";
import NameInputMultipleSubstrings from "./NameInputMultipleSubstrings";
import NameInputInclusionExclusion from "./NameInputInclusionExclusion";
import NameInputComplexCompound from "./NameInputComplexCompound";
import NameInputStartsWith from "./NameInputStartsWith";
import NameInputEndsWith from "./NameInputEndsWith";
import NameInputMultipleExclusion from "./NameInputMultipleExclusion";

const NameInputHybrid = ({
  nameFieldFS,
  nameFieldES,
  handleInputChange,
  handleErrorDisplay,
}) => {
  return (
    <fieldset>
      {nameFieldFS.nameModifierFS === "contains" && (
        <NameInputContains
          nameContainsFS={nameFieldFS.nameContainsFS}
          nameContainsES={nameFieldES.nameContainsES}
          handleInputChange={handleInputChange}
          handleErrorDisplay={handleErrorDisplay}
        />
      )}
      {nameFieldFS.nameModifierFS === "exact" && (
        <NameInputExact
          nameExactFS={nameFieldFS.nameExactFS}
          nameExactES={nameFieldES.nameExactES}
          handleInputChange={handleInputChange}
          handleErrorDisplay={handleErrorDisplay}
        />
      )}
      {nameFieldFS.nameModifierFS === "nameParts" && (
        <NameInputNameParts
          firstFS={nameFieldFS.namePartsFS.firstFS}
          firstES={nameFieldES.namePartsES.firstES}
          lastFS={nameFieldFS.namePartsFS.lastFS}
          lastES={nameFieldES.namePartsES.lastES}
          middleFS={nameFieldFS.namePartsFS.middleFS}
          middleES={nameFieldES.namePartsES.middleES}
          fullNameFS={nameFieldFS.namePartsFS.fullNameFS}
          fullNameES={nameFieldES.namePartsES.fullNameES}
          handleInputChange={handleInputChange}
          handleErrorDisplay={handleErrorDisplay}
        />
      )}
      {nameFieldFS.nameModifierFS === "business" && (
        <NameInputBusiness
          nameBusinessFS={nameFieldFS.nameBusinessFS}
          nameBusinessES={nameFieldES.nameBusinessES}
          handleInputChange={handleInputChange}
          handleErrorDisplay={handleErrorDisplay}
        />
      )}
      {nameFieldFS.nameModifierFS === "exclusion" && (
        <NameInputExclusion
          searchTextFS={nameFieldFS.exclusionFS.searchTextFS}
          searchTextES={nameFieldES.exclusionES.searchTextES}
          exclusionTextFS={nameFieldFS.exclusionFS.exclusionTextFS}
          exclusionTextES={nameFieldES.exclusionES.exclusionTextES}
          handleInputChange={handleInputChange}
          handleErrorDisplay={handleErrorDisplay}
        />
      )}
      {nameFieldFS.nameModifierFS === "multipleSubstrings" && (
        <NameInputMultipleSubstrings
          substring1FS={nameFieldFS.multipleSubstringsFS.substring1FS}
          substring1ES={nameFieldES.multipleSubstringsES.substring1ES}
          substring2FS={nameFieldFS.multipleSubstringsFS.substring2FS}
          substring2ES={nameFieldES.multipleSubstringsES.substring2ES}
          handleInputChange={handleInputChange}
          handleErrorDisplay={handleErrorDisplay}
        />
      )}
      {nameFieldFS.nameModifierFS === "inclusionExclusion" && (
        <NameInputInclusionExclusion
          inclusionTextFS={nameFieldFS.inclusionExclusionFS.inclusionTextFS}
          inclusionTextES={nameFieldES.inclusionExclusionES.inclusionTextES}
          exclusionTextFS={nameFieldFS.inclusionExclusionFS.exclusionTextFS}
          exclusionTextES={nameFieldES.inclusionExclusionES.exclusionTextES}
          handleInputChange={handleInputChange}
          handleErrorDisplay={handleErrorDisplay}
        />
      )}
      {nameFieldFS.nameModifierFS === "complexCompound" && (
        <NameInputComplexCompound
          mainTextFS={nameFieldFS.complexCompoundFS.mainTextFS}
          mainTextES={nameFieldES.complexCompoundES.mainTextES}
          compoundText1FS={nameFieldFS.complexCompoundFS.compoundText1FS}
          compoundText1ES={nameFieldES.complexCompoundES.compoundText1ES}
          compoundText2FS={nameFieldFS.complexCompoundFS.compoundText2FS}
          compoundText2ES={nameFieldES.complexCompoundES.compoundText2ES}
          handleInputChange={handleInputChange}
          handleErrorDisplay={handleErrorDisplay}
        />
      )}
      {nameFieldFS.nameModifierFS === "startsWith" && (
        <NameInputStartsWith
          startsWithFS={nameFieldFS.startsWithFS}
          startsWithES={nameFieldES.startsWithES}
          handleInputChange={handleInputChange}
          handleErrorDisplay={handleErrorDisplay}
        />
      )}
      {nameFieldFS.nameModifierFS === "endsWith" && (
        <NameInputEndsWith
          endsWithFS={nameFieldFS.endsWithFS}
          endsWithES={nameFieldES.endsWithES}
          handleInputChange={handleInputChange}
          handleErrorDisplay={handleErrorDisplay}
        />
      )}
      {nameFieldFS.nameModifierFS === "multipleExclusion" && (
        <NameInputMultipleExclusion
          searchTextFS={nameFieldFS.multipleExclusionFS.searchTextFS}
          searchTextES={nameFieldES.multipleExclusionES.searchTextES}
          exclusionText1FS={nameFieldFS.multipleExclusionFS.exclusionText1FS}
          exclusionText1ES={nameFieldES.multipleExclusionES.exclusionText1ES}
          exclusionText2FS={nameFieldFS.multipleExclusionFS.exclusionText2FS}
          exclusionText2ES={nameFieldES.multipleExclusionES.exclusionText2ES}
          handleInputChange={handleInputChange}
          handleErrorDisplay={handleErrorDisplay}
        />
      )}
    </fieldset>
  );
};

export default NameInputHybrid;
```

```js
import React from "react";
import NameInputHybrid from "../InputComponents/NameInputHybrid";
import NameInputHybridModifier from "../SearchModifier/NameInputHybridModifier";

const NameInputHybridContainer = ({
  nameFieldFS,
  nameFieldES,
  handleInputChange,
  handleErrorDisplay,
  handleModifierChange,
}) => {
  return (
    <fieldset className="drop-shadow">
      <legend>Party Name Search</legend>
      <NameInputHybridModifier
        handleModifierChange={handleModifierChange}
        nameModifierFS={nameFieldFS.nameModifierFS}
        nameModifierES={nameFieldES.nameModifierES}
      />
      <NameInputHybrid
        nameFieldFS={nameFieldFS}
        nameFieldES={nameFieldES}
        handleErrorDisplay={handleErrorDisplay}
        handleInputChange={handleInputChange}
      />
    </fieldset>
  );
};

export default NameInputHybridContainer;
```

```js
import React from "react";
import NameInputHybridContainer from "../../acrisComponents/RealPropertyParties/Name/Container/NameInputHybridContainer";
import DateInputHybridContainer from "../../acrisComponents/RealPropertyMaster/DocumentDate/Container/DateInputHybridContainer";
import PartyTypeHybridContainer from "../../acrisComponents/RealPropertyParties/PartyType/Container/PartyTypeHybridContainer";
import RecordedBoroughSelectHybrid from "../SearchByAddressForm/AddressSearch/RecordedBoroughSelect/RecordedBoroughSelectHybrid";
import DocClassSelectHybrid from "../SearchByPartyNameForm/PartyNameSearch/DocClassSelect/DocClassSelectHybrid";

const PartyNameSearchHybrid = ({
  partyNameHybridFormDataState,
  handleInputChange,
  handleErrorDisplay,
  inputUserErrors,
  handleModifierChange,
}) => {
  return (
    <fieldset>
      <legend>Search By Party Name & Additional Criteria</legend>
      <NameInputHybridContainer
        nameFieldFS={partyNameHybridFormDataState.nameFieldFS}
        nameFieldES={inputUserErrors.nameFieldES}
        handleInputChange={handleInputChange}
        handleErrorDisplay={handleErrorDisplay}
        handleModifierChange={handleModifierChange}
      />
      <DateInputHybridContainer
        documentDateFieldFS={partyNameHybridFormDataState.documentDateFieldFS}
        documentDateFieldES={inputUserErrors.documentDateFieldES}
        handleInputChange={handleInputChange}
        handleErrorDisplay={handleErrorDisplay}
        handleModifierChange={handleModifierChange}
      />
      <PartyTypeHybridContainer
        partyTypeFieldFS={partyNameHybridFormDataState.partyTypeFieldFS}
        partyTypeFieldES={inputUserErrors.partyTypeFieldES}
        handleInputChange={handleInputChange}
        handleErrorDisplay={handleErrorDisplay}
        handleModifierChange={handleModifierChange}
      />
      {/* <div className="form-row form-row--mixed">
        <PartyTypeSelectHybrid
          value={partyNameHybridFormDataState.party_typeFS}
          onChange={handleInputChange}
          handleErrorDisplay={handleErrorDisplay}
          error={inputUserErrors.party_typeES}
        />
      </div>
      <div className="form-row form-row--mixed">
        <RecordedBoroughSelectHybrid
          value={partyNameHybridFormDataState.recorded_boroughFS}
          onChange={handleInputChange}
          handleErrorDisplay={handleErrorDisplay}
          error={inputUserErrors.recorded_boroughES}
        />
      </div>
      <div className="form-row form-row--mixed">
        <DocClassSelectHybrid
          value={partyNameHybridFormDataState.doc_typeFS}
          onChange={handleInputChange}
          handleErrorDisplay={handleErrorDisplay}
          error={inputUserErrors.doc_typeES}
        />
      </div> */}
    </fieldset>
  );
};

export default PartyNameSearchHybrid;
```

```js
import React, { useState } from "react";
import PartyNameSearchHybrid from "./PartyNameSearchHybrid";
import FormControls from "../FormControls/FormControls";
import { handleFormReset } from '../utils/handleFormReset';
import { handlePartyNameHybridFormSubmit } from '../utils/handlePartyNameHybridFormSubmit';
import ErrorMessageDisplay from '../ErrorMessageDisplay/ErrorMessageDisplay';
import handleErrorDisplay from '../utils/HandleErrorDisplay/HandleErrorDisplay';

const SearchByPartyNameHybridForm = ({
  setData,
  setError,
  handleTableReset,
  limit,
  offset,
}) => {
  const initialFormState = {
    nameFieldFS: {
      nameExactFS: "",
      nameContainsFS: "",
      nameBusinessFS: "",
      namePartsFS: {
        firstFS: "",
        lastFS: "",
        middleFS: "",
        fullNameFS: "",
      },
      nameModifierFS: "business",
      exclusionFS: {
        searchTextFS: "",
        exclusionTextFS: ""
      },
      multipleSubstringsFS: {
        substring1FS: "",
        substring2FS: ""
      },
      inclusionExclusionFS: {
        inclusionTextFS: "",
        exclusionTextFS: ""
      },
      complexCompoundFS: {
        mainTextFS: "",
        compoundText1FS: "",
        compoundText2FS: ""
      },
      startsWithFS: "",
      endsWithFS: "",
      multipleExclusionFS: {
        searchTextFS: "",
        exclusionText1FS: "",
        exclusionText2FS: ""
      },
    },
    documentDateFieldFS: {
      documentDateFS: "",
      documentDateModifierFS: "dateRangeSelect", // Default value,
      dateRangeSelectFS: {
        startDateFS: "",
        endDateFS: "",
      },
      exactDateFS: "",
      dateRangeCustomFS: {
        startDateFS: "",
        endDateFS: "",
      },
    },
    partyTypeFieldFS: {
      partyTypeFS: "",
    },
    recordedBoroughFS: "",
    docTypeFS: [],
  };

  const initialUserErrors = {
    nameFieldES: {
      nameExactES: null,
      nameContainsES: null,
      nameBusinessES: null,
      namePartsES: {
        firstES: null,
        lastES: null,
        middleES: null,
        fullNameES: null,
      },
      nameModifierES: null,
      exclusionES: {
        searchTextES: null,
        exclusionTextES: null
      },
      multipleSubstringsES: {
        substring1ES: null,
        substring2ES: null
      },
      inclusionExclusionES: {
        inclusionTextES: null,
        exclusionTextES: null
      },
      complexCompoundES: {
        mainTextES: null,
        compoundText1ES: null,
        compoundText2ES: null
      },
      startsWithES: null,
      endsWithES: null,
      multipleExclusionES: {
        searchTextES: null,
        exclusionText1ES: null,
        exclusionText2ES: null
      },
    },
    documentDateFieldES: {
      documentDateES: null,
      documentDateModifierES: null,
      dateRangeSelectES: {
        startDateES: null,
        endDateES: null,
      },
      exactDateES: null,
      dateRangeCustomES: {
        startDateES: null,
        endDateES: null,
      },
    },
    partyTypeFieldES: {
      partyTypeES: null,
    },
    recordedBoroughES: null,
    docTypeES: null,
  };

  const [partyNameHybridFormDataState, setPartyNameHybridFormDataState] = useState(initialFormState);
  const [inputUserErrors, setInputUserErrors] = useState(initialUserErrors);
  const [errorMessages, setErrorMessages] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input change - ${name}: ${value}`);

    setPartyNameHybridFormDataState((prevSoql) => {
      const newSoql = { ...prevSoql };

      if (name === "first-name" || name === "last-name" || name === "middle-name") {
        newSoql.nameFieldFS[name.split("-")[0] + "FS"] = value;
        newSoql.nameFieldFS.namePartsFS = `${newSoql.nameFieldFS.firstFS} ${newSoql.nameFieldFS.middleFS} ${newSoql.nameFieldFS.lastFS}`.trim();
      } else if (name.includes(".")) {
        const [parent, child] = name.split(".");
        newSoql.nameFieldFS[parent + "FS"][child + "FS"] = value;
      } else if (name === "document_date") {
        const [startDate, endDate] = value.split(" - ");
        newSoql.documentDateFieldFS.dateRangeSelectFS.startDateFS = startDate;
        newSoql.documentDateFieldFS.dateRangeSelectFS.endDateFS = endDate;
      } else if (name === "party_type") {
        newSoql.partyTypeFieldFS.partyTypeFS = value;
      } else {
        newSoql.nameFieldFS[name + "FS"] = value;
      }

      return newSoql;
    });
  };

  const handleModifierChange = (field, value) => {
    console.log(`Modifier input change - ${field}: ${value}`);
    setPartyNameHybridFormDataState((prevSoql) => {
      if (field === "nameModifierFS") {
        return {
          ...prevSoql,
          nameFieldFS: {
            ...prevSoql.nameFieldFS,
            [field]: value,
          },
        };
      } else if (field === "documentDateModifierFS") {
        return {
          ...prevSoql,
          documentDateFieldFS: {
            ...prevSoql.documentDateFieldFS,
            [field]: value,
          },
        };
      }
      return prevSoql;
    });
  };

  const resetForm = handleFormReset(setPartyNameHybridFormDataState, initialFormState, setInputUserErrors, initialUserErrors, setErrorMessages, handleTableReset);

  return (
    <form
      className="custom-form--container"
      onSubmit={(e) => handlePartyNameHybridFormSubmit(e, partyNameHybridFormDataState, setInputUserErrors, setErrorMessages, setData, setError, limit, offset, handleErrorDisplay)}
    >
      <PartyNameSearchHybrid
        partyNameHybridFormDataState={partyNameHybridFormDataState}
        handleInputChange={handleInputChange}
        handleErrorDisplay={(fieldName, errorMessage) => handleErrorDisplay(fieldName, errorMessage, setInputUserErrors)}
        inputUserErrors={inputUserErrors}
        handleModifierChange={handleModifierChange}
      />
      <FormControls handleFormReset={resetForm} />
      <ErrorMessageDisplay errorMessages={errorMessages} />
    </form>
  );
};

export default SearchByPartyNameHybridForm;
```
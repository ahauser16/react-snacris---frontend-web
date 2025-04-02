# Refactor Notes

This README will document my refactor of the React Jobly frontend to work as the frontend for my SNACRIS website. I need to refamiliarize myself with how the React Jobly frontend is configured to work with th ebackend so I will research how `App.js`, `index.js` and `api.js` work and make notes below.

first test user & pw:
march31testuser

## To Do List

### `api` folder

- [x] Update the `BASE_URL` in `api.js` to point to your backend server.
- Verify that the backend API routes match the ones used in `api.js` and remove Jobly-specific endpoints & add Snacris-specific endpoints:
  - [x] `POST /auth/token` for the `login` route (Ensure Match)
    - How It Works:
      - 1. Sends a `POST` request to the `/auth/token` endpoint with the user's `username` and `password` in the request body.
      - 2. The backend validates the credentials and responds with a JWT token.
      - 3. Used in the frontend `LoginForm` component to log in a user.
      - 4. Used in the backend route: `POST /auth/token`.
  - [x] `POST /auth/register` for the `signup` route (Ensure Match)
    - How It Works:
      - 1. Sends a `POST` request to the `/auth/register` endpoint with the user's registration details (e.g., username, password, firstName, lastName, email).
      - 2. The backend creates a new user and responds with a JWT token.
      - 3. Used in the frontend `SignupForm` component to register a new user.
      - 4. Used in the backend route: `POST /auth/register`.
  - [ ] `GET /users/:username` for the `getCurrentUser(username)` route (Ensure Match)
    - How It Works:
      - 1. Sends a `GET` request to the `/users/:username` endpoint.
      - 2. The `username` is passed as part of the URL.
      - 3. The backend responds with the user's details (e.g., username, email, firstName, lastName, etc.).
      - 4. Used in the frontend `App.js` to load the current user's data when the app initializes or when the user logs in.
      - 5. Used in the backend route: `GET /users/:username`
  - [ ] `users/${username}` for the `saveProfile` route (Ensure Match & Refactor So Data Is SNACRIS Data)
    - How It Works:
      - 1. Sends a `PATCH` request to the `/users/:username` endpoint with the updated user data (e.g., firstName, lastName, email).
      - 2. The backend updates the user's profile and responds with the updated user details.
      - 3. Used in the frontend `ProfileForm` component to allow users to update their profile.
      - 4. Used in the backend route: `PATCH /users/:username`
    - Errors To Fix:
      - [ ] When I try to save updated data in the ProfileForm I get the error: "instance requires property 'password'".
  - [ ] `GET /companies` for the `getCompanies(name)` route that gets company data (Remove)
    - To Do: Understand how it works so you can use the architecture to retrieve SNACRIS data from the database
    - How It Works:
      - 1. Sends a `GET` request to the `/companies` endpoint.
      - 2. If a `name` is provided, it is sent as a query parameter (e.g., `/companies?name=tech`).
      - 3. The backend responds with a list of companies matching the filter.
      - 4. Used in the frontend `CompanyList` component to display a list of companies.
      - 5. Used in the backend route: `GET /companies`.
  - [ ] `GET /companies/:handle` for the `getCompany(handle)` route that gets details about a specific company includings its jobs.
    - To Do: Understand how it works so you can use the architecture to retrieve SNACRIS data from the database
    - How It Works:
      - 1. Sends a `GET` request to the `/companies/:handle` endpoint.
      - 2. The handle (a unique identifier for the company) is passed as part of the URL.
      - 3. The backend responds with the company's details and its associated jobs.
      - 4. Used in the frontend `CompanyDetail` component to display detailed information about a company.
      - 5. Used in the backend route: `GET /companies/:handle`.
  - [ ] `"jobs", { title }` for the `getJobs(title)` route that gets a list of jobs, optionally filtered by a `title`.
    - To Do: Why is this syntax different from the other routes?
    - How It Works:
      - 1. Sends a `GET` request to the `/jobs` endpoint.
      - 2. If a `title` is provided, it is sent as a query parameter (e.g., `/jobs?title=developer`).
      - 3. The backend responds with a list of jobs matching the filter.
      - 4. Used in the frontend `JobList` component to display a list of jobs.
      - 5. Used in the backend route: `GET /jobs`.
  - [ ] `POST /users/:username/jobs/:id` for the `applyToJob(username, id)`
    - To Do: Study this route and refactor to work with a "Save" button to save ACRIS data after it is retrieved from the NYC Open Data API.
    - How It Works:
      - 1. Sends a `POST` request to the `/users/:username/jobs/:id` endpoint.
      - 2. The `username` is passed as part of the URL, and the `id` is the job ID.
      - 3. The backend processes the application and updates the user's applied jobs.
      - 4. Used in the frontend `JobCard` component when a user clicks the "Apply" button.
      - 5. Used in the backend route `POST /users/:username/jobs/:id`

### `auth` folder

no refactor required

### `common` folder

- [ ] study and refactor `SearchForm.js` to use with this application and maybe refactor the input fields. You could just copy the format you used in the chrome extension.

#### using `SearchForm.js` and `CompanyList` as templates for ACRIS API forms

I'm refactoring my frontend application by using the `companyList.js` and `SearchForm.js` components as templates from which I am creating new components and forms such as `addressParcelLookup.js` and `AddressParcelLookupForm.js`. However, I want to keep some functionalies and architecture from the `CompanyList.js` and `SearchForm.js` components while removing/replacing other functionalities. I want to review my understanding of the `companyList.js` and `SearchForm.js` code below (the "Background") and the new changes I want to make (the "New Behavior") and then I want you to help create a "to do" list of the steps I need to take to achieve my refactor.

Background: First, `CompanyList` has (i) a state variable and setter function: `[companies, setCompanies]`, (ii) a `useEffect` hook that runs `getCompaniesOnMount` and a `search` function that makes an API call named `getCompanies` and sets it to a `companies` variable and then runs the `setCompanies` function by passing `companies` variable to it. If there are no companies a LoadingSpinner is displayed. Second, `CompanyList` renders (i) a SearchForm containing a property named "searchFor" assigned to a prop named "search" and (ii) (dynamically) renders a div with className of "CompanyList-list" containing the results from the `JoblyApi.getCompanies` API call ( and if none were fount it renders a message "Sorry, no results were found). Third, the SearchForm has (i) a state variable and setter function: `[searchTerm, setSearchTerm]`, (ii) a `handleSubmit` function that passes the `searchTerm` to the `searchFor` property and (iii) a `handleChange` function that passes the `evt.target.value` to the `setSearchTerm` method. Fourth, `SearchForm` renders a `form` element with the property `onSubmit` assigned to the `handleSubmit` function, some formatting divs with bootstrap syntax, an `input` field with `className`, `name`, `placeholder` `value` (assigned to the `searchTerm` state variable) and `onChange` (assigned to the `handleChange` function) attributes as well as a "submit" `button` element.

New Behavior: I want to create a new display component called "addressParcelLookup.js", based on the `CompanyList.js` component, and another new form component called "addressParcelLookupForm.js", based on the `SearchForm.js` component. The `addressParcelLookup` component will (i) create a state variable and setter function called `[results, setResults]` with the `useState` hook, (ii) define an asynchronous function called `search` (and pass it to the `addressParcelLookupForm` component) that (a) makes a call to `await SnacrisApi.queryAcrisAddressParcel` by passing in either the parameters `borough`, `street_number`, `street_name` and `unit` or the parameters `borough`, `block` and `lot` (b) assigns the results to a variable called `results` and (c) passes `results` into the `setResults` function. The `addressParcelLookup` component will render the same container div that includes the `addressParcelLookupForm` component and the results from the `SnacrisApi.queryAcrisAddressParcel` API call if there are any but if not it will display the message: "Sorry, no results were found!". The `addressParcelLookupForm` component will (i) define a state object called "searchTerms" that contains the data to be passed to the `queryAcrisAddressParcel` method including: `borough`, `street_number`, `street_name` and `unit` and `borough`, `block` and `lot` and a setter function called "setSearchTerms" and assigns each of them to the `useState("")` hook, (ii) define a `handleSubmit` function that (a) prevents the default behavior, (b) passes the each of the `searchTerms` while using the same .trim() || undefined syntax to the `searchFor` method and (c)passes the `searchTerms.trim()` to the `setSearchTerms` function, (iii) define a `handleChange` function that executes the equivalent `setSearchTerms(evt.target.value);` for each of the `borough`, `street_number`, `street_name` and `unit` data and the `borough`, `block` and `lot` data. Keep in mind I want to keep all the same bootstrap formatting div elements and styling with the following new behaviors. The `addressParcelLookupForm` component will render (1) a container div with class `AddressParcelLookupForm`, (2) a `form` element with `onSubmit` assigned to the `handleSubmit` method, (3) a `div` with bootstrap classes containing a `h2`, `p` tag and `input` fields for each of the `borough`, `street_number`, `street_name` and `unit`, which represents one of the two groups of user's data that will be passed to the `SnacrisApi.queryAcrisAddressParcel` API call, (4) a `div` with bootstrap classes containing a `h2`, `p` tag and `input` fields for each of the `borough`, `block` and `lot`, which represents the second of the two groups of user's data that will be passed to the `SnacrisApi.queryAcrisAddressParcel` API call and (5) a `div` containing a `button` element that submits the form's data. Keep in mind I want the form to only submit one of the two groups of data to the API call but not both.

#### Refactor Plan - Frontend

I. Refactor `addressParcelLookup.js`

**To Dos**

- [x] Create State for Results:
- Replace the placeholder `companies` state with a new state variable `[results, setResults]` to store the results of the `SnacrisApi.queryAcrisAddressParcel` API call.

```js
const [results, setResults] = useState(null);
```

- [x] Define the `search` Function:

- Replace the placeholder `search` function with a new implementation that:
  - Accepts the `searchTerms` object as a parameter.
  - Calls `SnacrisApi.queryAcrisAddressParcel` with the appropriate parameters.
  - Updates the `results` state with the API response.

```js
async function search(searchTerms) {
  try {
    const results = await SnacrisApi.queryAcrisAddressParcel(searchTerms);
    setResults(results);
  } catch (err) {
    console.error("Error fetching results:", err);
    setResults([]);
  }
}
```

- [x] Render Results: Dynamically render the results if they exist, or display a message if no results are found.

```js
return (
  <div className="container text-center">
    <h1 className="mb-4 fw-bold">Lookup Address or Parcel</h1>
    <hr />
    <AddressParcelLookupForm searchFor={search} />
    {results ? (
      results.length ? (
        <div className="results-list">
          {results.map((result, idx) => (
            <div key={idx} className="result-item">
              {/* Render result details */}
              {JSON.stringify(result)}
            </div>
          ))}
        </div>
      ) : (
        <p className="lead">Sorry, no results were found!</p>
      )
    ) : null}
  </div>
);
```

II. Refactor `AddressParcelLookupForm.js`

**To Dos**

- [x] Create State for Search Terms:
- Replace the single `searchTerm` state with a `searchTerms` object that includes:
  - `borough`, `street_number`, `street_name`, `unit`
  - `borough`, `block`, `lot`

```js
const [searchTerms, setSearchTerms] = useState({
  borough: "",
  street_number: "",
  street_name: "",
  unit: "",
  block: "",
  lot: "",
});
```

- [x] Update `handleChange` Function:
- Update the `handleChange` function to handle changes for each input field by updating the corresponding property in the `searchTerms` object.

```js
function handleChange(evt) {
  const { name, value } = evt.target;
  setSearchTerms((data) => ({
    ...data,
    [name]: value,
  }));
}
```

- [x] Update `handleSubmit` Function:

- Update the `handleSubmit` function to:
  - Prevent the default form submission behavior.
  - Pass only one group of search terms (either address or BBL) to the `searchFor` function.

```js
function handleSubmit(evt) {
  evt.preventDefault();
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
```

- [x] Render Input Fields:
- Update the input fields to use the `searchTerms` object and the `handleChange` function.

```js
<input
  className="form-control form-control-lg"
  name="borough"
  placeholder="Enter Borough..."
  value={searchTerms.borough}
  onChange={handleChange}
/>
<input
  className="form-control form-control-lg"
  name="street_number"
  placeholder="Enter Street Number..."
  value={searchTerms.street_number}
  onChange={handleChange}
/>
<input
  className="form-control form-control-lg"
  name="street_name"
  placeholder="Enter Street Name..."
  value={searchTerms.street_name}
  onChange={handleChange}
/>
<input
  className="form-control form-control-lg"
  name="unit"
  placeholder="Enter Unit..."
  value={searchTerms.unit}
  onChange={handleChange}
/>
```

- [x] Render the Form: Ensure the form includes two groups of input fields (address and BBL) and a submit button.

```js
return (
  <div className="AddressParcelLookupForm mb-4">
    <form onSubmit={handleSubmit}>
      <div className="row justify-content-center justify-content-lg-start gx-0">
        <h2 className="mb-4 fw-bold">Property Address:</h2>
        <p>
          If you know the property address, complete the fields below and press
          "Find BBL".
        </p>
        <div className="col-6">
          {/* Address Fields */}
          <input
            className="form-control form-control-lg"
            name="borough"
            placeholder="Enter Borough..."
            value={searchTerms.borough}
            onChange={handleChange}
          />
          <input
            className="form-control form-control-lg"
            name="street_number"
            placeholder="Enter Street Number..."
            value={searchTerms.street_number}
            onChange={handleChange}
          />
          <input
            className="form-control form-control-lg"
            name="street_name"
            placeholder="Enter Street Name..."
            value={searchTerms.street_name}
            onChange={handleChange}
          />
          <input
            className="form-control form-control-lg"
            name="unit"
            placeholder="Enter Unit..."
            value={searchTerms.unit}
            onChange={handleChange}
          />
        </div>
        <hr />
        <h2 className="mb-4 fw-bold">Property Borough, Block & Lot:</h2>
        <p>
          If you know the Borough, Block, and Lot, complete the fields below and
          press "Find Address".
        </p>
        <div className="col-6">
          {/* BBL Fields */}
          <input
            className="form-control form-control-lg"
            name="block"
            placeholder="Enter Block..."
            value={searchTerms.block}
            onChange={handleChange}
          />
          <input
            className="form-control form-control-lg"
            name="lot"
            placeholder="Enter Lot..."
            value={searchTerms.lot}
            onChange={handleChange}
          />
        </div>
        <div className="col-auto">
          <button type="submit" className="btn btn-lg btn-primary">
            Submit
          </button>
        </div>
      </div>
    </form>
  </div>
);
```

III. Test The Components

**To Dos**

1. Test the `addressParcelLookup` component:

- [x] Verify that it renders the `AddressParcelLookupForm` component.
- [ ] Verify that it displays results or the "no results" message based on the API response.

2. Test the `AddressParcelLookupForm` component:

- [x] Verify that it correctly updates the `searchTerms` state when input fields are changed.
- [ ] Verify that it submits only one group of data (address or BBL) to the searchFor function.

3. Test the API integration:

- [ ] Verify that the `SnacrisApi.queryAcrisAddressParcel` method is called with the correct parameters.

IV. Summary of Changes

- `addressParcelLookup.js`:

  - Replaced `companies` with `results`.
  - Updated the `search` function to call `SnacrisApi.queryAcrisAddressParcel`.
  - Rendered results dynamically.

- `AddressParcelLookupForm.js`:
  - Replaced `searchTerm` with `searchTerms`.
  - Updated `handleChange` and `handleSubmit` to handle multiple input fields and submit only one group of data.
  - Rendered two groups of input fields (address and BBL).

#### Refactor Plan - Backend

**1. Backend: Ensure the `/queryAcrisAddressParcel` Route Works**
Your backend already has a route defined in `queryAcrisAddressParcel.js` for fetching data from the ACRIS API. Here's what you need to verify:

**Step 1.1: Test the Backend Route**

- [x] Start your backend server with the command `npm start`.
- [ ] Use Postman to test the `/queryAcrisAddressParcel/fetchRecord`endpoint, such as with the http request: `http://localhost:3001/queryAcrisAddressParcel/fetchRecord?borough=MANHATTAN&block=1000&lot=1`
- [ ] Ensure the endpoint returns the expected JSON response:

```json
{
  "records": [
    {
      "document_id": "12345",
      "record_type": "Deed",
      "borough": "MANHATTAN",
      "block": "1000",
      "lot": "1",
      "street_number": "123",
      "street_name": "Main St",
      "unit": "1A",
      "good_through_date": "2023-12-31"
    }
  ]
}
```

**Step 1.1.1 DEBUG REQUIRED**

error received in VSC terminal:

```
Constructed URL: https://data.cityofnewyork.us/resource/8h5j-fqxa.json?borough=MANHATTAN&block=1000&lot=1
AxiosError: Request failed with status code 400
    at settle (/home/haus/springboard_bootcamp_dec_2023/snacris--backend/Backend/node_modules/axios/dist/node/axios.cjs:2026:12)
    at IncomingMessage.handleStreamEnd (/home/haus/springboard_bootcamp_dec_2023/snacris--backend/Backend/node_modules/axios/dist/node/axios.cjs:3142:11)
    at IncomingMessage.emit (node:events:531:35)
    at endReadableNT (node:internal/streams/readable:1696:12)
    at process.processTicksAndRejections (node:internal/process/task_queues:82:21)
    at Axios.request (/home/haus/springboard_bootcamp_dec_2023/snacris--backend/Backend/node_modules/axios/dist/node/axios.cjs:4252:41)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async LegalsRealPropApi.fetchFromAcris (/home/haus/springboard_bootcamp_dec_2023/snacris--backend/Backend/api/acris/real-property/LegalsRealPropApi.js:21:26)
    at async /home/haus/springboard_bootcamp_dec_2023/snacris--backend/Backend/routes/api/snacrisForms/queryAcrisAddressParcel.js:26:25
GET /queryAcrisAddressParcel/fetchRecord?borough=MANHATTAN&block=1000&lot=1 400 72 - 245.754 ms
```

error assessment:
I tried testing the `queryAcrisAddressParcel` route in Postman using this link: `http://localhost:3001/queryAcrisAddressParcel/fetchRecord?document_id=2013100700087001` which returned the correct output, however, it would not make the request using the `borough`, `block` and `lot` parameters. The following changes were made to `LegalsRealPropApi.js` and `queryAcrisAddressParcel.js`.

1. The `LegalsRealPropApi` should be flexible enough to handle all possible query parameters for the Real Property Legals dataset. It already uses URLSearchParams to construct the query string dynamically, so no major changes are needed here. However, we can improve error handling and ensure that the API token is properly included.

**Updated LegalsRealPropApi.js**

```js
"use strict";

/** Routes for ACRIS Real Property Legals API calls. */

const express = require("express");
const LegalsRealPropApi = require("../../../api/acris/real-property/LegalsRealPropApi");

const router = new express.Router();

/**
 * GET /fetchRecord => { records: [...] }
 *
 * Fetch data from the NYC Open Data Real Property Legals dataset based on query parameters.
 *
 * Query Parameters:
 * - borough
 * - block
 * - lot
 * - street_number
 * - street_name
 * - unit
 *
 * Returns:
 * - [{ document_id, record_type, borough, block, lot, ... }]
 *
 * Authorization required: registered user
 */
router.get("/fetchRecord", async function (req, res, next) {
  try {
    // Extract query parameters from the request
    const { borough, block, lot, street_number, street_name, unit } = req.query;

    // Validate and construct query parameters
    const queryParams = {};
    if (borough) queryParams.borough = borough;
    if (block) queryParams.block = block;
    if (lot) queryParams.lot = lot;
    if (street_number) queryParams.street_number = street_number;
    if (street_name) queryParams.street_name = street_name;
    if (unit) queryParams.unit = unit;

    // Ensure at least one valid parameter is provided
    if (Object.keys(queryParams).length === 0) {
      return res
        .status(400)
        .json({ error: "At least one query parameter is required." });
    }

    // Fetch data from the ACRIS API
    const records = await LegalsRealPropApi.fetchFromAcris(queryParams);
    return res.json({ records });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
```

2. Refactor queryAcrisAddressParcel.js
   The `queryAcrisAddressParcel.js` file should validate and process the incoming query parameters from the frontend, ensuring that only valid parameters are sent to the `LegalsRealPropApi.fetchFromAcris` method.

**Updated queryAcrisAddressParcel.js**

```js
"use strict";

/** Routes for ACRIS Real Property Legals API calls. */

const express = require("express");
const LegalsRealPropApi = require("../../../api/acris/real-property/LegalsRealPropApi");

const router = new express.Router();

/**
 * GET /fetchRecord => { records: [...] }
 *
 * Fetch data from the NYC Open Data Real Property Legals dataset based on query parameters.
 *
 * Query Parameters:
 * - borough
 * - block
 * - lot
 * - street_number
 * - street_name
 * - unit
 *
 * Returns:
 * - [{ document_id, record_type, borough, block, lot, ... }]
 *
 * Authorization required: registered user
 */
router.get("/fetchRecord", async function (req, res, next) {
  try {
    // Extract query parameters from the request
    const { borough, block, lot, street_number, street_name, unit } = req.query;

    // Validate and construct query parameters
    const queryParams = {};
    if (borough) queryParams.borough = borough;
    if (block) queryParams.block = block;
    if (lot) queryParams.lot = lot;
    if (street_number) queryParams.street_number = street_number;
    if (street_name) queryParams.street_name = street_name;
    if (unit) queryParams.unit = unit;

    // Ensure at least one valid parameter is provided
    if (Object.keys(queryParams).length === 0) {
      return res
        .status(400)
        .json({ error: "At least one query parameter is required." });
    }

    // Fetch data from the ACRIS API
    const records = await LegalsRealPropApi.fetchFromAcris(queryParams);
    return res.json({ records });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
```

3. Test the Backend Route
   1. Start the Backend Server: `npm start`.
   2. - [x] Test the `\queryAcrisAddressParcel\fetchRecord` Endpoint using Postman to test the endpoint with different combinations of query parameters:
      - Query by `borough`, `block`, and `lot`: `http://localhost:3001/queryAcrisAddressParcel/fetchRecord?borough=1&block=835&lot=41`
      - Result: `200 Status Code`
      - Response:

```json
{
  "records": [
    {
      "document_id": "2024062700832001",
      "record_type": "L",
      "borough": "1",
      "block": "835",
      "lot": "41",
      "easement": "N",
      "partial_lot": "E",
      "air_rights": "N",
      "subterranean_rights": "N",
      "property_type": "CC",
      "street_number": "33",
      "street_name": "W 33RD ST",
      "unit": "1801",
      "good_through_date": "2024-07-31T00:00:00.000"
    },
    {
      "document_id": "2018121901035001",
      "record_type": "L",
      "borough": "1",
      "block": "835",
      "lot": "41",
      "easement": "N",
      "partial_lot": "P",
      "air_rights": "N",
      "subterranean_rights": "N",
      "property_type": "OF",
      "street_number": "350",
      "street_name": "FIFTH AVE",
      "good_through_date": "2019-04-30T00:00:00.000"
    },
    {
      "document_id": "2017071900208001",
      "record_type": "L",
      "borough": "1",
      "block": "835",
      "lot": "41",
      "easement": "N",
      "partial_lot": "E",
      "air_rights": "N",
      "subterranean_rights": "N",
      "property_type": "CR",
      "street_number": "338",
      "street_name": "5 AVENUE",
      "good_through_date": "2017-07-31T00:00:00.000"
    },
    {"[intentionally omitted hundreds of objects]"},
    {
      "document_id": "2011080600090001",
      "record_type": "L",
      "borough": "1",
      "block": "835",
      "lot": "41",
      "easement": "N",
      "partial_lot": "E",
      "air_rights": "N",
      "subterranean_rights": "N",
      "property_type": "CR",
      "street_number": "350",
      "street_name": "FIFTH AVENUE",
      "good_through_date": "2015-07-31T00:00:00.000"
    }
  ]
}
```

3.  - [x] Test the `\queryAcrisAddressParcel\fetchRecord` Endpoint using Postman to test the endpoint with different combinations of query parameters:
    - Query by `borough`, `street_number` and `street_name`: `http://localhost:3001/queryAcrisAddressParcel/fetchRecord?borough=1&street_number=350&street_name=5TH%20AVENUE`.
    - Result: `200 Status Code`
    - Response:

```json
{
  "records": [
    {
      "document_id": "2013100700087001",
      "record_type": "L",
      "borough": "1",
      "block": "835",
      "lot": "41",
      "easement": "N",
      "partial_lot": "E",
      "air_rights": "N",
      "subterranean_rights": "N",
      "property_type": "OF",
      "street_number": "350",
      "street_name": "5TH AVENUE",
      "good_through_date": "2015-07-31T00:00:00.000"
    },
    {
      "document_id": "2013101801311001",
      "record_type": "L",
      "borough": "1",
      "block": "835",
      "lot": "41",
      "easement": "N",
      "partial_lot": "E",
      "air_rights": "N",
      "subterranean_rights": "N",
      "property_type": "OF",
      "street_number": "350",
      "street_name": "5TH AVENUE",
      "good_through_date": "2015-07-31T00:00:00.000"
    },
    {
      "document_id": "2013092000883001",
      "record_type": "L",
      "borough": "1",
      "block": "835",
      "lot": "41",
      "easement": "N",
      "partial_lot": "E",
      "air_rights": "N",
      "subterranean_rights": "N",
      "property_type": "OF",
      "street_number": "350",
      "street_name": "5TH AVENUE",
      "good_through_date": "2015-07-31T00:00:00.000"
    },
    {
      "document_id": "2013100700087002",
      "record_type": "L",
      "borough": "1",
      "block": "835",
      "lot": "41",
      "easement": "N",
      "partial_lot": "E",
      "air_rights": "N",
      "subterranean_rights": "N",
      "property_type": "OF",
      "street_number": "350",
      "street_name": "5TH AVENUE",
      "good_through_date": "2015-07-31T00:00:00.000"
    }
  ]
}
```

4.  Comparison of searching by Address vs searching by BBL: - Searching by BBL produced hundreds of records that all had matching `borough`, `block` and `lot` values, however, there were discrepancies in their `street_number` and `street_name` values. For example, when searching for `"borough": "1"`, `"block": "835"` and `"lot": "41"` the response contained records with varying `street_number` and `street_name` values such as (a) `"33", "W 33RD ST"`, (b) `"350", "FIFTH AVE"`, (c) `"338", "5 AVENUE"` and (d) `"350", "FIFTH AVENUE"`. This proves there is a "one to many" relationship with property BBL references and property street address references. In other words when searching for records with only the BBL and street addresses in mind, querying the dataset using `borough`, `block` and `lot` could return conflicting `street_number` and `street_name` values whereas querying the dataset using `street_number` and `street_name` **should** return the same `borough`, `block` and `lot`, however, there are edge cases where this is not the case. For example, querying the dataset using the `street_number` and `street_name` values `"33", "W 33RD ST"` (result "a" from the BBL search first mentioned above) returns the BBL: `"borough": "1"`, `"block": "835"` and `"lot": "56"` which is incompatible with the record below which has conflicing BBL and Street Address information.  For these reasons it would be helpful to show the returned records even if they conflict with each other in a way that informs the user and allows them to find the correct property information they are looking for (e.g. "what is the BBL of this street address?" or "what is the street address of this BBL?")

```json
{
  "document_id": "2024062700832001",
  "record_type": "L",
  "borough": "1",
  "block": "835",
  "lot": "41",
  "easement": "N",
  "partial_lot": "E",
  "air_rights": "N",
  "subterranean_rights": "N",
  "property_type": "CC",
  "street_number": "33",
  "street_name": "W 33RD ST",
  "unit": "1801",
  "good_through_date": "2024-07-31T00:00:00.000"
}
```

---

---

---

- [x] **Step 1.2: Confirm the Route is Included in app.js**
Ensure the `queryAcrisAddressParcel` route is correctly registered in your `app.js` file:

```js
app.use("/queryAcrisAddressParcel", queryAcrisAddressParcel);
```

**2. Frontend: Update the API Integration**
Your frontend's `AddressParcelLookup` component uses the `SnacrisApi.queryAcrisAddressParcel` method to fetch data. You need to ensure this method is implemented correctly in `api.js`.

- [x] **Step 2.1: Add `queryAcrisAddressParcel` to `api.js`**

Open `api.js` and add the following method to the `SnacrisApi` class:

```js
static async queryAcrisAddressParcel(searchTerms) {
  console.debug("API queryAcrisAddressParcel called with:", searchTerms);

  // Make a GET request to the backend's `/queryAcrisAddressParcel/fetchRecord` endpoint
  const res = await this.request("queryAcrisAddressParcel/fetchRecord", searchTerms);
  return res.records; // Return the records array from the response
}
```

**Step 2.2: Test the API Integration**

- Ensure the `queryAcrisAddressParcel` method is called correctly from the `AddressParcelLookup` component.
- Add a `console.debug` statement in the `search` function of `AddressParcelLookup` to verify the API call:

```js
async function search(searchTerms) {
  try {
    console.debug("AddressParcelLookup search called with:", searchTerms);
    const results = await SnacrisApi.queryAcrisAddressParcel(searchTerms);
    setResults(results);
  } catch (err) {
    console.error("Error fetching results:", err);
    setResults([]);
  }
}
```

**3. Frontend: Test the /addressParcelLookup Route**
**Step 3.1: Start the Frontend**

- Start your frontend development server: `npm start`.

**Step 3.2: Navigate to /addressParcelLookup**
Open your browser and navigate to `http://localhost:3000/addressParcelLookup`.
Verify that the `AddressParcelLookup` component renders correctly.

**Step 3.3: Submit the Form**

- Fill out the form in the `AddressParcelLookupForm` component with valid data (e.g., `borough`, `block`, and `lot`).
- Submit the form and verify that:
  - The `search` function in `AddressParcelLookup` is called.
  - The `queryAcrisAddressParcel` method in `api.js` is called.
  - The results are displayed on the page.

**FRONTEND TESTING NOTES**
Submitting the `AddressParcelLookupForm` with the `borough`, `block` and `lot` data created and sent the constructed URL from the backend: `https://data.cityofnewyork.us/resource/8h5j-fqxa.json?borough=1&block=835&lot=41` returned data with a `200` status code, however, submitting the same form with the `borough`, `street_number` and `street_name` data created and sent the constructed URL form the backend: `https://data.cityofnewyork.us/resource/8h5j-fqxa.json?borough=1&street_number=338&street_name=5+avenue` returned an error with a `500` status code (see below).

error: 
"Constructed URL: https://data.cityofnewyork.us/resource/8h5j-fqxa.json?borough=1&street_number=338&street_name=5+avenue
Error fetching data from ACRIS API: No records found for query: {"borough":"1","street_number":"338","street_name":"5 avenue"}
Error: Failed to fetch data from ACRIS API
    at LegalsRealPropApi.fetchFromAcris (/home/haus/springboard_bootcamp_dec_2023/snacris--backend/Backend/api/acris/real-property/LegalsRealPropApi.js:43:17)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async /home/haus/springboard_bootcamp_dec_2023/snacris--backend/Backend/routes/api/snacrisForms/queryAcrisAddressParcel.js:70:25"

fixed error: 
the issue was that the text was lower case and Socrata QL requires uppercase.  I added a function that ensures that the text is uppercase beore the API call is made on the back end.

Also, when searching with the `addressParcelLookupForm` component the results are handled so that only unique property values are shown (e.g. `{"borough":"3","block":"962","lot":"36","street_number":"240","street_name":"6 AVENUE"}`).  Searching by BBL: `"borough":"3","block":"962","lot":"36"` returns results below (results A) whereas searching by street address `"borough":"3","street_number":"240","street_name":"6 AVENUE"` returns the results B below.  So there is discrepancy with the street address information but the BBL, with limited testing, seems to be more consistent.  There are edge cases I've found that show a record to have street address information that does not match the BBL information (the "un-match" being verified by a reverse-search)

results A:
```
{"borough":"3","block":"962","lot":"36","street_number":"240","street_name":"6TH AVENUE"}
{"borough":"3","block":"962","lot":"36","street_number":"240","street_name":"6 AVENUE"}
{"borough":"3","block":"962","lot":"36"}
{"borough":"3","block":"962","lot":"36","street_number":"240","street_name":"SIXTH AVE"}
{"borough":"3","block":"962","lot":"36","street_number":"240","street_name":"SIXTH AVENUE"}
```

results B: 

```
{"borough":"3","block":"962","lot":"36","street_number":"240","street_name":"6 AVENUE"}
```


**4. Debugging and Validation**
If the integration does not work as expected, follow these steps to debug:

**Step 4.1: Check the Network Tab**

- Open your browser's developer tools and go to the "Network" tab.
- Submit the form and check the network request to `http://localhost:3001/queryAcrisAddressParcel/fetchRecord`.
- Verify that the request is sent with the correct query parameters and that the response contains the expected data.

**Step 4.2: Check the Console Logs**

- Look for `console.debug` and `console.error` logs in both the frontend and backend to identify any issues.

**Step 4.3: Handle Errors Gracefully**

- Update the `AddressParcelLookup` component to handle errors gracefully:

```js
async function search(searchTerms) {
  try {
    const results = await SnacrisApi.queryAcrisAddressParcel(searchTerms);
    setResults(results);
  } catch (err) {
    console.error("Error fetching results:", err);
    setResults([]);
  }
}
```

**5. Summary of Steps**

1. Backend:

- Test the `/queryAcrisAddressParcel/fetchRecord` endpoint to ensure it works as expected.
- Confirm the route is registered in `app.js`.

1. Frontend:

- Add the `queryAcrisAddressParcel` method to `api.js`.
- Update the `AddressParcelLookup` component to call this method.

1. Testing:

- Start both the backend and frontend servers.
- Navigate to `/addressParcelLookup` and test the form submission.

---

- [x] Refactor the `RoutesList.js` and `Navigation.js` components keeping the `user` and `authentication` related routes and replacing Jobly routes such as `/companies`, `/jobs` and `/companies/:handle` with Snacris routes such as `/bblAddressLookup`, `/partyName`, `/parcelIdentifier`, `/documentType`, `/documentIdCrfn`, `/transactionNumber`, `/reelPage` and `/uccFedLienFileNumber`.
- Refactor the `CompanyList`, `JobList` and `CompanyDetail` components to render ACRIS data

### `companies` folder

- [ ] Review the `CompanyList.js`, `CompanyDetail.js` and `CompanyCard.js` components to see how they can be refactored to fit the ACRIS data.

- `CompanyList.js` is responsible for displaying a list of companies. It fetches the company data from the backend and renders a list of `CompanyCard` components, one for each company.

  - How It Works:
    - 1. State Management: `companies` is a state variable that holds the list of companies fetched from the backend which is initially set to `null`.
    - 2. Fetching Data on Mount: the `useEffect` hook runs when the component mounts which calls the `search()` function to fetch all companies from the backend using the `JoblyApi.getCompanies()` method.
    - 3. Search Functionality: the `SearchForm` component allows users to filter companies by name. When the search form is submitted, the `search()` function is called with the search term, and the list of companies is updated.
    - 4. Rendering: If `companies` is `null`, a `LoadingSpinner` is displayed while data is being fetched. If companies are found, a list of `CompanyCard` components is rendered. If no companies match the search, a message is displayed: "Sorry, no results were found!"
  - Interaction with other components:
    - `SearchForm`:
      - Provides the search functionality.
      - Calls the `search()` function in `CompanyList` with the search term.
    - `CompanyCard`:
      - Each company in the list is rendered as a `CompanyCard` component.

- `CompanyCard.js` is a presentational component that displays a summary of a single company. It is rendered by `CompanyList.js` for each company in the list.

  - How It Works:
    - 1. Props: Receives `name`, `description`, `logoUrl`, and `handle` as props from `CompanyList.js`.
    - 2. Rendering: Displays the company’s `name`, `description`, and `logo` (if available) and wraps the content in a `Link` component from `react-router-dom`, which navigates to the `CompanyDetail` page for the specific company when clicked.
    - 3. Dynamic Routing: The `to` prop of the `Link` component is set to `/companies/${handle}` which ensures that clicking on a company card navigates to the `CompanyDetail` page for that company.
  - Interaction with Other Components:
    - `CompanyList`: `CompanyCard` is rendered by `CompanyList` for each company in the list.
    - `CompanyDetail`: Clicking on a `CompanyCard` navigates to the `CompanyDetail` page for the selected company.

- `CompanyDetail.js` displays detailed information about a single company, including its associated jobs. It is rendered when the user navigates to `/companies/:handle`.

  - How It Works:
    - 1. Dynamic Routing: Uses the `useParams` hook from `react-router-dom` to extract the `handle` parameter from the URL which is used to fetch the details of the specific company from the backend.
    - 2. State Management: `company` is a state variable that holds the details of the company fetched from the backend which is initially set to `null`.
    - 3. Fetching Data: the `useEffect` hook runs when the component mounts or when the `handle` changes and calls `JoblyApi.getCompany(handle)` to fetch the company details, including its associated jobs.
    - 4. Rendering: if `company` is `null`, a `LoadingSpinner` is displayed while data is being fetched. Once the data is loaded, the company’s name and description are displayed. The `JobCardList` component is used to render a list of jobs associated with the company.
  - Interaction with Other Components:
    - JobCardList displays a list of jobs associated with the company and each job is rendered as a `JobCard` component.
  - Interaction with the Backend:
    - Calls `JoblyApi.getCompany(handle)` to fetch the details of the company, including its jobs.
    - The backend responds with an object containing: `name` (the name of the company), `description` (description of the company) and `jobs` (an array of job objects associated with the company).

- How `CompanyList.js`, `CompanyDetail.js` and `CompanyCard.js` work together:

  - 1. Flow of Data:
    - `CompanyList.js` fetches a list of companies from the backend and renders a `CompanyCard` for each company.
    - Each `CompanyCard` links to the `CompanyDetail` page for the specific company.
    - `CompanyDetail.js` fetches detailed information about the selected company, including its jobs, and displays it.
  - 2. Routing:
    - `CompanyList.js` is rendered at `/companies`.
    - Clicking on a `CompanyCard` navigates to `/companies/:handle`, where `CompanyDetail.js` is rendered.
  - 3. Backend Interaction:
    - `CompanyList.js` calls `JoblyApi.getCompanies()` to fetch the list of companies.
    - `CompanyDetail.js` calls `JoblyApi.getCompany(handle)` to fetch the details of a specific company.
  - 4. User Experience:
    - The user sees a list of companies on the `/companies` page.
    - They can search for companies using the `SearchForm`.
    - Clicking on a company card navigates to a detailed view of the company, including its jobs.

- Database Interaction

  - 1. `JoblyApi.getCompanies(name)`:
    - Sends a `GET` request to `/companies`.
    - If a `name` is provided, it is sent as a query parameter (e.g., `/companies?name=tech`).
    - The backend responds with a list of companies matching the filter.
  - 2. `JoblyApi.getCompany(handle)`:
    - Sends a `GET` request to `/companies/:handle`.
    - The backend responds with the details of the company, including its associated jobs.
  - 3. Data Presentation:
    - The data fetched from the backend is passed down as props to the components (`CompanyCard` and `JobCardList`) for rendering.

- Summary
  - `CompanyList.js`: Fetches and displays a list of companies using `CompanyCard` components.
  - `CompanyCard.js`: Displays a summary of a single company and links to its detailed view.
  - `CompanyDetail.js`: Fetches and displays detailed information about a single company, including its jobs.

### `homepage` folder

### `jobs` folder

_for now skip because it won't be necessary for how SNACRIS will behave_

Know that the relationship between companies and jobs is a one-to-many relationship.

### `profiles` folder

_you shouldn't need to refactor this since you have a `users` table on the backend with the matching information_

- `ProfileForm.js` is a component responsible for allowing a logged-in user to update their profile information (e.g., first name, last name, email) and saving these changes to the database. Here's a detailed breakdown of how it works in the context of the application.
  - 1. Context and State Management
    - React Context (`UserContext`):
      - The `UserContext` provides access to the `currentUser` object and the `setCurrentUser` function.
      - `currentUser` contains the currently logged-in user's data (e.g., `username`, `firstName`, `lastName`, `email`).
      - `setCurrentUser` is used to update the global user state after a successful profile update.
    - Local State (`formData`, `formErrors`, `saveConfirmed`)
      - `formData`:
        - Holds the values of the form fields (`firstName`, `lastName`, `email`, `username`).
        - Initialized with the current user's data from `UserContext`.
      - `formErrors`:
        - Stores any validation or API errors that occur during form submission.
      - `saveConfirmed`:
        - A boolean that indicates whether the profile update was successful. Used to display a success message.
  - 2. Form Rendering
    - The form includes fields for `firstName`, `lastName`, and `email`, which are editable.
    - The `username` field is displayed but disabled, as it cannot be changed.
    - The form dynamically displays:
      - An error alert (`Alert` component) if there are validation errors.
      - A success alert if the profile update is successful.
  - 3. Handling Form Changes
    - `handleChange` Function
    - Triggered whenever the user types into a form field.
    - Updates the corresponding field in the `formData` state:
    - Clears any previous errors (`formErrors`) when the user starts typing.
  - 4. Submitting the Form
    - `handleSubmit` Function
      - Triggered when the user clicks the "Save Changes" button.
      - Prevents the default form submission behavior: `evt.preventDefault();`
    - Preparing Data
      - Extracts the updated `firstName`, `lastName`, and `email` from `formData` to send to the backend:
    - Calling the API
      - Calls the `SnacrisApi.saveProfile` method to send the updated data to the backend: `updatedUser = await SnacrisApi.saveProfile(username, profileData);`
    - Updating State
      - If the API call is successful:
        - Clears any previous errors.
        - Sets `saveConfirmed` to `true` to display a success message.
        - Updates the global `currentUser` state using `setCurrentUser`
    - 5. Interaction with the Backend
      - API Call (`SnacrisApi.saveProfile`)
        - Sends a `PATCH` request to the backend endpoint `/users/:username` with the updated profile data.
        - The backend updates the user's information in the database and responds with the updated user object.
      - Backend Response
        - If the update is successful, the backend returns the updated user data.
        - If there are validation errors (e.g., invalid email format), the backend responds with an error message, which is displayed in the form.
    - 6. User Feedback
      - Error Handling:
        - If there are errors during the API call, they are displayed using the `Alert` component.
      - Success Message:
        - If the update is successful, a success message is displayed.
    - 7. Data Flow
      - Initial Data: The form is pre-filled with the current user's data from `UserContext`.
      - User Interaction: The user edits the form fields and clicks "Save Changes."
      - API Call: The updated data is sent to the backend via `SnacrisApi.saveProfile`.
      - Backend Update: The backend updates the user's information in the database and returns the updated user object.
      - State Update:
        - The global `currentUser` state is updated with the new user data.
        - The form displays a success message.
    - 8. Summary
      - Purpose: Allows users to update their profile information.
      - Frontend-Backend Interaction:
        - Sends a `PATCH` request to the backend to update the user's data.
        - Updates the global user state with the new data.
      - User Feedback:
        - Displays error messages for validation issues.
        - Shows a success message upon successful update.
      - Key Components:
        - `UserContext`: Provides access to the current user's data and allows updating it globally.
        - `SnacrisApi.saveProfile`: Handles the API call to save the updated profile data.
        - `Alert`: Displays error or success messages.

### `routes-nav` folder

I want to understand the `Navigation.js` code below in terms of how it works in the context of the application such as `App.js`, `UserContext.js` and `RoutesList.js`. I'm especially interested in how it dynamically renders components based on whether the user is logged in or not logged in and how the jwt authentication token is linked to the database integrate these components together.

#### How `Navigation.js` Works in the Context of the Application

The `Navigation.js` component dynamically renders navigation links based on whether the user is logged in or not. It integrates with `App.js`, `UserContext.js`, and `RoutesList.js` to determine the user's authentication status and provide appropriate navigation options.

##### 1. `Navigation.js` Integration with `App.js`

**Purpose of `App.js`**: the central component of the application. It manages global state, including the `currentUser` and `token`, and provides this state to the rest of the app via `UserContext`.

**How `Navigation.js` Uses `App.js`**: `App.js` wraps the entire application in a `UserContext.Provider` which makes the `currentUser` object (and other helper functions) available to `Navigation.js` via the `useContext` hook.

**Dynamic Rendering in `Navigation.js`**:

- `Navigation.js` uses `useContext(UserContext)` to access the `currentUser` object:

```javascript
const { currentUser } = useContext(UserContext);
```

- Based on whether `currentUser` is `null` or contains user data:
  - If `currentUser` exists (user is logged in), the `loggedInNav()` function renders links to protected pages (e.g., `/companies`, `/jobs`, `/profile`).
  - If `currentUser` is `null` (user is not logged in), the `loggedOutNav()` function renders links to `/login` and `/signup`.

##### 2. `Navigation.js` Integration with `UserContext.js`

**Purpose of `UserContext.js`**

- `UserContext.js` creates a React Context to share the `currentUser` object and related functions across the application without prop drilling.

**How Navigation.js Uses UserContext.js**

- `Navigation.js` consumes the `UserContext` to determine the user's authentication status:

```javascript
const { currentUser } = useContext(UserContext);
```

- This allows Navigation.js to dynamically render navigation links based on whether the user is logged in or not.

##### 3. `Navigation.js` Integration with `RoutesList.js`

**Purpose of `RoutesList.js`**

- `RoutesList.js` defines the application's routes and determines which pages are accessible based on the user's authentication status.

**How `Navigation.js` and `RoutesList.js` Work Together**

- Both components rely on the `currentUser` object to determine the user's authentication status:
  - `Navigation.js` uses `currentUser` to render appropriate navigation links.
  - `RoutesList.js` uses `currentUser` to restrict access to certain routes:

```javascript
{
  !currentUser && (
    <>
      <Route path="/login" element={<LoginForm login={login} />} />
      <Route path="/signup" element={<SignupForm signup={signup} />} />
    </>
  );
}

{
  currentUser && (
    <>
      <Route path="/companies" element={<CompanyList />} />
      <Route path="/jobs" element={<JobList />} />
      <Route path="/companies/:handle" element={<CompanyDetail />} />
      <Route path="/profile" element={<ProfileForm />} />
    </>
  );
}
```

- Together, these components ensure that:
  - Navigation links and routes are consistent with the user's authentication status.
  - Unauthorized users cannot access protected pages.

##### 4. JWT Authentication and Database Integration

**How the JWT Token Works**

- The JWT token is stored in `localStorage` and managed by `App.js` using the `useLocalStorage` hook:

```javascript
const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);
```

- When a user logs in or signs up, the token is retrieved from the backend and stored:

```javascript
async function login(loginData) {
  let token = await SnacrisApi.login(loginData);
  setToken(token);
}
```

- The token is decoded using `jwt-decode` to extract the `username`:

```javascript
let { username } = decode(token);
```

- The token is also set in the `SnacrisApi` class for authenticated API requests:

```javascript
SnacrisApi.token = token;
```

**How the Token Links to the Database**

- The token is sent with every API request in the `Authorization` header:

```javascript
const headers = { Authorization: `Bearer ${SnacrisApi.token}` };
```

- The backend validates the token and uses the `username` encoded in the token to fetch user data from the database.

**How This Integrates with `Navigation.js`**

- When the user logs in, the `currentUser` object is updated with data fetched from the backend:

```javascript
let currentUser = await SnacrisApi.getCurrentUser(username);
setCurrentUser({
  infoLoaded: true,
  data: currentUser,
});
```

- This triggers a re-render of `Navigation.js`, which dynamically updates the navigation links to reflect the user's logged-in status.

##### 5. Summary of Dynamic Rendering

1. Logged-In State:

- `currentUser` contains user data.
- `Navigation.js` renders links to `/companies`, `/jobs`, `/profile`, and a logout link.
- `RoutesList.js` allows access to protected routes.

2. Logged-Out State:

- `currentUser` is `null`.
- `Navigation.js` renders links to `/login` and `/signup`.
- `RoutesList.js` restricts access to protected routes and only allows access to public routes.

3. JWT Token:

- Links the frontend to the backend by authenticating API requests.
- Ensures that only authorized users can access protected resources.

##### 6. How These Components Work Together

1. `App.js`:

- Manages global state (`currentUser`, `token`) and provides it via `UserContext`.
- Handles login, signup, and logout functionality.

2. `UserContext.js`:

- Shares the `currentUser` object and related functions across the application.

3. `Navigation.js`:

- Dynamically renders navigation links based on the `currentUser` state.

4. `RoutesList.js`:

- Restricts access to routes based on the `currentUser` state.

5. JWT Token:

- Authenticates API requests and links the frontend to the backend database.

## `App.js` Overview

### Purpose

`App.js` is the core of your React application. It manages the global state, handles user authentication, and provides the main structure of the app. It interacts with the backend to fetch and update user data and job-related information.

### Key Features

1. Global State Management:

   - `currentUser`: Stores the logged-in user's data (or `null` if no user is logged in).
   - `applicationIds`: A set of job IDs the user has applied to.
   - `token`: The JWT token used for authenticated API requests, stored in `localStorage` via the `useLocalStorage` hook.

2. Authentication:

   - `signup` and `login` functions handle user registration and login by interacting with the backend via `JoblyApi.signup` and `JoblyApi.login`.
   - The JWT token is stored in `localStorage` and used for subsequent API requests.

3. Fetching User Data:

   - On app load (or when the token changes), the `useEffect` hook fetches the current user's data from the backend using `JoblyApi.getCurrentUser`.

4. Context Provider:

   - The `UserContext.Provider` wraps the app, making `currentUser`, `hasAppliedToJob`, and `applyToJob` accessible to all components.

5. Routing:
   - The `RoutesList` component defines the app's routes, determining which pages are accessible based on the user's authentication status.

### How It Interacts with the Backend

- Calls the backend API (via `JoblyApi`) to:
  - Fetch user data (`getCurrentUser`).
  - Handle login and signup (`login`, `signup`).
  - Apply to jobs (`applyToJob`).

## `index.js` Overview

### Purpose

`index.js` is the entry point of your React application. It renders the `App` component into the DOM and sets up the `BrowserRouter` for client-side routing.

### Key Features

1. ReactDOM Rendering:

   - Uses ReactDOM.createRoot to render the App component into the #root element in index.html.

2. Routing Setup:
   - Wraps the App component in a BrowserRouter to enable React Router for navigation.

### How It Interacts with the Backend

- `index.js` itself does not directly interact with the backend. It initializes the app and sets up routing, leaving backend interactions to `App.js` and other components.

## `api.js` Overview

### Purpose

`api.js` is a utility module that centralizes all API interactions. It defines a `JoblyApi` class with static methods for making HTTP requests to the backend.

### Key Features

1. Base URL:

   - The `BASE_URL` is set to the backend server's address (`http://localhost:3001` by default) or an environment variable (`REACT_APP_BASE_URL`).

2. Token Management:

   - The `JoblyApi.token` static property stores the JWT token for authenticated requests.

3. Request Method:

   - `request(endpoint, data, method)`: A helper method that constructs and sends HTTP requests using `axios`. It includes the JWT token in the `Authorization` header for authenticated requests.

4. API Endpoints:
   - Methods like `getCurrentUser`, `getCompanies`, `getJobs`, `applyToJob`, `login`, and `signup` correspond to backend API routes.

### How It Interacts with the Backend

- Sends HTTP requests to the backend for:
  - User authentication (`auth/token`, `auth/register`).
  - Fetching user data (`users/:username`).
  - Fetching and applying to jobs (`jobs`, `users/:username/jobs/:id`).
  - Fetching company data (`companies`, `companies/:handle`).

### How to Configure for Your Backend

To make this frontend work with your backend, you need to ensure the following:

1. Set the Correct Backend URL
   - Update the `BASE_URL` in `api.js` to point to your backend server. For example:

```js
const BASE_URL =
  process.env.REACT_APP_BASE_URL || "http://your-backend-url.com";
```

2. Ensure API Endpoints Match:

   - Verify that the backend API routes match the ones used in `api.js`. For example:
     - `/auth/token` for login.
     - `/auth/register` for signup.
     - `/users/:username` for fetching user data.
     - `/jobs` and `/companies` for job and company data.

3. Environment Variables:
   - If your backend URL changes between development and production, use an `.env` file to set `REACT_APP_BASE_URL`. For example:

```
REACT_APP_BASE_URL=http://your-backend-url.com
```

4. CORS Configuration:

   - Ensure your backend allows CORS (Cross-Origin Resource Sharing) for requests from the frontend's domain.

5. JWT Token Handling:
   - Confirm that the backend generates and validates JWT tokens correctly. The frontend expects the token in the `Authorization` header as `Bearer <token>`.

By ensuring these configurations, your frontend will seamlessly communicate with your backend.

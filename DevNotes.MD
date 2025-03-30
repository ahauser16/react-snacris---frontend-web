# Refactor Notes

This README will document my refactor of the React Jobly frontend to work as the frontend for my SNACRIS website.  I need to refamiliarize myself with how the React Jobly frontend is configured to work with th ebackend so I will research how `App.js`, `index.js` and `api.js` work and make notes below.

## To Do List

### `api` folder
- [x] Update the `BASE_URL` in `api.js` to point to your backend server.
- Verify that the backend API routes match the ones used in `api.js` and remove Jobly-specific endpoints & add Snacris-specific endpoints:
  - [ ] `POST /auth/token` for the `login` route (Ensure Match)
    - How It Works:
      - 1. Sends a `POST` request to the `/auth/token` endpoint with the user's `username` and `password` in the request body.
      - 2. The backend validates the credentials and responds with a JWT token.
      - 3. Used in the frontend `LoginForm` component to log in a user.
      - 4. Used in the backend route: `POST /auth/token`.
  - [ ] `POST /auth/register` for the `signup` route (Ensure Match)
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
- [ ] study and refactor `SearchForm.js` to use with this application and maybe refactor the input fields.  You could just copy the format you used in the chrome extension.

- Refactor the `RoutesList.js` and `Navigation.js` components keeping the `user` and `authentication` related routes and replacing Jobly routes such as `/companies`, `/jobs` and `/companies/:handle` with Snacris routes such as `/bblAddressLookup`, `/partyName`, `/parcelIdentifier`, `/documentType`, `/documentIdCrfn`, `/transactionNumber`, `/reelPage` and `/uccFedLienFileNumber`.
- Refactor the `CompanyList`, `JobList` and `CompanyDetail` components to render ACRIS data

### `companies` folder
- [ ] Review the `CompanyList.js`, `CompanyDetail.js` and `CompanyCard.js` components to see how they can be refactored to fit the ACRIS data.

- `CompanyList.js` is responsible for displaying a list of companies. It fetches the company data from the backend and renders a list of `CompanyCard` components, one for each company.
  - How It Works:
    - 1. State Management: `companies` is a state variable that holds the list of companies fetched from the backend which is initially set to `null`.
    - 2. Fetching Data on Mount: the `useEffect` hook runs when the component mounts which calls the `search()` function to fetch all companies from the backend using the `JoblyApi.getCompanies()` method.
    - 3. Search Functionality: the `SearchForm` component allows users to filter companies by name.  When the search form is submitted, the `search()` function is called with the search term, and the list of companies is updated.
    - 4. Rendering: If `companies` is `null`, a `LoadingSpinner` is displayed while data is being fetched.  If companies are found, a list of `CompanyCard` components is rendered.  If no companies match the search, a message is displayed: "Sorry, no results were found!"
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
    - 4. Rendering: if `company` is `null`, a `LoadingSpinner` is displayed while data is being fetched.  Once the data is loaded, the company’s name and description are displayed.  The `JobCardList` component is used to render a list of jobs associated with the company.
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

*for now skip because it won't be necessary for how SNACRIS will behave*

Know that the relationship between companies and jobs is a one-to-many relationship.

### `profiles` folder

*you shouldn't need to refactor this since you have a `users` table on the backend with the matching information*

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
const BASE_URL = process.env.REACT_APP_BASE_URL || "http://your-backend-url.com";
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
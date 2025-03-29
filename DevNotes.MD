# Refactor Notes

This README will document my refactor of the React Jobly frontend to work as the frontend for my SNACRIS website.  I need to refamiliarize myself with how the React Jobly frontend is configured to work with th ebackend so I will research how `App.js`, `index.js` and `api.js` work and make notes below.

## To Do List

**`api` folder**
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

**`auth` folder**
no refactor required

**`common` folder**
- [ ] study and refactor `SearchForm.js` to use with this application and maybe refactor the input fields.  You could just copy the format you used in the chrome extension.

- Refactor the `RoutesList.js` and `Navigation.js` components keeping the `user` and `authentication` related routes and replacing Jobly routes such as `/companies`, `/jobs` and `/companies/:handle` with Snacris routes such as `/bblAddressLookup`, `/partyName`, `/parcelIdentifier`, `/documentType`, `/documentIdCrfn`, `/transactionNumber`, `/reelPage` and `/uccFedLienFileNumber`.
- Refactor the `CompanyList`, `JobList` and `CompanyDetail` components to render ACRIS data


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
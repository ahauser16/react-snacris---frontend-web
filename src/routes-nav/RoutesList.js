import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Homepage from "../homepage/Homepage";
// import CompanyList from "../pages/companies/CompanyList";
// import JobList from "../pages/jobs/JobList";
// import CompanyDetail from "../pages/companies/CompanyDetail";
import AddressParcelLookup from "../common/acrisForms/addressParcelLookup";
import PartyNameSearch from "../common/acrisForms/partyNameSearch";
import ParcelIdentifierSearch from "../common/acrisForms/parcelIdentifierSearch";
import DocumentTypeSearch from "../common/acrisForms/documentTypeSearch";
import DocumentIdCrfnSearch from "../common/acrisForms/documentIdCrfnSearch";
import TransactionNumberSearch from "../common/acrisForms/transactionNumberSearch";
import ReelPageSearch from "../common/acrisForms/reelPageSearch";
import UccFedLienFileNumberSearch from "../common/acrisForms/uccFedLienFileNumberSearch";
import LoginForm from "../auth/LoginForm";
import ProfileForm from "../profiles/ProfileForm";
import SignupForm from "../auth/SignupForm";

/** Site-wide routes.
 *
 * Parts of site should only be visitable when logged in.
 *
 * Visiting a non-existant route navigates to the homepage.
 */

// The RoutesList.js component is responsible for defining the routing structure of the application. It uses React Router's `Routes` and `Route` components to define the different routes available in the application. The `RoutesList` component takes in `login`, `signup`, and `currentUser` as props, which are used to determine which routes should be displayed based on the user's authentication status. The `RoutesList` component is rendered within the main application component (App.js) and is responsible for rendering the appropriate components based on the current URL path.
function RoutesList({ login, signup, currentUser }) {
  console.debug(
    "Routes",
    `login=${typeof login}`,
    `register=${typeof register}`
  );

  return (
    <div className="pt-5">
      <Routes>
        {/* The code `!currentUser` checks if the user is not logged in. If the user is not logged in, it renders the LoginForm and SignupForm components, allowing the user to log in or sign up.*/}
        {!currentUser && (
          <>
            {/*The `Route` component is used to define the path and the corresponding component to render when that path is accessed. For example, when the user navigates to "/login", the LoginForm component will be displayed, and when they navigate to "/signup", the SignupForm component will be displayed. */}
            <Route path="/login" element={<LoginForm login={login} />} />
            <Route path="/signup" element={<SignupForm signup={signup} />} />
          </>
        )}

        {/* The `Route` component is used to define the path and the corresponding component to render when that path is accessed. For example, when the user navigates to "/", the Homepage component will be displayed. */}
        <Route path="/" element={<Homepage />} />

        {/* The `Route` component is used to define the path and the corresponding component to render when that path is accessed. For example, when the user navigates to "/companies", the CompanyList component will be displayed, and when they navigate to "/jobs", the JobList component will be displayed. */}
        {currentUser && (
          <>
            {/* <Route path="/companies" element={<CompanyList />} />
            <Route path="/jobs" element={<JobList />} />
            <Route path="/companies/:handle" element={<CompanyDetail />} /> */}

            <Route path="/addressParcelLookup" element={<AddressParcelLookup />} />
            <Route path="/partyNameSearch" element={<PartyNameSearch />} />
            <Route path="/parcelIdentifierSearch" element={<ParcelIdentifierSearch />} />
            <Route path="/documentTypeSearch" element={<DocumentTypeSearch />} />
            <Route path="/documentIdCrfnSearch" element={<DocumentIdCrfnSearch />} />
            <Route path="/transactionNumberSearch" element={<TransactionNumberSearch />} />
            <Route path="/reelPageSearch" element={<ReelPageSearch />} />
            <Route path="/uccFedLienFileNumberSearch" element={<UccFedLienFileNumberSearch />} />
            <Route path="/profile" element={<ProfileForm />} />
          </>
        )}

        {/* The code below is a React Router configuration that defines a fallback route with the following elements: (1) the <Route> component is used to define a single route in your application and specifies the path to match and the element to render when the path matches, (2) the path="*" is a wildcard route, meaning it will match any URL that does not match any of the other defined routes and is typically used as a "catch-all" route to handle undefined or invalid paths, (3) the element={<Navigate to="/" />} specifies what should happen when the wildcard route is matched, (4) the <Navigate> component is a utility provided by React Router that programmatically redirects the user to a different route and in this case it redirects the user to the root path ("/").
Purpose: This route acts as a safeguard to ensure that users are not left on a blank or broken page if they navigate to an invalid URL. Instead, they are redirected to the home page ("/"). This improves the user experience by providing a fallback behavior.
Practical Use:
This pattern is commonly used in React applications to handle 404-like scenarios. For example, if a user tries to access a non-existent page, this route will catch the invalid path and redirect them to a valid page (in this case, the home page).
Suggested Refactor: 
If you want to provide a more user-friendly experience, you could replace the <Navigate> component with a custom "404 Not Found" page that informs the user about the invalid URL while still offering navigation options. */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default RoutesList;

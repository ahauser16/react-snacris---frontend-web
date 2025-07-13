import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import UserContext from "../auth/UserContext";
import "./Navigation.css";

/** Navigation bar for site. Shows up on every page.
 *
 * When user is logged in, shows links to main areas of site. When not,
 * shows link to Login and Signup forms.
 *
 * Rendered by App.
 */

//The Navigation.js component dynamically renders navigation links based on whether the user is logged in or not. It integrates with `App.js`, `UserContext.js`, and `RoutesList.js` to determine the user's authentication status and provide appropriate navigation options.

//How Navigation.js Uses App.js: App.js wraps the entire application in a UserContext.Provider which makes the `currentUser` and `setCurrentUser, object available to the Navigation component.  The `logout` function is made available to the Navigation.js component via the `logout` prop passed from App.js. This allows the Navigation component to call the logout function when the user clicks the "Log out" link, effectively logging them out of the application.

function Navigation({ logout }) {
  // The Navigation component uses the `currentUser` object to determine whether the user is logged in or not, and conditionally renders the appropriate navigation links based on that status.
  const { currentUser } = useContext(UserContext);
  console.debug("Navigation", "currentUser=", currentUser);

  function loggedInNav() {
    return (
      <ul className="navbar-nav ms-auto">
        <li className="nav-item me-4">
          <NavLink className="nav-link" to="/addressParcelLookup">
            Address & Parcel Lookup
          </NavLink>
        </li>
        <li className="nav-item me-4">
          <NavLink className="nav-link" to="/partyNameSearch">
            Party Name
          </NavLink>
        </li>
        <li className="nav-item me-4">
          <NavLink className="nav-link" to="/ParcelIdentifierSearch">
             Parcel Search
          </NavLink>
        </li>
        <li className="nav-item me-4">
          <NavLink className="nav-link" to="/documentTypeSearch">
            Document Type
          </NavLink>
        </li>
        <li className="nav-item me-4">
          <NavLink className="nav-link" to="/documentIdCrfnSearch">
            Doc ID & CRFN
          </NavLink>
        </li>
        <li className="nav-item me-4">
          <NavLink className="nav-link" to="/transactionNumberSearch">
            Transaction Number
          </NavLink>
        </li>
        <li className="nav-item me-4">
          <NavLink className="nav-link" to="/reelPageSearch">
            Reel & Page
          </NavLink>
        </li>
        <li className="nav-item me-4">
          <NavLink className="nav-link" to="/uccFedLienFileNumberSearch">
            UCC & Federal Lien File Number
          </NavLink>
        </li>
        <li className="nav-item me-4">
          <NavLink className="nav-link" to="/favorites">
            Favorites
          </NavLink>
        </li>
        <li className="nav-item me-4">
          <NavLink className="nav-link" to="/profile">
            Profile
          </NavLink>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/" onClick={logout}>
            Log out {currentUser.first_name || currentUser.username}
          </Link>
        </li>
      </ul>
    );
  }

  function loggedOutNav() {
    return (
      <ul className="navbar-nav ms-auto">
        <li className="nav-item me-4">
          <NavLink className="nav-link" to="/login">
            Login
          </NavLink>
        </li>
        <li className="nav-item me-4">
          <NavLink className="nav-link" to="/signup">
            Sign Up
          </NavLink>
        </li>
      </ul>
    );
  }

  return (
    <nav className="Navigation navbar navbar-expand-md">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          SNACRIS
        </Link>
        {currentUser ? loggedInNav() : loggedOutNav()}
      </div>
    </nav>
  );
}

export default Navigation;

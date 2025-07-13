import React, { useState, useEffect } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import Navigation from "./routes-nav/Navigation";
import RoutesList from "./routes-nav/RoutesList";
import LoadingSpinner from "./common/LoadingSpinner";
import SnacrisApi from "./api/api";
import UserContext from "./auth/UserContext";
import decode from "jwt-decode";
import { Helmet } from "react-helmet";

export const TOKEN_STORAGE_ID = "snacris-token";

/** Snacris application.
 * - currentUser: user obj from API. This becomes the canonical way to tell
 *   if someone is logged in. This is passed around via context throughout app,
 *   infoLoaded: has user data been pulled from API?
 * - token: for logged in users, this is their authentication JWT.
 *   Is required to be set for most API calls. This is initially read from
 *   localStorage and synced to there via the useLocalStorage hook.
 *
 *  App -> Routes
 */

function App() {
  const [currentUser, setCurrentUser] = useState({
    data: null,
    infoLoaded: false,
  });
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);

  console.debug("App", "currentUser=", currentUser, "token=", token);

  // Load user info from API. Until a user is logged in and they have a token, this should not run. It only needs to re-run when a user logs out, so the value of the token is a dependency for this effect.
  useEffect(
    function loadUserInfo() {
      console.debug("App useEffect loadUserInfo", "token=", token);

      async function getCurrentUser() {
        if (token) {
          try {
            let { username } = decode(token);
            // put the token on the Api class so it can use it to call the API.
            SnacrisApi.token = token;
            let currentUser = await SnacrisApi.getCurrentUser(username);

            setCurrentUser({
              infoLoaded: true,
              data: currentUser,
            });
          } catch (err) {
            console.error("App loadUserInfo: problem loading", err);
            setCurrentUser({
              infoLoaded: true,
              data: null,
            });
          }
        } else {
          setCurrentUser({
            infoLoaded: true,
            data: null,
          });
        }
      }
      getCurrentUser();
    },
    [token]
  );

  /** Handles site-wide logout. */
  //The `logout` function is responsible for logging the user out of the application. It clears the token from local storage, resets the current user state, and clears the set of application IDs.
  //The `logout` function is NOT made available to the `Navigation` component via the `UserContext.Provider`.  Instead, it is passed directly to the `Navigation` component as a prop. This is because the `logout` function does not need to be accessed by any other components in the application, and passing it as a prop keeps the code cleaner and more focused.
  function logout() {
    setCurrentUser({
      infoLoaded: true,
      data: null,
    });
    setToken(null);
  }

  /** Handles site-wide signup.
   *
   * Automatically logs them in (set token) upon signup.
   *
   * Make sure you await this function to see if any error happens. */
  //The `signup` function is responsible for signing up a new user. It takes the `signupData` as an argument, calls the `SnacrisApi.signup` method to create a new user, and then sets the `token` in local storage using the `setToken` function.  This function is also NOT made available to the `Navigation` component via the `UserContext.Provider`.  Instead, it is passed directly to the `RoutesList` component as a prop. This is because the `signup` function does not need to be accessed by any other components in the application, and passing it as a prop keeps the code cleaner and more focused.
  async function signup(signupData) {
    let token = await SnacrisApi.signup(signupData);
    setToken(token);
  }

  /** Handles site-wide login.
   *
   * Logs in a user
   *
   * Make sure you await this function to see if any error happens.
   */

  //The `login` function is responsible for logging in a user. It takes the `loginData` as an argument, calls the `SnacrisApi.login` method to authenticate the user, and then sets the `token` in local storage using the `setToken` function.  This function is also NOT made available to the `Navigation` component via the `UserContext.Provider`.  Instead, it is passed directly to the `RoutesList` component as a prop. This is because the `login` function does not need to be accessed by any other components in the application, and passing it as a prop keeps the code cleaner and more focused.
  async function login(loginData) {
    let token = await SnacrisApi.login(loginData);
    setToken(token);
  }

  if (!currentUser.infoLoaded) return <LoadingSpinner />;

  return (
    <UserContext.Provider
      value={{
        currentUser: currentUser.data,
        setCurrentUser,
      }}
    >
      <div className="App">
        <Helmet>
          <title>🗽SNACRIS</title>
          <meta
            name="description"
            content="Access New York City public land records with SNACRIS that uses a modern, responsive and accessible approach with the user in mind"
          />
          <meta
            name="keywords"
            content="New York City, NYC, public land records, NYC deed, NYC lease, NYC easement, ACRIS, property records, real estate, land registry, property search, deed search, mortgage records, title search, property database, real property, BBL, borough block lot, grantor, grantee, property transactions, real estate documents, property ownership"
          />
        </Helmet>
        <Navigation logout={logout} />
        <RoutesList
          currentUser={currentUser.data}
          login={login}
          signup={signup}
        />
      </div>
    </UserContext.Provider>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import Navigation from "./routes-nav/Navigation";
import RoutesList from "./routes-nav/RoutesList";
import LoadingSpinner from "./common/LoadingSpinner";
import SnacrisApi from "./api/api";
import UserContext from "./auth/UserContext";
import decode from "jwt-decode";

// Key name for storing token in localStorage for "remember me" re-login
export const TOKEN_STORAGE_ID = "snacris-token";

/** Snacris application.
 *
 * - applicationIds: for logged in users, this is a set of application Ids
 *   for applied jobs.
 *
 * - currentUser: user obj from API. This becomes the canonical way to tell
 *   if someone is logged in. This is passed around via context throughout app,
 *   infoLoaded: has user data been pulled from API?
 *
 * - token: for logged in users, this is their authentication JWT.
 *   Is required to be set for most API calls. This is initially read from
 *   localStorage and synced to there via the useLocalStorage hook.
 *
 *
 * App -> Routes
 */

function App() {
  //The `applicationIds` state and `setApplicationIds` function are used to manage
  //the set of application IDs for jobs that the user has applied to. This state is
  //initialized as an empty set and is updated whenever the user applies to a job.
  const [applicationIds, setApplicationIds] = useState(new Set([]));

  /*The `currentUser` state and `setCurrentUser` function are used to manage the current user's information. The `currentUser` state is initialized with an object containing `data` set to null and `infoLoaded` set to false. This indicates that the user information has not yet been loaded from the API.  The `infoLoaded` property is used to track whether the user information has been successfully retrieved from the API. Once the information is loaded, `infoLoaded` is set to true, and the `data` property is updated with the current user's information.  The `currentUser` state is passed to the `UserContext.Provider` so that it can be accessed by other components in the application. This allows for centralized management of the current user's information and makes it available throughout the app without needing to pass it down through props.  The `setCurrentUser` function is used to update the `currentUser` state when the user logs in or logs out. This function is also passed to the `UserContext.Provider` to allow other components to update the current user
  //information when necessary. */
  const [currentUser, setCurrentUser] = useState({
    data: null,
    infoLoaded: false,
  });
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);

  console.debug(
    "App",
    "applicationIds=",
    applicationIds,
    "currentUser=",
    currentUser,
    "token=",
    token
  );

  // Load user info from API. Until a user is logged in and they have a token,
  // this should not run. It only needs to re-run when a user logs out, so
  // the value of the token is a dependency for this effect.

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
            setApplicationIds(new Set(currentUser.applications));
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
    setApplicationIds(new Set([]));
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

  /** Checks if a job has been applied for. */
  // The `hasAppliedToJob` function checks if a job with the given ID has already been applied to by the user. It does this by checking if the ID is present in the `applicationIds` set. If the ID is found, it returns true, indicating that the user has already applied to that job. Otherwise, it returns false.  This function is made available to the `Navigation` component via the `UserContext.Provider` so that it can be used in other components that need to check if a job has been applied to.  This is because the `hasAppliedToJob` function is used in the `JobCard` component to determine whether to show the "Apply" button or not. By making it available in the context, it allows for a cleaner and more efficient way to check the application status without needing to pass it down through props.
  function hasAppliedToJob(id) {
    return applicationIds.has(id);
  }

  /** Apply to a job: make API call and update set of application IDs. */
// This `applyToJob` function is responsible for applying to a job with the given ID. It first checks if the user has already applied to the job using the `hasAppliedToJob` function. If the user has not applied yet, it calls the `SnacrisApi.applyToJob` method to submit the application. After successfully applying, it updates the `applicationIds` state to include the new job ID. This function is made available to the `Navigation` component via the `UserContext.Provider` so that it can be used in other components that need to apply for jobs. This is because the `applyToJob` function is used in the `JobCard` component to handle the application process when a user clicks the "Apply" button.
  async function applyToJob(id) {
    if (hasAppliedToJob(id)) return;
    //NB--> as part of debugging it was suggested to add the `await` keyword to the `applyToJob` function below (see notes in `README.MD` for context)
    //console.debug("applyToJob called with:", currentUser.data.username, id);
    //NB--> as part of debugging it was suggested to change the reference to `username` below from `currentUser.username` to `currentUser.data.username`.
    // await SnacrisApi.applyToJob(currentUser.username, id);
    await SnacrisApi.applyToJob(currentUser.data.username, id);
    setApplicationIds(new Set([...applicationIds, id]));
  }

  if (!currentUser.infoLoaded) return <LoadingSpinner />;

  return (
    //`App.js` is the central component of the application which manages global state including the `currentUser` and `token` and provides this state to the rest of the app via `UserContext` by wrapping the entire application in a `UserContext.Provider` to make the `currentUser`, `setCurrentUser`, `hasAppliedToJob`, and `applyToJob` functions available to all components that need it.
    <UserContext.Provider
      value={{
        currentUser: currentUser.data,
        setCurrentUser,
        hasAppliedToJob,
        applyToJob,
      }}
    >
      <div className="App">
      {/* The `Navigation` component is responsible for rendering the navigation bar, which includes links to different parts of the application and a logout button.  */}
        <Navigation logout={logout} />

        {/* The `RoutesList` component is responsible for rendering the appropriate routes based on the user's authentication status.  */}
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

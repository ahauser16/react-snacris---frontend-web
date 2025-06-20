import React, { useState, useContext } from "react";
import Alert from "../../common/Alert";
import SnacrisApi from "../../api/api";
//The UserContext provides access to the currentUser object and the setCurrentUser function.
import UserContext from "../../auth/UserContext";
import "./ProfileForm.css";

// eslint-disable-next-line
import useTimedMessage from "../../hooks/useTimedMessage";

/** Profile editing form.
 *
 * Displays profile form and handles changes to local form state.
 * Submitting the form calls the API to save, and triggers user reloading
 * throughout the site.
 *
 * Confirmation of a successful save is normally a simple <Alert>, but
 * you can opt-in to our fancy limited-time-display message hook,
 * `useTimedMessage`, but switching the lines below.
 *
 * Routed as /profile
 * Routes -> ProfileForm -> Alert
 */

function ProfileForm() {
  // currentUser contains the currently logged-in user's data (e.g., username, firstName, lastName, email).
  // setCurrentUser is used to update the global user state after a successful profile update.
  const { currentUser, setCurrentUser } = useContext(UserContext);

  // formData: Holds the values of the form fields (firstName, lastName, email, username).
  // formData: Initialized with the current user's data from UserContext.
  const [formData, setFormData] = useState({
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    email: currentUser.email,
    username: currentUser.username,
  });

  //formErrors: Stores any validation or API errors that occur during form submission.
  const [formErrors, setFormErrors] = useState([]);

  // saveConfirmed: A boolean that indicates whether the profile update was successful. Used to display a success message.
  // switch to use our fancy limited-time-display message hook.
  const [saveConfirmed, setSaveConfirmed] = useState(false);
  // const [saveConfirmed, setSaveConfirmed] = useTimedMessage()

  console.debug(
    "ProfileForm",
    "currentUser=",
    currentUser,
    "formData=",
    formData,
    "formErrors=",
    formErrors,
    "saveConfirmed=",
    saveConfirmed
  );

  /** on form submit:
   * - attempt save to backend & report any errors
   * - if successful
   *   - clear previous error messages
   *   - show save-confirmed message
   *   - set current user info throughout the site
   */

  //Submitting the Form with the `handleSubmit` function which is triggered when the user clicks the "Save Changes" button.
  async function handleSubmit(evt) {
    //Prevents the default form submission behavior
    evt.preventDefault();

    //Preparing Data: The `handleSubmit` function prepares the data to be sent to the API by creating a `profileData` object that contains the user's first name, last name, and email.
    let profileData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
    };

    //The `username` variable is set to the current user's username from the `formData` state.  This is used to identify which user's profile is being updated in the API call named `SnacrisApi.saveProfile`.
    let username = formData.username;

    //The `updatedUser` variable is initialized to store the updated user data returned from the API after a successful profile update.  This variable will be used to update the `formData` state and the global `currentUser` state.
    let updatedUser;

    //Calling the API: Calls the SnacrisApi.saveProfile method to send the updated data to the backend as a PATCH request to the backend endpoint `/users/${username}` with the `profileData` object.  The backend will update the user's profile information in the database and responds with the updated user data.
    try {
      //If the update is successful, the updated user data is returned and stored in the `updatedUser` variable.
      updatedUser = await SnacrisApi.saveProfile(username, profileData);
      //If the API call fails, the errors are caught and stored in the `formErrors` state object.  Examples of any errors include validation errors (e.g., invalid email format) or server errors (e.g., user not found).
    } catch (errors) {
      setFormErrors(errors);
      return;
    }

    // The `setFormData` function is called to update the `formData` state with the new values from the `updatedUser` object.  This is done by creating a new object called `f` that contains the existing `formData` and the new values from the `updatedUser` object. The spread operator (...) is used to create a shallow copy of the existing formData object, and then the new values are added to it. After `setFormData` is executed the form fields will be updated with the new values from the `updatedUser` object.  The new object `f` will be used in the `handleChange` function to update the form fields with the new values.
    setFormData((f) => ({ ...f }));

    //The `setFormErrors` function is called to clear any previous error messages by setting the `formErrors` state to an empty array.  This is done to ensure that the user sees only the most recent error messages, if any.
    setFormErrors([]);

    // The `setSaveConfirmed` function is called to set the `saveConfirmed` state to true, indicating that the profile update was successful. This will trigger a success message to be displayed to the user.  This is done to provide feedback to the user that their changes have been saved successfully.
  data: setSaveConfirmed(true);

    //Updating State: If the API call is successful (i) it Clears any previous errors, (ii) sets saveConfirmed to true to display a success message and (iii) updates the global currentUser state using setCurrentUser.
    // trigger reloading of user information throughout the site
    setCurrentUser((currentUser) => ({
      ...currentUser,
      data: updatedUser,
    }));
  }

  /* Handle form data changing with the handleChange function which:
  1. is triggered whenever the user types into a form field,
  2. updates the corresponding field in the formData state, and
  3. clears any previous error messages in the formErrors state.*/
  function handleChange(evt) {
    //The `const { name, value } = evt.target;` line destructures the `name` and `value` properties from the event target (the input field that triggered the change event).
    const { name, value } = evt.target;

    //The `setFormData` function is called to update the `formData` state with the new value for the corresponding field.  This is done by creating a new object called `f` that contains the existing `formData` and the new value for the field that was changed. The spread operator (...) is used to create a shallow copy of the existing formData object, and then the new value is added to it.
    setFormData((f) => ({
      ...f,
      [name]: value,
    }));
    setFormErrors([]);
  }

  return (
    <div className="ProfileForm col-md-6 col-lg-4 offset-md-3 offset-lg-4">
      <h3>My Profile</h3>
      <div className="card">
        <div className="card-body">
          {/* The form includes fields for firstName, lastName, and email, which are editable. */}
          <form>
            <div className="mb-3">
              <label className="form-label">Username</label>
              {/* The username field is displayed but disabled, as it cannot be changed. */}
              <input
                disabled
                className="form-control"
                placeholder={formData.username}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">First Name</label>
              <input
                name="firstName"
                className="form-control"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Last Name</label>
              <input
                name="lastName"
                className="form-control"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* The form dynamically displays: An error alert (Alert component) if there are validation errors. */}
            {formErrors.length ? (
              <Alert type="danger" messages={formErrors} />
            ) : null}

            {/* The form dynamically displays: A success alert if the profile update is successful. */}
            {saveConfirmed ? (
              <Alert type="success" messages={["Updated successfully."]} />
            ) : null}

            <div className="d-grid">
              <button className="btn btn-primary" onClick={handleSubmit}>
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfileForm;

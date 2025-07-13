import React, { useContext } from "react";
import ProfileForm from "./ProfileForm";
import MyOrganizations from "../../components/organization/MyOrganizations";
import UserContext from "../../auth/UserContext";
import { Helmet } from "react-helmet";

function ProfilePage() {
  const { currentUser } = useContext(UserContext);

  return (
    <main role="main" aria-label="profile" className="ProfilePage container">
      <Helmet>
        <title>
          {`SNACRIS - ${
            currentUser.firstName || currentUser.username
          }'s Profile`}
        </title>
      </Helmet>
      <ProfileForm />
      <MyOrganizations />
      {/* Add other profile-related components here */}
      {/* <ProfileActivity /> */}
      {/* <ProfileSettings /> */}
    </main>
  );
}

export default ProfilePage;

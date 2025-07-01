import React from "react";
import ProfileForm from "./ProfileForm";
import MyOrganizations from "../../components/organization/MyOrganizations";
// import other profile-related components as needed

function ProfilePage() {
  return (
    <main role="main" aria-label="profile" className="ProfilePage container">
      <ProfileForm />
      <MyOrganizations />
      {/* Add other profile-related components here */}
      {/* <ProfileActivity /> */}
      {/* <ProfileSettings /> */}
    </main>
  );
}

export default ProfilePage;

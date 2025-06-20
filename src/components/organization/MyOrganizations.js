import React, { useState, useEffect, useContext } from "react";
import SnacrisApi from "../../api/api";
import UserContext from "../../auth/UserContext";
import MyOrganizationsDisplay from "./MyOrganizationsDisplay";
import MyOrganizationsForm from "./MyOrganizationsForm";
import Alert from "../../common/Alert";
import "./MyOrganizations.css";

function MyOrganizations() {
  const { currentUser } = useContext(UserContext);
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrgId, setSelectedOrgId] = useState(null);
  const [formMode, setFormMode] = useState("view"); // "view", "create", "edit"
  const [formOrg, setFormOrg] = useState(null);
  const [error, setError] = useState(null);

// ...existing code...

useEffect(() => {
  async function fetchOrgs() {
    try {
      const orgs = await SnacrisApi.getMyOrganizations();
      setOrganizations(orgs);
      // Select the first org by default if available
      if (orgs.length > 0) {
        setSelectedOrgId(orgs[0].id);
        setFormOrg(orgs[0]);
      }
    } catch (err) {
      setError(err);
    }
  }
  if (currentUser) fetchOrgs();
}, [currentUser]);

// If organizations change (e.g., after create/delete), select first if none selected
useEffect(() => {
  if (
    organizations.length > 0 &&
    (selectedOrgId === null || !organizations.some(o => o.id === selectedOrgId))
  ) {
    setSelectedOrgId(organizations[0].id);
    setFormOrg(organizations[0]);
    setFormMode("view");
  }
}, [organizations]);

// ...existing code...

  function handleSelectOrg(orgId) {
    setSelectedOrgId(orgId);
    setFormMode("view");
    setFormOrg(organizations.find(o => o.id === orgId));
  }

  function handleCreate() {
    setFormMode("create");
    setFormOrg(null);
    setSelectedOrgId(null);
  }

  function handleEdit() {
    setFormMode("edit");
    setFormOrg(organizations.find(o => o.id === selectedOrgId));
  }

  async function handleFormSubmit(orgData) {
  try {
    let updatedOrgs;
    if (formMode === "create") {
      // Add createdBy to the payload
      const newOrg = await SnacrisApi.createOrganization({
        ...orgData,
        createdBy: currentUser.username
      });
      updatedOrgs = [...organizations, newOrg];
      setSelectedOrgId(newOrg.id);
      setFormOrg(newOrg);
    } else if (formMode === "edit") {
      const updatedOrg = await SnacrisApi.updateOrganization(selectedOrgId, orgData);
      updatedOrgs = organizations.map(o => o.id === selectedOrgId ? updatedOrg : o);
      setFormOrg(updatedOrg);
    }
    setOrganizations(updatedOrgs);
    setFormMode("view");
    setError(null);
  } catch (err) {
    setError(err);
  }
}

  async function handleDelete() {
    try {
      await SnacrisApi.deleteOrganization(selectedOrgId);
      const updatedOrgs = organizations.filter(o => o.id !== selectedOrgId);
      setOrganizations(updatedOrgs);
      setSelectedOrgId(null);
      setFormMode("view");
      setFormOrg(null);
      setError(null);
    } catch (err) {
      setError(err);
    }
  }

  function handleCancel() {
    setFormMode("view");
    setFormOrg(selectedOrgId ? organizations.find(o => o.id === selectedOrgId) : null);
  }

  return (
    <div className="MyOrganizations container">
      <h3>My Organizations</h3>
      {error && <Alert type="danger" messages={[error.toString()]} />}
        <div className="row">
        <div className="col-md-6">
          <MyOrganizationsDisplay
            organizations={organizations}
            selectedOrgId={selectedOrgId}
            onSelectOrg={handleSelectOrg}
          />
        </div>
        <div className="col-md-6">
          <MyOrganizationsForm
            formMode={formMode}
            initialData={formMode === "edit" ? formOrg : null}
            selectedOrg={formOrg}
            currentUser={currentUser}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
            onCreate={handleCreate}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
        </div>
    </div>
  );
}

export default MyOrganizations;
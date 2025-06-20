import React from "react";

function MyOrganizationsDisplay({
  organizations,
  selectedOrgId,
  onSelectOrg
}) {
  return (
    <div className="MyOrganizationsDisplay card p-3">
      <form>
        {organizations.length === 0 ? (
          <p>No organizations found.</p>
        ) : (
          organizations.map(org => (
            <div className="form-check" key={org.id}>
              <input
                className="form-check-input"
                type="radio"
                name="organization"
                id={`org-${org.id}`}
                checked={selectedOrgId === org.id}
                onChange={() => onSelectOrg(org.id)}
              />
              <label className="form-check-label" htmlFor={`org-${org.id}`}>
                {org.name}
              </label>
            </div>
          ))
        )}
      </form>
    </div>
  );
}

export default MyOrganizationsDisplay;
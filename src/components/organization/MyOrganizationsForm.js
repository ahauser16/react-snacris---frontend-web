import React, { useState, useEffect } from "react";
import ConfirmDialog from "../../common/ConfirmDialog";
import Alert from "../../common/Alert";
import SnacrisApi from "../../api/api";

function MyOrganizationsForm({
  formMode,
  initialData,
  selectedOrg,
  currentUser,
  onSubmit,
  onCancel,
  onCreate,
  onEdit,
  onDelete,
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
  });
  const [formErrors, setFormErrors] = useState([]);
  const [saveConfirmed, setSaveConfirmed] = useState(false);
  const [members, setMembers] = useState([]);

  const [showConfirm, setShowConfirm] = useState(false);

  // 3. Fetch members when selectedOrg changes
  useEffect(() => {
    setFormData({
      name: initialData?.name || "",
      description: initialData?.description || "",
    });
    setSaveConfirmed(false);
    setFormErrors([]);
  }, [initialData, formMode]);

  useEffect(() => {
    async function fetchMembers() {
      if (selectedOrg && selectedOrg.id) {
        try {
          const orgMembers = await SnacrisApi.getOrganizationMembers(
            selectedOrg.id
          );
          setMembers(orgMembers);
        } catch (err) {
          setMembers([]);
        }
      } else {
        setMembers([]);
      }
    }
    fetchMembers();
  }, [selectedOrg]);

  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData((f) => ({
      ...f,
      [name]: value,
    }));
    setFormErrors([]);
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      await onSubmit(formData);
      setSaveConfirmed(true);
      setFormErrors([]);
    } catch (err) {
      setFormErrors([err.toString()]);
      setSaveConfirmed(false);
    }
  }

  // Render logic
  if (formMode === "create") {
    return (
      <div className="MyOrganizationsForm card p-3">
        <h5>Create Organization</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Organization Name</label>
            <input
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          {formErrors.length > 0 && (
            <Alert type="danger" messages={formErrors} />
          )}
          {saveConfirmed && (
            <Alert type="success" messages={["Saved successfully."]} />
          )}
          <div className="d-flex flex-column flex-md-row">
            <button
              className="btn btn-primary mb-2 mb-md-0 me-0 me-md-2"
              type="submit"
            >
              Create
            </button>
            <button
              className="btn btn-secondary mb-2 mb-md-0 me-0 me-md-2"
              type="button"
              //   onClick={onCancel}
              onClick={() => setShowConfirm(true)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (formMode === "edit" && selectedOrg) {
    const isOwner = selectedOrg.createdBy === currentUser.username;
    return (
      <div className="MyOrganizationsForm card p-3">
        <h5>Edit Organization</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Organization Name</label>
            <input
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={!isOwner}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleChange}
              disabled={!isOwner}
            />
          </div>
          {formErrors.length > 0 && (
            <Alert type="danger" messages={formErrors} />
          )}
          {saveConfirmed && (
            <Alert type="success" messages={["Saved successfully."]} />
          )}
          <div className="d-flex flex-column flex-md-row">
            <button
              className="btn btn-primary mb-2 mb-md-0 me-0 me-md-2"
              type="submit"
              disabled={!isOwner}
            >
              Update
            </button>
            <button
              className="btn btn-secondary mb-2 mb-md-0 me-0 me-md-2"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </button>
            {isOwner && (
              <button
                className="btn btn-danger mb-2 mb-md-0 me-0 me-md-2"
                type="button"
                onClick={onDelete}
              >
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
    );
  }

  // Default: view mode (show details and action buttons)
  return (
    <div className="MyOrganizationsForm card p-3">
      {selectedOrg ? (
        <>
          <h5 className="text-primary">{selectedOrg.name}</h5>
          <p>{selectedOrg.description}</p>
          <p>
            <b>Created by:</b> {selectedOrg.createdBy}
          </p>
          <p>
            <b>Members:</b>{" "}
            {members.length > 0 ? (
              <ul className="mb-2">
                {members.map((m, idx) => (
                  <li key={idx}>{typeof m === "string" ? m : m.username}</li>
                ))}
              </ul>
            ) : (
              <span>No members</span>
            )}
          </p>
          <div className="row align-items-center">
            <div className="col-auto d-flex flex-column flex-md-row">
              <button
                className="btn btn-primary mb-2 mb-md-0 me-0 me-md-2"
                type="button"
                onClick={onEdit}
                disabled={selectedOrg.createdBy !== currentUser.username}
              >
                Edit
              </button>
              {selectedOrg.createdBy === currentUser.username && (
                <button
                  className="btn btn-danger mb-2 mb-md-0 me-0 me-md-2"
                  type="button"
                  //onClick={onDelete}
                  onClick={() => setShowConfirm(true)}
                >
                  Delete
                </button>
              )}
            </div>
            <div className="col-auto ms-auto">
              <button
                className="btn btn-success mb-2 mb-md-0 me-0 me-md-2"
                type="button"
                onClick={onCreate}
              >
                Create Organization
              </button>
            </div>
          </div>
          <ConfirmDialog
            show={showConfirm}
            message="Are you sure you want to delete this organization?"
            onConfirm={() => {
              setShowConfirm(false);
              onDelete();
            }}
            onCancel={() => setShowConfirm(false)}
            confirmText="Yes"
            cancelText="No"
          />
        </>
      ) : (
        <div className="d-flex flex-column flex-md-row">
          <button
            className="btn btn-primary mb-2 mb-md-0 me-0 me-md-2"
            type="button"
            onClick={onCreate}
          >
            Create Organization
          </button>
        </div>
      )}
    </div>
  );
}

export default MyOrganizationsForm;

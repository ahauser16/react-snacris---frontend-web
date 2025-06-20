import React from "react";

function ConfirmDialog({ show, message, onConfirm, onCancel, confirmText = "Yes", cancelText = "No" }) {
  if (!show) return null;
  return (
    <div className="modal d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-body">
            <p>{message}</p>
            <div className="d-flex justify-content-end">
              <button className="btn btn-danger me-2" onClick={onConfirm}>{confirmText}</button>
              <button className="btn btn-secondary" onClick={onCancel}>{cancelText}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
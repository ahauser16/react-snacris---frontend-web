import React from "react";

/** Presentational component for showing bootstrap-style alerts.
 *
 * { LoginForm, SignupForm, ProfileForm } -> Alert
 **/

function Alert({ type = "danger", messages = [] }) {
  console.debug("Alert", "type=", type, "messages=", messages);

  // Add null safety and ensure we always work with an array
  const safeMessages = Array.isArray(messages) ? messages : [];

  return (
    <div className={`alert alert-${type}`} role="alert">
      {safeMessages.map((error, index) => (
        <p className="mb-0 medium" key={`alert-message-${index}`}>
          {error}
        </p>
      ))}
    </div>
  );
}

export default Alert;

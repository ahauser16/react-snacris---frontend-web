import React from "react";

function Accordion({ id, title, show, onClick, children, alertClass }) {
  return (
    <div className="accordion-item">
      <h2 className="accordion-header" id={`heading-${id}`}>
        <button
          className={`accordion-button ${!show ? "collapsed" : ""} ${alertClass ? alertClass : ""}`}
          type="button"
          onClick={onClick}
          aria-expanded={show}
          aria-controls={`collapse-${id}`}
        >
          {title}
        </button>
      </h2>
      <div
        id={`collapse-${id}`}
        className={`accordion-collapse collapse${show ? " show" : ""}`}
        aria-labelledby={`heading-${id}`}
      >
        <div className="accordion-body">{children}</div>
      </div>
    </div>
  );
}

export default Accordion;
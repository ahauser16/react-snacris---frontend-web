import React, { useState, useEffect } from "react";
import IconContainer from "../../assets/icons/IconContainer";
import Accordion from "./Accordion";

// Helper to detect touch device (mobile/tablet)
function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    const check = () =>
      setIsTouch(
        "ontouchstart" in window ||
          navigator.maxTouchPoints > 0 ||
          window.matchMedia("(pointer: coarse)").matches
      );
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isTouch;
}

const Tooltip = ({
  iconName = "icon-information",
  helperText = "",
  label = "",
  accordionTitle = "How to use search",
  iconClassName = "me-2",
  iconSize = 32,
  alertClass = "alert-info",
}) => {
  const isTouch = useIsTouchDevice();
  const [showTooltip, setShowTooltip] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(false);

  // Desktop/laptop: show tooltip on hover/focus
  if (!isTouch) {
    return (
      <div className="position-relative d-inline-block">
        <button
          type="button"
          className="btn btn-link p-0 m-0 align-baseline"
          aria-label={label || "Show information"}
          tabIndex={0}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onFocus={() => setShowTooltip(true)}
          onBlur={() => setShowTooltip(false)}
          style={{ outline: "none", border: "none", background: "none" }}
        >
          <IconContainer
            name={iconName}
            label={label}
            iconClassName={iconClassName}
            iconSize={iconSize}
          />
        </button>
        {showTooltip && (
          <div
            className="tooltip bs-tooltip-top show"
            role="tooltip"
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              top: "-2.5rem",
              zIndex: 1000,
              minWidth: "200px",
              background: "#222",
              color: "#fff",
              padding: "0.5rem 1rem",
              borderRadius: "0.25rem",
              fontSize: "0.95rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            {helperText}
          </div>
        )}
      </div>
    );
  }

  // Mobile/tablet: show Accordion
  return (
    <div className="w-100">
      <Accordion
        id="tooltip-helper"
        title={
          <span>
            <IconContainer
              name={iconName}
              label={label}
              iconClassName={iconClassName}
              iconSize={iconSize}
            />{" "}
            {accordionTitle}
          </span>
        }
        show={openAccordion}
        onClick={() => setOpenAccordion((open) => !open)}
        alertClass={alertClass}
      >
        <p className="mb-0">{helperText}</p>
      </Accordion>
    </div>
  );
};

export default Tooltip;
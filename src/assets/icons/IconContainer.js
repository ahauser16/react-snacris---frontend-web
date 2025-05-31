import React from "react";
import { ReactComponent as AddCircleIcon } from "./icon-add-circle.svg";
import { ReactComponent as AddSquareIcon } from "./icon-add-square.svg";
import { ReactComponent as AirplaneIcon } from "./icon-airplane.svg";
import { ReactComponent as InformationIcon } from "./icon-information.svg";
import "./IconContainer.css";

const icons = {
  "icon-add-circle": AddCircleIcon,
  "icon-add-square": AddSquareIcon,
  "icon-airplane": AirplaneIcon,
  "icon-information": InformationIcon,
  // ...add other mappings here
};

const IconContainer = ({
  name,
  label,
  className = "",
  iconClassName = "me-3", // Bootstrap margin-end
  iconSize = 32, // px
}) => {
  const Icon = icons[name];
  if (!Icon) {
    console.warn("Icon not found:", name);
    return null;
  }

  return (
    <div className={`d-flex align-items-center mb-3 ${className}`}>
      <Icon
        className={`${iconClassName} ${name}`}
        style={{ width: iconSize, height: iconSize }}
      />
      <span>{label || name}</span>
    </div>
  );
};

export default IconContainer;
// ConditionalTags.jsx

import React from "react";
import { useLocation } from "react-router-dom";
import Tags from "./Tags"; // Adjust the import path as necessary

function ConditionalTags({ onTagSelect }) {
  const location = useLocation();
  const shouldShowTags =
    location.pathname === "/" || location.pathname.startsWith("/brands");

  return shouldShowTags ? <Tags onTagSelect={onTagSelect} /> : null;
}

export default ConditionalTags;

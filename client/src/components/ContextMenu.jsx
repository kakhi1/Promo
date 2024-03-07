// ContextMenu.jsx
import React from "react";

const ContextMenu = ({ position, onEdit, onDelete }) => (
  <div
    style={{
      position: "fixed",
      top: position.y,
      left: position.x,
      zIndex: 1000,
      backgroundColor: "#fff",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      padding: "10px",
      borderRadius: "5px",
    }}
    onClick={(e) => e.stopPropagation()}
  >
    <div style={{ marginBottom: "10px", cursor: "pointer" }} onClick={onEdit}>
      Modify
    </div>
    <div style={{ cursor: "pointer" }} onClick={onDelete}>
      Delete
    </div>
  </div>
);

export default ContextMenu;

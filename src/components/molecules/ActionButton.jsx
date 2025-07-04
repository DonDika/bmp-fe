import React from "react";
import Button from "../atoms/Button";

const ActionButton = ({ onView, onEdit, onDelete, showView = true, showEdit = true, showDelete = true }) => {
  return (
    <div className="flex items-center justify-center gap-2">
      {showView && <Button onClick={onView}>View</Button>}
      {showEdit && <Button onClick={onEdit}>Edit</Button>}
      {showDelete && <Button onClick={onDelete}>Delete</Button>}
    </div>
  );
};

export default ActionButton;

import React from "react";

function Display({ displayString }) {
  return (
    <div className="display">
      <div className="equation">{displayString}</div>
    </div>
  );
}

export default Display;

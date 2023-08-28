import React from "react";

function Display({ memoryString, displayString }) {
  return (
    <div className="display">
      {memoryString && <p className="memoryString">M: {memoryString}</p>}
      <div className="equation">{displayString}</div>
    </div>
  );
}

export default Display;

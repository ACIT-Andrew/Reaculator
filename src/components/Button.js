import React from "react";

function Button({ buttonData, className, handleButtonClick }) {
  return (
    <>
      <button
        onClick={() => {
          handleButtonClick(buttonData);
        }}
        className={className}
      >
        {buttonData.text}
      </button>
    </>
  );
}

export default Button;

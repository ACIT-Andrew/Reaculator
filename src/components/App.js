import { calculatorButtons } from "../data/calculator-bonus-03-button-data";
import { useState } from "react";
import "./App.css";

import Display from "./Display";
import Button from "./Button";

function App() {
  const [displayString, setDisplayString] = useState("0");
  const [mathString, setMathString] = useState("0");

  // Evaluate Equation
  function calculate(fn) {
    return new Function('return ' + fn)();
  }

  function processClear(value) {
    // console.log(value);
    setDisplayString("0");
  }

  function processEnter() {
    let result = calculate(mathString);
    console.log(result)
  }
  
  function processNumberClick(number) {
    if (displayString === "0") {
      setDisplayString(number);
      setMathString(number);
    } else if (displayString == "0" && number == "0") {
      setDisplayString("0");
    } else {
      setDisplayString(`${displayString}${number}`);
      setMathString(`${mathString}${number}`)
    }
    console.log(displayString);
  }
  
  function processOperator(buttonData) {
    setDisplayString(`${displayString} ${buttonData.text} `);
    setMathString(`${mathString}${buttonData.value}`);
  }
  
  function handleButtonClick(buttonData) {
    console.log(buttonData);

    switch (buttonData.type) {
      case "number":
        processNumberClick(buttonData.value);
        break;
      case "clear":
        processClear(buttonData.value);
        break;
      case "operator":
        processOperator(buttonData);
        break;
      case "enter":
        processEnter();
        break;
      default:
        console.log(buttonData.value);
    }
  }

  return (
    <div className="App">
      <header></header>
      <main>
        <Display displayString={displayString} />
        {calculatorButtons.map((buttonData, index) => {
          return (
            <Button
              key={index}
              className={buttonData.type}
              buttonData={buttonData}
              handleButtonClick={handleButtonClick}
            />
          );
        })}
      </main>
      <footer></footer>
    </div>
  );
}

export default App;

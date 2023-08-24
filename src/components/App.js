import { calculatorButtons } from "../data/calculator-bonus-03-button-data";
import { useState } from "react";
import "./App.css";

import Display from "./Display";
import Button from "./Button";

function App() {
  const [displayString, setDisplayString] = useState("0");
  const [mathString, setMathString] = useState("0");
  const [operandA, setOperandA] = useState("");
  const [operator, setOperator] = useState("");
  const [operandB, setOperandB] = useState("");
  const [result, setResult] = useState("");
  const [memory, setMemory] = useState("");

  let equation = `${operandA}${operator}${operandB}`;

  // Evaluate Equation
  function calculate(fn) {
    return new Function("return " + fn)();
  }

  // Clear operands, operator, and saved result
  function clearEquation() {
    setOperandA("");
    setOperator("");
    setOperandB("");
    setResult("0");
  }

  function processClear(buttonData) {
    if (buttonData.className === "c") {
      setDisplayString("0");
    } else if (buttonData.className === "ac") {
      setDisplayString("0");
      setMathString("0");
      clearEquation();
    }
  }

  function processDecimal(value) {
    if (operandA) {
      if (operandB && !operandB.includes(value)) {
        setOperandB(`${operandB}${value}`);
        setDisplayString(`${displayString}${value}`);
        setMathString(`${displayString}${value}`);
        return;
      }
      if (!operandA.includes(value)) {
        setOperandA(`${operandA}${value}`);
        setDisplayString(`${displayString}${value}`);
        setMathString(`${displayString}${value}`);
        return;
      }
    }
  }

  function processEnter() {
    // Pressing enter only calculates when equation is complete
    if (operandA && operator && operandB) {
      let calculation = calculate(mathString).toString();
      setResult(calculation);
      setDisplayString(calculation);
      setMathString(calculation);
      // Reset equation for next calculation
      setOperandA(calculation);
      setOperator("");
      setOperandB("");
    }
    console.log(result);
  }

  function processMemory(action) {
    switch (action) {
      case "Memory Save":
        if (operandA) {
          if (operandB) {
            // Both operand A and B are entered, save the result of equation as string
            setMemory(calculate(mathString).toString());
          } else {
            // OperandB hasn't been entered yet, just save OperandA
            setMemory(operandA);
          }
        }
        break;
      case "Memory Recall":
        if (memory) {
          // Do something only if there is a number stored
          if (operandA && operator) {
            if (operandB) {
              // A complete equation was entered. Do nothing
              return;
            } else {
              // OperandA and Operator have been entered. Output saved to OperandB
              setDisplayString(`${displayString} ${memory}`);
              setMathString(`${displayString}${memory}`);
              setOperandB(memory);
              return;
            }
          } else {
            setDisplayString(memory);
            setMathString(memory);
            setOperandA(memory);
          }
        }
        break;
      case "Memory Clear":
        setMemory("");
        break;
      case "Memory Addition":
        if (operandA) {
          setMemory(calculate(`${memory}+${operandA}`).toString());
        }
        break;
      case "Memory Subtract":
        if (operandA) {
          setMemory(calculate(`${memory}-${operandA}`).toString());
        }
        break;
    }
  }

  function processNumberClick(number) {
    // Normalize: Convert number to a string value
    number = number.toString();
    if (displayString === "0") {
      // Display is 0. Start typing number
      setOperandA(number);
      setDisplayString(number);
      setMathString(number);
    }

    if (operandA && displayString !== "0") {
      // User has entered OperandA and display is not 0 anymore
      if (operandA === "0") {
        if (number === "0") {
          // Display is 0 and user pressed 0. Just set to "0" and do nothing
          setOperandA("0");
          setDisplayString("0");
          setMathString("0");
          return;
        }
      }
      if (!operator) {
        // Operator has not been entered yet
        if (operandA === result) {
          // A calculation result is displayed and returned as OperandA, entered digits will overwrite this
          setOperandA(number);
          setDisplayString(number);
          setMathString(number);
          setResult("");
          return;
        }
        // OperandA is still being entered, append new digit
        setOperandA(`${operandA}${number}`);
        setDisplayString(`${displayString}${number}`);
        setMathString(`${mathString}${number}`);
      } else {
        // User entered operator already
        if (!operandB) {
          // OperandB not assigned yet. User is entering it
          setOperandB(number);
          setDisplayString(`${displayString} ${number}`);
          setMathString(`${mathString}${number}`);
        }
        if (operandB) {
          // OperandB already assigned
          if (operandB === "0") {
            if (number === "0") {
              // OperandB is 0 and user pressed 0. Just set to "0" and do nothing
              setOperandB("0");
              return;
            } else {
              // User entered digit other than 0. Change to new digit.
              setOperandB(number);
              setDisplayString(`${operandA} ${operator} ${number}`);
              setMathString(`${operandA}${operator}${number}`);
            }
          }
          setOperandB(`${operandB}${number}`);
          setDisplayString(`${displayString}${number}`);
          setMathString(`${mathString}${number}`);
        }
      }
    }
  }

  function processOperator(buttonData) {
    if (operandA && operator && operandB) {
      // A complete equation was entered. Calculate.
      processEnter();
      clearEquation();
      // Save calculation
      let calculation = calculate(mathString).toString();
      setOperandA(calculation);
      setResult(calculation);
      // Chain on the next operand
      setOperator(buttonData.value);
      setDisplayString(`${calculation} ${buttonData.text}`);
      setMathString(`${calculation}${buttonData.value}`);
      return;
    }

    if (!operandA) {
      // Nothing has been entered. Do nothing
      return;
    }
    if (operandA) {
      if (!operator) {
        // OperandA is still being entered
        setOperator(buttonData.value);
        setDisplayString(`${operandA} ${buttonData.text}`);
        setMathString(`${operandA}${buttonData.value}`);
      }
      if (operator) {
        // OperandA and Operator already entered, so we change current operator sign
        setOperator(buttonData.value);
        setDisplayString(`${operandA} ${buttonData.text} `);
        setMathString(`${operandA}${buttonData.value}`);
      }
    }
  }

  function handleButtonClick(buttonData) {
    console.log(buttonData);

    switch (buttonData.type) {
      case "clear":
        processClear(buttonData);
        break;
      case "decimal":
        processDecimal(buttonData.value);
        break;
      case "enter":
        processEnter();
        break;
      case "memory":
        processMemory(buttonData.value);
        break;
      case "number":
        processNumberClick(buttonData.value);
        break;
      case "operator":
        processOperator(buttonData);
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
        <div className="buttons">
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
        </div>
      </main>
      <footer></footer>
    </div>
  );
}

export default App;

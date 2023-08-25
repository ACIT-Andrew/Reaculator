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
      setMathString(`${operandA}${operator}`);
      setOperandB("");
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
        setMathString(`${mathString}${value}`);
        return;
      }
      if (!operandA.includes(value)) {
        setOperandA(`${operandA}${value}`);
        setDisplayString(`${displayString}${value}`);
        setMathString(`${mathString}${value}`);
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
              // OperandA and Operator have been entered. Output displayed and saved to OperandB
              setDisplayString(`${displayString} ${memory}`);
              setMathString(`${displayString}${memory}`);
              setOperandB(memory);
              return;
            }
          } else {
            // Display and output to OperandA
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
      default:
        break;
    }
  }

  function processNumberClick(number) {
    // Normalize: Convert number to a string value
    number = number.toString();
    if (displayString === "0") {
      if(operandA && operator){
        // User pressed 'C' and display is cleared, this handles the next entry
        setDisplayString(number)
        setMathString(`${mathString}${number}`)
        setOperandB(number)
        return;
      }
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
    // Handle special case of Percent or Sqrt
    switch (buttonData.value) {
      case "Percent":
        if (operandA && !operator) {
          // Only operates if there is a single operand in equation
          setOperandA(`${operandA / 100}`);
          setDisplayString(`${operandA / 100}`);
          setMathString(`${operandA / 100}`);
          setResult(`${operandA / 100}`);
          return;
        }
        return;
      case "Square Root":
        if (operandA && !operator) {
          // Only operates if there is a single operand in equation
          setOperandA(`${Math.sqrt(operandA)}`);
          setDisplayString(`${Math.sqrt(operandA)}`);
          setMathString(`${Math.sqrt(operandA)}`);
          setResult(`${Math.sqrt(operandA)}`);
          return;
        }
        return;
      default:
        break;
    }

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

  function processSign() {
    if (operandA) {
      if (operandB) {
        // User is changing operandB, update strings and operandB
        setOperandB(`${operandB * -1}`);
        setDisplayString(
          `${displayString.slice(0, (operandB.length + 1) * -1)} ${
            operandB * -1
          }`
        );
        setMathString(
          `${mathString.slice(0, (operandA.length + operator.length))} ${operandB * -1}`
        );
        return;
      }
      if (!operator) {
        // User is changing operandA
        setOperandA(`${operandA * -1}`);
        setDisplayString(`${operandA * -1}`);
        setMathString(`${operandA * -1}`);
      }
    }
  }

  function handleButtonClick(buttonData) {
    // console.log(buttonData);
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
      case "sign":
        processSign();
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

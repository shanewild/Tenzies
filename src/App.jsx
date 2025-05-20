import { useEffect, useState, useRef } from "react";
import "./index.css";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from 'react-confetti'

export default function App() {
  const diceSides = 6;
  const [dice, setDice] = useState(() => generateAllNewDice());
  const buttonRef = useRef(null)
  //check if game is won(all dice are held and all dice values are same)
  var gameWon = true;
  for (let i = 0; i < dice.length; i++) {
    if (!dice[i].isHeld || (dice[i].value !== dice[0].value)) {
      gameWon = false;
      break
    }
  }
  useEffect(() => {
    if (gameWon) {
      buttonRef.current.focus()
    }
  }, [gameWon])

  const diceElements = dice.map((die) => (
    <Die
      value={die.value}
      id={die.id}
      isHeld={die.isHeld}
      hold={hold}
      key={die.id}
    ></Die>
  ));

  function generateAllNewDice() {
    let diceArray = [];
    for (let i = 0; i < 10; i++) {
      const roll = Math.floor(Math.random() * diceSides) + 1;
      diceArray.push({ value: roll, isHeld: false, id: nanoid() });
    }
    return diceArray;
  }

  function hold(id) {
    setDice(
      dice.map((die) => (id === die.id ? { ...die, isHeld: !die.isHeld } : die))
    );
  }

  function reRoll() {
    if (gameWon) {
      setDice(() => generateAllNewDice())
    } else {
      setDice(
        dice.map((die) =>
          !die.isHeld
            ? { ...die, value: Math.floor(Math.random() * diceSides) + 1 }
            : die
        )
      );
    }
  }
  return (
    <main>
      {gameWon && <Confetti initialVelocityX={10} />}
      <div aria-live="polite" className="sr-only">
        {gameWon && <p>Congratulations! You won! Press "New Game" to start again.</p>}
      </div>
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{diceElements}</div>
      <button className="roll-dice" onClick={reRoll}>{gameWon ? 'New Game' : 'Roll!'}
      </button>
    </main>
  );
}

import './App.css'
import MineSweeper from './components/MineSweeper'
import Header from './components/Header'
import React from 'react';

function App() {

  const bombNumber = 10;
  const [bombsFound, setBombsFound] = React.useState<number>(0);
  const [finished, setFinished] = React.useState<boolean>(false);
  const [won, setWon] = React.useState<boolean>(false);

  const [resetTrigger, setResetTrigger] = React.useState<boolean>(false);

  const bombFound = (bomb: number) => {
    setBombsFound(bomb);
  }

  const gameOver = (win: boolean) => {
    setFinished(true);

    if (win) {
      console.log("You won!");
      setWon(true);
    } else {
      console.log("You lost!");
      setWon(false);
    }
  }

  const onReset = () => {
    setResetTrigger(true);
    setBombsFound(0);
    setFinished(false);
    setWon(false);
  }

  return (
    <>
      <Header title="Minesweeper" finished={finished} won={won} bombsFound={bombsFound} totalBombs={bombNumber} onReset={onReset}/>
      <MineSweeper width={10} height={10} gameFinished={finished} resetTrigger={resetTrigger} bombNumber={bombNumber} bombFound={bombFound} gameOver={gameOver} setResetTrigger={setResetTrigger}/>
    </>
  )
}

export default App

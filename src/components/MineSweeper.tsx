import { useState, type Dispatch, type SetStateAction } from 'react'
import '../App.css'
import MineTile from './MineTile'
import React from 'react'

interface MineSweeperProps {
  width: number;
  height: number;
  bombNumber: number;
  resetTrigger: boolean;
  gameFinished: boolean;
  bombFound?: (bombsFound: number) => void;
  gameOver?: (win: boolean) => void;
  setResetTrigger: Dispatch<SetStateAction<boolean>>;
}

const MineSweeper: React.FC<MineSweeperProps> = (props) => {
  const { width, height, bombNumber, resetTrigger, bombFound, gameOver, setResetTrigger, gameFinished } = props;

  const [bombs, setBombs] = React.useState<number>(0);
  
  const [board, setBoard] = useState<number[][]>(Array.from({ length: height }, () =>
    Array.from({ length: width }, () => 0)
  ));
  const [tileOpened, setTileOpened] = useState<boolean[][]>(Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, () => false)
  ));
  const [bombLocation, setBombLocation] = useState<Set<string>>(new Set<string>());
  const [flagLocation, setFlagLocation] = useState<Set<string>>(new Set<string>());
  const [finished, setFinished] = useState<boolean>(gameFinished);

  const isCoordValid = (x: number, y: number) => {
    if (x < 0 || y < 0)
      return false;

    if (x >= width || y >= height)
      return false;

    return true;
  }

  const TileOpenedBehavior = (x: number, y: number) => {
    const visited = new Set<string>();
    const queue: Array<[number, number]> = [[x, y]];
    const newTileOpened = tileOpened.map(row => [ ... row]);

    while(queue.length > 0) {
      const [x, y] = queue.shift()!;
      const key = `${x}x${y}`;

      if (!isCoordValid(x, y) || visited.has(key)) continue;
      visited.add(key);
      newTileOpened[y][x] = true;

      // Only enqueue neighbors if current tile is a zero
      if (board[y][x] === 0) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            queue.push([x + dx, y + dy]);
          }
        }
      } else if (board[y][x] >= 9){
        if (gameOver)
          gameOver(false);
        setFinished(true);
      }
    }

    setTileOpened(newTileOpened);
  }

  const TileFlaggedBehavior = (x: number, y: number, flagged: boolean) => {
    const newBombs = flagged ? bombs + 1 : bombs - 1;
    setBombs(newBombs);

    const updatedFlagLocation = new Set(flagLocation);
    if (flagged) {
      updatedFlagLocation.add(`${x},${y}`);
    } else {
      updatedFlagLocation.delete(`${x},${y}`);
    }
    setFlagLocation(updatedFlagLocation);

    if (bombFound)
      bombFound(newBombs);

    if (newBombs === bombNumber) {
      console.log("did you find all bombs? lemme check");
      let win = true;
      updatedFlagLocation.forEach(location => {
        if (!bombLocation.has(location))
          win = false;
      });
      if (gameOver && win) {
        gameOver(true);
        setFinished(true);
      }
    }
  }

  const generateBoard = () => {
    let newBoard: number[][] = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => 0)
    );

    const bombLocations = new Set<string>();
    for (let i = 0; i < bombNumber; i++) {
      let x = Math.floor(Math.random() * width);
      let y = Math.floor(Math.random() * height);

      while (bombLocations.has(`${x},${y}`)) {
        x = Math.floor(Math.random() * width);
        y = Math.floor(Math.random() * height);
      }

      bombLocations.add(`${x},${y}`);
      setBombLocation(prev => {
        const updated = new Set(prev);
        updated.add(`${x},${y}`);
        return updated;
      });
    }
    //check each tile 
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (bombLocations.has(`${x},${y}`)) {  //if bomb tile skip
          newBoard[y][x] = 9;
        } else {  //if not bomb
          //count how many bombs in its vicinity
          let bombCount = 0;
          if (bombLocations.has(`${x - 1},${y - 1}`)) bombCount++;
          if (bombLocations.has(`${x},${y - 1}`)) bombCount++;
          if (bombLocations.has(`${x + 1},${y - 1}`)) bombCount++;
          if (bombLocations.has(`${x - 1},${y}`)) bombCount++;
          if (bombLocations.has(`${x + 1},${y}`)) bombCount++;
          if (bombLocations.has(`${x - 1},${y + 1}`)) bombCount++;
          if (bombLocations.has(`${x},${y + 1}`)) bombCount++;
          if (bombLocations.has(`${x + 1},${y + 1}`)) bombCount++;
          newBoard[y][x] = bombCount;
        }
      }
    }

    setBoard(newBoard);
  }

  React.useEffect(() => {
    //generate the bomb locations
    generateBoard();
  }, []);

  React.useEffect(() => {
    //generate the bomb locations
    setFinished(gameFinished);
  }, [gameFinished]);

  React.useEffect(() => {
    if (!resetTrigger)
      return;

    setBoard(Array.from({ length: height }, () =>
      Array.from({ length: width }, () => 0)
    ));
    setTileOpened(Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => false)
    ));
    setBombs(0);

    generateBoard();

    setResetTrigger(false);
  }, [resetTrigger])

  return (
    <div className="bg-gray-300 grid grid-cols-10 gap-2 p-4 rounded m-1.5">
      {
        Array.from({ length: height }, (_, y) => 
          Array.from({ length: width}, (_, x) => (
            <MineTile x={x} y={y} open={tileOpened[y][x]} disabled={finished} content={board == undefined ? 0 : board[y][x]} tileOpened={TileOpenedBehavior} tileFlagged={TileFlaggedBehavior}/>
          )))
      }
    </div>
  )
}

export default MineSweeper;

import React from 'react';
import Word from './word';
import Board from './board';

class Game extends React.Component {
  // shuffleArray(arr) {
  //   arr.forEach((el, i) => {
  //     const j = Math.floor(Math.random() * (i + 1));
  //     [arr[i], arr[j]] = [arr[j], arr[i]];
  //   });
  //
  //   return arr;
  // }

  render() {
    let player;

    if (Math.random() >= .5) {
      player = "BLUE";
    } else {
      player = "RED";
    }

    const prompt = `${player}'S TURN`;

    return (
      <div>
        <span>{prompt}</span>
        <Board player={player} />
      </div>
    );
  }
}

export default Game;

import React from 'react';
import Word from './word';
import Board from './board';

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      player: Math.random() >= .5 ? "BLUE" : "RED"
    };
  }

  swapPlayer() {
    if (this.state.player === "BLUE") {
      this.setState( {player: "RED"} );
    }
  }

  render() {
    const prompt = `${this.state.player}'S TURN`;

    return (
      <div className="game">
        <div>{prompt}</div>
        <Board player={this.state.player} />
      </div>
    );
  }
}

export default Game;

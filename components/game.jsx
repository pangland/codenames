import React from 'react';
import Word from './word';
import Board from './board';

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.handleSelection = this.handleSelection.bind(this);

    this.state = {
      player: Math.random() >= .5 ? "BLUE" : "RED",
      gameOver: false
    };
  }

  handleSelection(cardType) {
    if (cardType === 3) {
      this.setState({ gameOver: true });
    } else if (this.state.player === "BLUE" && cardType !== 0) {
      this.swapPlayer();
    } else if (this.state.player === "RED" && cardType !== 1) {
      this.swapPlayer();
    }
  }

  swapPlayer() {
    this.setState({ player: this.state.player === "BLUE" ? "RED" : "BLUE" });
  }

  render() {
    const prompt = `${this.state.player}'S TURN`;

    return (
      <div className="game">
        <div>{prompt}</div>
        <Board
          player={this.state.player}
          handleSelection={this.handleSelection} />
      </div>
    );
  }
}

export default Game;

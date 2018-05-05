import React from 'react';
import Word from './word';
import Board from './board';
import fire from '../firebase';

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.handleSelection = this.handleSelection.bind(this);
    this.handleNewBoard = this.handleNewBoard.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      player: Math.random() >= .5 ? "BLUE" : "RED",
      gameOver: false,
      value: ""
    };
  }

  handleSelection(cardType) {
    if (cardType === 3) {
      this.setState( {gameOver: true} );
      this.swapPlayer();
    } else if (this.state.player === "BLUE" && cardType !== 0) {
      this.swapPlayer();
    } else if (this.state.player === "RED" && cardType !== 1) {
      this.swapPlayer();
    }
  }

  handleNewBoard() {
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();

    const lobbyPath = "lobbies" + this.props.location.pathname;
    const currentLobby = fire.database().ref(lobbyPath);

    currentLobby.once('value', (snapshot) => {
      const wordList = currentLobby.child('lobbyWordList');

      wordList.update({ [this.state.value]: true });
      this.setState({ value: ''});
    });
  }

  swapPlayer() {
    this.setState({ player: this.state.player === "BLUE" ? "RED" : "BLUE" });
  }

  render() {
    const {player, gameOver} = this.state;

    const prompt = gameOver ? `${player} IS VICTORIOUS` : `${player}'S TURN`;

    return (
      <div className="game">
        <div>{prompt}</div>
        <Board
          player={this.state.player}
          handleSelection={this.handleSelection} />
        <div onClick={this.handleNewBoard}></div>

        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            pattern="[A-Za-z]+"
            value={this.state.value}
            onChange={this.handleChange}
            title="Please only use numbers and letters" />
          <input type="submit" value="Add Word" />
        </form>
      </div>
    );
  }
}

export default Game;

import React from 'react';
import Board from './board';
import Prompt from './prompt';
import Scoreline from './scoreline';
import WordForm from './word_form';
import fire from '../firebase';
import { withRouter } from 'react-router-dom';
import { uniqueId } from './util';

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.handleSelection = this.handleSelection.bind(this);
    this.swapPlayer = this.swapPlayer.bind(this);
    this.newStartingConditions = this.newStartingConditions.bind(this);
    this.triggerNewBoard = this.triggerNewBoard.bind(this);
    this.spymasterToggle = this.spymasterToggle.bind(this);
    this.fetchStartingConditions = this.fetchStartingConditions.bind(this);

    const lobby = this.props.location.pathname;
    this.lobbyRef = fire.database().ref("lobbies" + lobby);

    this.state = {};

    this.lobbyRef.once("value", (snapshot) => {
      if (!snapshot.child('board').exists()) {
        this.newStartingConditions();
      }
    });

    this.state.value = "";
    this.state.isSpymaster = false;
  }

  componentDidMount() {
    const path = "lobbies" + this.props.location.pathname;
    this.lobbyRef = fire.database().ref(path);
    this.lobbyRef.on('value', this.fetchStartingConditions);
  }

  activateFirebaseListener(pathname) {
    const path = "lobbies" + pathname;
    this.lobbyRef.off("value", this.fetchStartingConditions);
    this.lobbyRef = fire.database().ref(path);
    this.lobbyRef.on("value", this.fetchStartingConditions);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.pathname !== nextProps.location.pathname) {
      this.activateFirebaseListener(nextProps.location.pathname);
      this.lobbyRef.once("value", (snapshot) => {
        if (!snapshot.child('player').exists()) {
          this.newStartingConditions();
        }
      });
    }
  }

  fetchStartingConditions(snapshot) {
    this.setState({
      redLeft: snapshot.val().redLeft,
      blueLeft: snapshot.val().blueLeft,
      player: snapshot.val().player,
      gameOver: snapshot.val().gameOver
    });
  }

  newStartingConditions() {
    const player = Math.random() >= .5 ? "BLUE" : "RED";
    // console.log('THE PLAYER IS:' + player);
    const redLeft = player === "BLUE" ? 8 : 9;
    const blueLeft = player === "BLUE" ? 9 : 8;

    this.board.setPlayer(player);
    this.board.newBoard();

    this.lobbyRef.update({
      player: player,
      redLeft: redLeft,
      blueLeft: blueLeft,
      gameOver: false
    });

    this.setState({
      isSpymaster: false
    });
  }

  handleSelection(cardType) {
    if (cardType === 0) {
      this.lobbyRef.update({blueLeft: this.state.blueLeft - 1});
    } else if (cardType === 1) {
      this.lobbyRef.update({redLeft: this.state.redLeft - 1});
    }

    if (cardType === 3) {
      this.lobbyRef.update({ gameOver: true });
      this.swapPlayer();
    } else if (this.state.player === "BLUE" && cardType !== 0) {
      this.swapPlayer();
    } else if (this.state.player === "RED" && cardType !== 1) {
      this.swapPlayer();
    }
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

      wordList.update({ [this.state.value.toUpperCase()]: true });
      this.setState({ value: ''});
    });
  }

  swapPlayer() {
    if (!this.state.gameOver) {
      this.lobbyRef.update({player: this.state.player === "BLUE" ? "RED" : "BLUE"});
    }
  }

  triggerNewBoard() {
    this.newStartingConditions();
    // this.board.newBoard();
  }

  spymasterToggle() {
    this.setState({ isSpymaster: this.state.isSpymaster ? false: true });
    this.board.setSpymaster();
  }

  render() {
    const {player, gameOver, redLeft, blueLeft, isSpymaster} = this.state;

    let endTurnButton;
    let spymasterButtonText;
    if (isSpymaster) {
      spymasterButtonText = "Become Agent";
      endTurnButton = null;
    } else {
      spymasterButtonText = "Become Spymaster";
      endTurnButton = <button onClick={this.swapPlayer}>End Turn</button>;
    }

    return (
      <div className="game">
        <Prompt player={player} gameOver={gameOver} />
        <Scoreline redLeft={redLeft} blueLeft={blueLeft} />
        <Board
          onRef={ref => (this.board = ref)}
          player={player}
          isSpymaster={isSpymaster}
          handleSelection={this.handleSelection} />
        <div className="buttons-div">
          <button onClick={this.spymasterToggle}>{spymasterButtonText}</button>
          {endTurnButton}
          <button onClick={this.triggerNewBoard}>New Game</button>
        </div>
        <WordForm />
      </div>
    );
  }
}

export default withRouter(Game);

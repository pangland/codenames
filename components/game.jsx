import React from 'react';
import Word from './word';
import Board from './board';
import Prompt from './prompt';
import fire from '../firebase';
import { History, withRouter } from 'react-router-dom';
import { uniqueId } from './util';

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.handleSelection = this.handleSelection.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.newStartingConditions = this.newStartingConditions.bind(this);
    this.triggerNewBoard = this.triggerNewBoard.bind(this);
    this.spymasterToggle = this.spymasterToggle.bind(this);

    const lobby = this.props.location.pathname;
    this.lobbyRef = fire.database().ref("lobbies" + lobby);

    this.state = {};

    this.lobbyRef.once("value", (snapshot) => {
      if (snapshot.child('board').exists()) {
        this.fetchStartingConditions(snapshot);
      } else {
        this.newStartingConditions();
      }
    });

    this.state.value = "";
  }

  componentDidMount() {
    const path = "lobbies" + this.props.location.pathname;
    const lobbyRef = fire.database().ref(path);
    lobbyRef.on('value', (snapshot) => {
      this.setState({
        player: snapshot.val().player,
        blueLeft: snapshot.val().blueLeft,
        redLeft: snapshot.val().redLeft,
        gameOver: snapshot.val().gameOver
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    // const lobby = this.props.location.pathname;
    // this.lobbyRef = fire.database().ref("lobbies" + lobby);
    if (this.props.location.pathname !== nextProps.location.pathname) {
      this.lobbyRef = fire.database().ref("lobbies" + nextProps.location.pathname);
      this.lobbyRef.once("value", (snapshot) => {
        if (snapshot.child('player').exists()) {
          this.fetchStartingConditions(snapshot);
        } else {
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
    console.log('THE PLAYER IS:' + player);
    const redLeft = player === "BLUE" ? 8 : 9;
    const blueLeft = player  === "BLUE" ? 9 : 8;

    this.board.setPlayer(player);

    this.lobbyRef.update({
      player: player,
      redLeft: redLeft,
      blueLeft: blueLeft,
      gameOver: false
    });

    this.setState({
      player: player,
      blueLeft: blueLeft,
      redLeft: redLeft,
      gameOver: false,
      isSpymaster: false,
      board: <Board onRef={ref => (this.board = ref)} player={player} handleSelection={this.handleSelection} />
    });
  }


  handleSelection(cardType) {
    const path = "lobbies" + this.props.location.pathname;
    const lobbyRef = fire.database().ref(path);

    if (cardType === 0) {
      lobbyRef.update({blueLeft: this.state.blueLeft - 1});
      this.setState({ blueLeft: this.state.blueLeft - 1 });
    } else if (cardType === 1) {
      lobbyRef.update({redLeft: this.state.redLeft - 1});
      this.setState({ redLeft: this.state.redLeft - 1 });
    }

    if (cardType === 3) {
      lobbyRef.update({ gameOver: true });
      this.setState( {gameOver: true} );
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
    // const path = "lobbies" + this.props.location.pathname;
    // const lobbyRef = fire.database().ref(path);
    if (!this.state.gameOver) {
      this.lobbyRef.update({player: this.state.player === "BLUE" ? "RED" : "BLUE"});
      this.setState({ player: this.state.player === "BLUE" ? "RED" : "BLUE" });
    }
  }

  triggerNewBoard() {
    this.newStartingConditions();
    this.board.newBoard();
  }

  spymasterToggle() {
    this.board.setSpymaster();
  }

  render() {
    console.log('rerender game');
    const {player, gameOver} = this.state;

    const prompt = gameOver ? `${player} IS VICTORIOUS` : `${player}'S TURN`;
    const message = this.state.player ? prompt : "Loading data...";
    const scoreline = this.state.redLeft || this.state.redLeft === 0 ? `${this.state.redLeft}-${this.state.blueLeft}` : "_";

    // const board = this.state.board ? this.state.board : <Board onRef={ref => (this.board = ref)} player={player} handleSelection={this.handleSelection} />;

    return (
      <div className="game">
        <Prompt player={player} gameOver={gameOver}/>
        <span>{scoreline}</span>
        <Board onRef={ref => (this.board = ref)} player={player} handleSelection={this.handleSelection}  isSpymaster={this.state.spymaster}/>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            pattern="[A-Za-z]+"
            value={this.state.value}
            onChange={this.handleChange}
            title="Please only use numbers and letters" />
          <input type="submit" value="Add Word" />
        </form>
        <button onClick={this.triggerNewBoard}>New Game</button>
        <button onClick={this.spymasterToggle}>Spymaster Toggle</button>
      </div>
    );
  }
}

export default withRouter(Game);

import React from 'react';
import Word from './word';
import { History, withRouter } from 'react-router-dom';
import fire from '../firebase';
import { uniqueId } from './util';

class Board extends React.Component {
  constructor(props) {
    super(props);
    const lobby = this.props.location.pathname;
    const boardRef = fire.database().ref("lobbies" + lobby + "/board");

    this.renderFirebaseBoard = this.renderFirebaseBoard.bind(this);

    this.isSpymaster = this.props.isSpymaster;

    this.state = {};
  }

  componentDidMount() {
    this.props.onRef(this);

    const path = "lobbies" + this.props.location.pathname;
    this.boardRef = fire.database().ref(path).child('board');
    this.boardRef.on("value", this.renderFirebaseBoard);
  }

  activateFirebaseListener(pathname) {
    const path = "lobbies" + pathname;
    this.boardRef.off("value", this.renderFirebaseBoard);
    this.boardRef = fire.database().ref(path).child('board');
    this.boardRef.on("value", this.renderFirebaseBoard);
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.pathname !== nextProps.location.pathname) {
      this.activateFirebaseListener(nextProps.location.pathname);
      this.boardRef.once("value", (snapshot) => {
        if (!snapshot.exists()) {
          // this.newBoard();
        } else {
          this.renderFirebaseBoard(snapshot);
        }
      });

      return true;
    }

    return false;
  }

  setPlayer(player) {
    this.player = player;
  }

  setSpymaster() {
    this.isSpymaster = this.isSpymaster ? false : true;
    this.quickReRender();
  }

  spymasterStatus() {
    return this.isSpymaster;
  }

  quickReRender() {
    const newList = [];
    this.state.wordList.forEach((word, i) => {
      newList.push(
        <Word
          key={i}
          index={word.props.index}
          word={word.props.word}
          cardType={word.props.cardType}
          selected={word.props.selected}
          visible={this.isSpymaster}
          handleSelection={this.props.handleSelection} />
      );
    });

    this.setState({ wordList: newList });
  }

  renderFirebaseBoard(snapshot) {
    console.log('How many renders');
    const data = snapshot.val();
    const wordList = [];
    for (let i = 0; i < 25; i++) {
      wordList.push(
        <Word
          key={i + uniqueId()}
          index={i}
          word={data[i].word}
          cardType={data[i].cardType}
          selected={data[i].selected}
          visible={this.isSpymaster}
          handleSelection={this.props.handleSelection} />
      );
    }

    this.setState({
      wordList: wordList
    });
  }

  newBoard() {
    this.isSpymaster = false;
    const wordStatuses = [
      0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2,
      2, 2, 3
    ];

    const lobbyRef = fire.database().ref("lobbies" + this.props.location.pathname);

    // // wordStatuses.push(lobbyRef.snapshot.val().player === "BLUE" ? 0 : 1);

    if (this.player) {
      wordStatuses.push(this.player === "BLUE" ? 0 : 1);
      this.player = null;
    } else {
      wordStatuses.push(this.props.player === "BLUE" ? 0 : 1);
    }
    this.shuffleArray(wordStatuses);

    const allWords = {};

    const dictionary = [
      'alamo', 'beagles', 'cyan', 'delta', 'elephant', 'fountain',
      'ghoul', 'hipster', 'illegitimate', 'junction', 'Klingon',
      'lemon', 'Madagascar', 'novice', 'operation', 'prinicpal',
      'query', 'rewind', 'saturation', 'tents', 'underwater',
      'villain', 'water', 'xylaphone', 'yankees'
    ];

    const dictionaryObj = dictionary.reduce((acc, cur) => {
      acc[cur] = true;
      return acc;
    }, {});

    lobbyRef.once("value", (snapshot) => {
      Object.assign(allWords, snapshot.child('lobbyWordList').val(), dictionaryObj);

      const words = this.shuffleArray(Object.keys(allWords)).slice(0,25);
      const board = {};
      const wordList = [];

      words.forEach((word, i) => {
        board[i]= {word: word, selected: false, cardType: wordStatuses[i]};
        wordList.push(
          <Word
            key={i}
            index={i}
            word={word}
            cardType={wordStatuses[i]}
            handleSelection={this.props.handleSelection} />
        );
      });

      const boardForReal = lobbyRef.child('board');

      lobbyRef.update({
        board: board
      });

      // this.wordList = words.map((entry, i) => {
      //   return (
      //     <Word
      //       key={i}
      //       word={entry}
      //       cardType={wordStatuses[i]}
      //       handleSelection={this.props.handleSelection} />
      //   );
      // });

      // this.setState({ wordList: wordList });
      console.log("New Board");
    });
  }

  shuffleArray(arr) {
    arr.forEach((el, i) => {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    });

    return arr;
  }

  render() {
    const blankBoard = [];
    for (let i = 0; i < 25; i++) {
      blankBoard.push(<li key={i} className="hidden board"><span></span></li>);
    }

    return (
      <ul className="board">
        {this.state.wordList ? this.state.wordList : blankBoard}
      </ul>
    );
  }
}

export default withRouter(Board);

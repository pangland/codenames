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
    this.isSpymaster = false;

    this.state = {
      lobby: this.props.location.pathname
    };

    boardRef.once("value", (snapshot) => {
      if (!snapshot.exists() || this.props.newBoard) {
        this.newBoard();
      } else {
        this.renderFirebaseBoard(snapshot);
      }
    });
  }

  componentDidMount() {
    this.props.onRef(this);
    const boardRef = fire.database().ref("lobbies" + this.props.location.pathname).child('board');
    boardRef.on("value", (snapshot) => {
      this.renderFirebaseBoard(snapshot);
    });
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  componentWillReceiveProps(nextProps) {
    console.log('Will Receive Props');
    debugger;
    if (this.state.lobby !== nextProps.location.pathname) {
      const lobby = nextProps.location.pathname;
      const boardRef = fire.database().ref("lobbies" + lobby + "/board");

      boardRef.once("value", (snapshot) => {
        if (!snapshot.exists()) {
          this.newBoard();
        } else {
          this.renderFirebaseBoard(snapshot);
        }
      });
    }

    this.setState({ lobby: nextProps.location.pathname });
    return true;
  }

  setPlayer(player) {
    this.player = player;
  }

  setSpymaster() {
    this.isSpymaster = this.isSpymaster ? false : true;
    this.quickReRender();
  }

  quickReRender() {
    const newList = [];
    this.state.wordList.forEach((word) => {
      newList.push(
        <Word
          key={word.props.key}
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
    debugger;
    const data = snapshot.val();
    console.log(data[0]);
    const wordList = [];
    for (let i = 0; i < 25; i++) {
      wordList.push(
        <Word
          key={uniqueId() + i}
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
    debugger;
    // // wordStatuses.push(lobbyRef.snapshot.val().player === "BLUE" ? 0 : 1);

    if (this.player) {
      wordStatuses.push(this.player === "BLUE" ? 0 : 1);
      this.player = null;
    } else {
      wordStatuses.push(this.props.player === "BLUE" ? 0 : 1);
    }
    this.shuffleArray(wordStatuses);

    // const lobbyWordsPath = "lobbies" + this.props.location.pathname + "/lobbyWordList";
    // const lobbyWordList = fire.database().ref(lobbyWordsPath);

    const allWords = {};

    const dictionary = [
      'alamo', 'beagles', 'cyan', 'delta', 'elephant', 'fountain',
      'ghoul', 'hipster', 'illegitimate', 'junction', 'Klingon',
      'lemon', 'Madagascar', 'novice', 'operation', 'prinicpal',
      'query', 'rewind', 'saturation', 'testicle', 'underwater',
      'villain', 'water', 'xylaphone', 'yankees'
    ];

    const dictionaryObj = dictionary.reduce((acc, cur) => {
      acc[cur] = true;
      return acc;
    }, {});

    lobbyRef.once("value", (snapshot) => {
      // console.log('newBoard in board');
      // wordStatuses.push(snapshot.val().player === "BLUE" ? 0 : 1);
      // // wordStatuses.push(this.props.player === "BLUE" ? 0 : 1);
      // this.shuffleArray(wordStatuses);

      Object.assign(allWords, snapshot.child('lobbyWordList').val(), dictionaryObj);

      const words = this.shuffleArray(Object.keys(allWords)).slice(0,25);
      const board = {};
      const wordList = [];

      words.forEach((word, i) => {
        board[i]= {word: word, selected: false, cardType: wordStatuses[i]};
        wordList.push(
          <Word
            key={uniqueId() + i}
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

      this.setState({ wordList: wordList });
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
    debugger;

    const blankBoard = [];
    for (let i = 0; i < 25; i++) {
      blankBoard.push(<li key={i} className="hidden">blah</li>);
    }

    return (
      <ul className="board">
        {this.state.wordList ? this.state.wordList : blankBoard}
      </ul>
    );
  }
}

export default withRouter(Board);

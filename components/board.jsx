import React from 'react';
import Word from './word';
import { History, withRouter } from 'react-router-dom';
import fire from '../firebase';

class Board extends React.Component {
  constructor(props) {
    super(props);

    const wordStatuses = [
      0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2,
      2, 2, 3
    ];

    wordStatuses.push(this.props.player === "BLUE" ? 0 : 1);
    this.shuffleArray(wordStatuses);

    const lobbyWordsPath = "lobbies" + this.props.location.pathname + "/lobbyWordList";
    const lobbyWordList = fire.database().ref(lobbyWordsPath);
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

    lobbyWordList.once("value", (snapshot) => {
      console.log('Event 2');
      Object.assign(allWords, snapshot.val(), dictionaryObj);

      const wordss = this.shuffleArray(Object.keys(allWords)).slice(0,25);

      this.wordList = wordss.map((entry, i) => {
        return (
          <Word
            key={i}
            word={entry}
            cardType={wordStatuses[i]}
            handleSelection={this.props.handleSelection} />
        );
      });

      this.setState({ active: 0 });
    });
    // const dictionary = this.shuffleArray([
    //   'alamo', 'beagles', 'cyan', 'delta', 'elephant', 'fountain',
    //   'ghoul', 'hipster', 'illegitimate', 'junction', 'Klingon',
    //   'lemon', 'Madagascar', 'novice', 'operation', 'prinicpal',
    //   'query', 'rewind', 'saturation', 'testicle', 'underwater',
    //   'villain', 'water', 'xylaphone', 'yankees'
    // ]);
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
      blankBoard.push(<li className="hidden">blah</li>);
    }

    return (
      <ul className="board">
        {this.wordList ? this.wordList : blankBoard}
      </ul>
    );
  }
}

export default withRouter(Board);

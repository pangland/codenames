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

    const dictionary = this.shuffleArray([
      'alamo', 'beagles', 'cyan', 'delta', 'elephant', 'fountain',
      'ghoul', 'hipster', 'illegitimate', 'junction', 'Klingon',
      'lemon', 'Madagascar', 'novice', 'operation', 'prinicpal',
      'query', 'rewind', 'saturation', 'testicle', 'underwater',
      'villain', 'water', 'xylaphone', 'yankees'
    ]);

    this.wordList = dictionary.map((entry, i) => {
      return (
        <Word
          key={i}
          word={entry}
          cardType={wordStatuses[i]}
          handleSelection={this.props.handleSelection} />
      );
    });

    const lobbyWordsPath = "lobbies" + this.props.location.pathname;

    const lobbyWordList = fire.database().ref(lobbyWordsPath);

    lobbyWordList.once("value", (snapshot) => {
      // console.log(snapshot.val());
      // snapshot.val().wordList
    });

    // const.database().ref()

    // const lobbiesRef = fire.database().ref('lobbies');
    // lobbiesRef.child(this.state.value).once('value', (snapshot) => {
    //   if (snapshot.exists()) {
    //     alert('exists');
    //   } else {
    //     const newLobby = lobbiesRef.child(this.state.value);
    //     newLobby.set({ 'permanentLobby': true });
    //     const path = `/${this.state.value}`;
    //     this.props.history.push(path);
    //   }
    // });

    debugger;
  }

  shuffleArray(arr) {
    arr.forEach((el, i) => {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    });

    return arr;
  }

  render() {
    return (
      <ul className="board">
        {this.wordList}
      </ul>
    );
  }
}

export default withRouter(Board);

import React from 'react';
import Word from './word';

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
      'a', 'b', 'c', 'a', 'b', 'c', 'a', 'b', 'c', 'a', 'b', 'c', 'a',
      'b', 'c', 'a', 'b', 'c', 'a', 'b', 'c', 'a', 'b', 'c', 'a'
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

export default Board;

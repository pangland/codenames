import React from 'react';
import Word from './word';

class Board extends React.Component {
  shuffleArray(arr) {
    arr.forEach((el, i) => {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    });

    return arr;
  }

  render() {
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

    const wordList = dictionary.map((entry, i) => {
      return (
        <Word key={i} word={entry} cardType={wordStatuses[i]} />
      );
    });

    return (
      <ul className="board">
        {wordList}
      </ul>
    );
  }
}

export default Board;

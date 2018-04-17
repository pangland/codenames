import React from 'react';
import Word from './word';

class Game extends React.Component {
  render() {
    const dictionary = [
      'a', 'b', 'c', 'a', 'b', 'c', 'a', 'b', 'c', 'a', 'b', 'c', 'a',
      'b', 'c', 'a', 'b', 'c', 'a', 'b', 'c', 'a', 'b', 'c', 'a'
    ];

    const wordList = dictionary.map((entry, i) => {
      return (
        <Word key={i} word={entry} />
      );
    });

    return (
      <ul className="board">
        {wordList}
      </ul>
    );
  }
}

export default Game;

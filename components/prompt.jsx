import React from 'react';

class Prompt extends React.Component {
  render() {
    const {gameOver, player} = this.props;
    const prompt = gameOver ? `${player} IS VICTORIOUS` : `${player}'S TURN`;
    const message = player ? prompt : "Loading data...";
    const className = `${player}-prompt`;

    debugger;

    return (
      <div className={className}>
        {message}
      </div>
    );
  }
}

export default Prompt;

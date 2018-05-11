import React from 'react';

class Scoreline extends React.Component {
  render() {
    const { redLeft, blueLeft } = this.props;
    const scoreline = redLeft || redLeft === 0 ? `${redLeft}-${blueLeft}` : "_";

    let redScore;
    let blueScore;
    if (redLeft || redLeft === 0) {
      redScore = <span className="RED-prompt">{redLeft}</span>;
      blueScore = <span className="BLUE-prompt">{blueLeft}</span>;
    } else {
      redScore = <span>?</span>;
      blueScore = <span>?</span>;
    }

    return (
      <div>
        {redScore}-{blueScore}
      </div>
    );
  }
}

export default Scoreline;

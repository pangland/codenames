import React from 'react';

class Word extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      category: 'none',
      selected: false
    };
  }

  render() {
    return (
      <li>
        {this.props.word}
      </li>
    );
  }
}

export default Word;

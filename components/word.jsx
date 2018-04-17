import React from 'react';

class Word extends React.Component {
  constructor(props) {
    super(props);

    this.selectCard = this.selectCard.bind(this);

    this.state = {
      selected: false
    };
  }

  selectCard() {
    this.setState({ selected: true });
  }

  render() {
    const code = {2: 'beige', 3: 'black'};
    if (this.props.first === "blue") {
      code[0] = "blue";
      code[1] = "red";
    } else {
      code[0] = "red";
      code[1] = "blue";
    }

    const className = this.state.selected ? code[this.props.cardType] : "";

    return (
      <li className={className} onClick={this.selectCard}>
        {this.props.word}
      </li>
    );
  }
}

export default Word;

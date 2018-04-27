import React from 'react';
import fire from '../firebase';

class Word extends React.Component {
  constructor(props) {
    super(props);

    this.selectCard = this.selectCard.bind(this);

    this.state = {
      selected: false
    };
  }

  componentDidMount() {
    const itemsRef = fire.database().ref('cards');
    itemsRef.on('value', (snapshot) => {
    let items = snapshot.val();
    let newState = [];

    this.setState({
      items: newState
    });
  });
  }

  selectCard() {
    if (!this.state.selected) {
      this.setState({ selected: true });
      this.props.handleSelection(this.props.cardType);
    }
  }

  render() {
    const code = {0: 'blue', 1: 'red', 2: 'beige', 3: 'black'};

    const className = this.state.selected ? code[this.props.cardType] : "";

    return (
      <li className={className} onClick={this.selectCard}>
        {this.props.word}
      </li>
    );
  }
}

export default Word;

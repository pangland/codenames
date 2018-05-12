import React from 'react';
import fire from '../firebase';
import { History, withRouter } from 'react-router-dom';

class Word extends React.Component {
  constructor(props) {
    super(props);
    this.selectCard = this.selectCard.bind(this);
    this.state = {
      selected: this.props.selected
    };
  }

  componentDidMount() {
    const path = "lobbies" + this.props.location.pathname + "/board/" + this.props.index;
    const cardRef = fire.database().ref(path);
    cardRef.on('value', (snapshot) => {
      this.setState({
        selected: snapshot.val().selected
      });
    });
  }

  selectCard() {
    if (!this.state.selected && !this.props.visible) {
      const path = "lobbies" + this.props.location.pathname + "/board/" + this.props.index;
      const cardRef = fire.database().ref(path);

      cardRef.update({
        selected: true
      });

      this.setState({ selected: true });
      this.props.handleSelection(this.props.cardType);
    }
  }

  render() {
    const code = {0: 'blue', 1: 'red', 2: 'beige', 3: 'black'};
    let className;
    if (this.state.selected) {
      className = code[this.props.cardType];
    } else if (this.props.visible) {
      className = code[this.props.cardType] + "-visible";
    }

    return (
      <li className={className} onClick={this.selectCard}>
        <span>
          {this.props.word}
        </span>
      </li>
    );
  }
}

export default withRouter(Word);

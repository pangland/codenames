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
    if (!this.state.selected) {
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
    if (this.props.selected && this.props.word === "alamo") {
      console.log('prop is true');
    }

    if (this.state.selected && this.props.word === "alamo") {
      console.log('state is true');
    }

    // debugger;
    const code = {0: 'blue', 1: 'red', 2: 'beige', 3: 'black'};

    const className = this.state.selected ? code[this.props.cardType] : "";

    return (
      <li className={className} onClick={this.selectCard}>
        {this.props.word}
      </li>
    );
  }
}

export default withRouter(Word);

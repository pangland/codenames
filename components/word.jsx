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

      this.isShitWorking();

      this.setState({
        items: newState
      });
    });
  }

  isShitWorking() {
    debugger;
    console.log('yo');
  }

  selectCard() {
    if (!this.state.selected) {
      this.setState({ selected: true });
      this.props.handleSelection(this.props.cardType);

      // const cardRef = fire.databse().ref('')


          // const lobbiesRef = fire.database().ref('lobbies');
          // lobbiesRef.child(this.state.value).once('value', (snapshot) => {
          //   if (snapshot.exists()) {
          //     alert('exists');
          //   } else {
          //     const newLobby = lobbiesRef.child(this.state.value);
          //     newLobby.set({ 'permanentLobby': true });
          //     const path = `/${this.state.value}`;
          //     this.props.history.push(path);
          //   }
          // });
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

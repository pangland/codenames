import React from 'react';
import fire from '../firebase';
import { withRouter } from 'react-router-dom';

class Word extends React.Component {
  constructor(props) {
    super(props);
    this.selectCard = this.selectCard.bind(this);
    this.state = {
      selected: this.props.selected
    };
  }

  componentDidMount() {
    // const path = "lobbies" + this.props.location.pathname + "/board/" + this.props.index;
    // const cardRef = fire.database().ref(path);
    // cardRef.on('value', (snapshot) => {
    //   this.setState({
    //     selected: snapshot.val().selected,
    //     word: snapshot.val().word
    //   });
    // });
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
      if (this.props.word === "fountain" && this.props.index === 0) {
        // console.log(this.state.selected);
      }
    } else if (this.props.visible) {
      className = code[this.props.cardType] + "-visible";
      } else if (this.props.word === "fountain" && this.props.index === 0) {
      // console.log('false');
      // console.log(this.props.word);
    }



    // if (this.props.word === "fountain") {
    //   console.log(this.props.selected);
    // }

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

import React from 'react';
import fire from '../firebase';
import { withRouter } from 'react-router-dom';

class WordForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    const path = this.props.location.pathname + "/permanetLobby";
    const permanenceRef = fire.database().ref("lobbies" + path);

    permanenceRef.once("value", (snapshot) => {
      if (snapshot.exists()) {
        this.setState({ permanetLobby: true });
      }
    });

    this.state = {
      value: "",
      permanentLobby: false
    };
  }

  componentDidMount() {
    const path = this.props.location.pathname;
    const lobbyRef = fire.database().ref("lobbies" + path);

    lobbyRef.on("value", (snapshot) => {
      if (snapshot.child('permanentLobby').exists()) {
        this.setState({ permanentLobby: true });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    debugger;
    const permanentLobby = this.state.permanentLobby;
    const path = this.props.location.pathname;
    const nextPath = nextProps.location.pathname;

    if (path !== nextPath) {
      const lobbyRef = fire.database().ref("lobbies" + nextPath);
      lobbyRef.once("value", (snapshot) => {
        const lobbyExists = snapshot.child('permanentLobby').exists();
        if (lobbyExists && !permanentLobby) {
          this.setState({ permanentLobby: true });
        } else if (!lobbyExists && permanentLobby) {
          this.setState({ permanentLobby: false });
        }
      });
    }
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();

    const lobbyPath = "lobbies" + this.props.location.pathname;
    const currentLobby = fire.database().ref(lobbyPath);

    currentLobby.once('value', (snapshot) => {
      const wordList = currentLobby.child('lobbyWordList');

      wordList.update({ [this.state.value.toUpperCase()]: true });
      this.setState({ value: ''});
    });
  }

  render() {
    if (this.state.permanentLobby) {
      return (
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            pattern="[A-Za-z]+"
            value={this.state.value}
            onChange={this.handleChange}
            title="Please only use numbers and letters" />
          <input type="submit" value="Add Word" />
        </form>
      );
    } else {
      return null;
    }
  }
}

export default withRouter(WordForm);

import React from 'react';
import fire from '../firebase';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { uniqueId } from './util.js';
import ExistingLobbyForm from './existing_lobby_form';

class Homepage extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.randomRoom = this.randomRoom.bind(this);

    this.state = {
      value: ""
    };
  }

  componentDidMount() {
    const createLobbyOpen = document.querySelector('.form-create-lobby');
  }


  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();

    const lobbiesRef = fire.database().ref('lobbies');
    lobbiesRef.child(this.state.value).once('value', (snapshot) => {
      if (snapshot.exists()) {
        alert('exists');
      } else {
        const newLobby = lobbiesRef.child(this.state.value);
        newLobby.set({ 'permanentLobby': true });
        const path = `/${this.state.value}`;
        this.props.history.push(path);
      }
    });
  }

  randomRoom(e) {
    const path = '/' + uniqueId();
    this.props.history.push(path);
  }

  render() {
    return (
      <div className="homepage-div">
        <p>This site allows you to reserve a permanent lobby and add your own words to the game.</p>
        <p className='random-room-p' onClick={this.randomRoom}>I don't need a dedicated lobby, just give me a room!</p>
        <p>Navigate to an existing room (you can just add lobby name to url)</p>
        <ExistingLobbyForm />
        <p>I'll make a new room for myself!</p>
        <form className='form-create-lobby' onSubmit={this.handleSubmit}>
          <input type="text" value={this.state.value} onChange={this.handleChange} />
          <input type="submit" value="Create Room" />
        </form>
      </div>
    );
  }
}

export default withRouter(Homepage);

import React from 'react';
import fire from '../firebase';
import { Link } from 'react-router-dom';
import { History, withRouter } from 'react-router-dom';

class Homepage extends React.Component {
  constructor(props) {
    super(props);

    this.createRoom = this.createRoom.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      value: ""
    };
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

    // fire.child(e.currentTarget).once('value', function(snapshot) {
    //   if (snapshot.exists()) {
    //     alert('exists');
    //   }
    // });
  }

  createRoom(e) {
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" value={this.state.value} onChange={this.handleChange} />
        <input type="submit" value="Create Room" />
      </form>
    );
  }
}

export default withRouter(Homepage);

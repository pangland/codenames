import React from 'react';
import fire from '../firebase';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

class Homepage extends React.Component {
  constructor(props) {
    super(props);

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
  }

  render() {
    return (
      <div className="homepage-div">
        <h3>CODENAMES</h3>
        <p>This site allows you to reserve a permanent lobby and add your own words to the game.</p>
        <p>I don't need a dedicated lobby, just give me a room!</p>
        <p>I have a room already! (note you can just navigate to your URL extension)</p>
        <p>I'll make a new room for myself!</p>
        <form onSubmit={this.handleSubmit}>
          <input type="text" value={this.state.value} onChange={this.handleChange} />
          <input type="submit" value="Create Room" />
        </form>
      </div>
    );
  }
}

export default withRouter(Homepage);

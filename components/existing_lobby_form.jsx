import React from 'react';
import { withRouter } from 'react-router-dom';

class ExistingLobbyForm extends React.Component {
  constructor() {
    super();
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
    const path = `/${this.state.value}`;
    this.props.history.push(path);
  }

  render() {
    return (
      <form className='form-create-lobby' onSubmit={this.handleSubmit}>
        <input
          type="text"
          pattern="[A-Za-z]+"
          title="Please only use letters"
          value={this.state.value}
          onChange={this.handleChange} />
        <input type="submit" value="Enter Lobby" />
      </form>
    );
  }
}

export default withRouter(ExistingLobbyForm);

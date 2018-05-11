# Codenames
--------------------
The goal is to create an online implementation of the Codenames board game that allows users to create their own lobbies and implement their own custom word lists.

## Implementation ##

The game is made using React and firebase. The game state is established in the firebase database. When any player selects a card, the realtime database is updated. Each player's device notices the change to the database via listeners and updates their state, which rerenders their board to adjust for the most recent changes. The listeners are established when the component mounts.

Individual card listener:

```javascript
componentDidMount() {
  const path = "lobbies" + this.props.location.pathname + "/board/" + this.props.index;
  const cardRef = fire.database().ref(path);
  cardRef.on('value', (snapshot) => {
    this.setState({
      selected: snapshot.val().selected
    });
  });
}
```
This implementation allows users to establish permanent lobbies for themselves and add their own words to the bank of words that the game pulls from when establishing a board.

## To Do ##

The application is nearly ready to be hosted. I still need to address:

- Authentication for permanent lobbies
- Cleaning up my homepage
- Establish a substantial initial database of words rather than the small set I use for testing.

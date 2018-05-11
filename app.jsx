import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Homepage from './components/homepage';
import Game from './components/game';
// import Classroom from './frontend/classroom';
// import Navbar from './frontend/navbar';

const App = () => {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Route path="/" component={Game} />
      </Switch>
    </div>
  );
};

export default App;

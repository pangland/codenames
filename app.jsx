import React from 'react';
import { Route } from 'react-router-dom';
import Game from './components/game';
// import Classroom from './frontend/classroom';
// import Navbar from './frontend/navbar';

const App = () => {
  return (
    <div>
      <Route exact path="/" component={Game} />
    </div>
  );
};

export default App;

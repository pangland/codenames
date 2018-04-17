import React from 'react';
import { Route } from 'react-router-dom';
import Board from './components/board';
// import Classroom from './frontend/classroom';
// import Navbar from './frontend/navbar';

const App = () => {
  return (
    <div>
      <Route exact path="/" component={Board} />
    </div>
  );
};

export default App;

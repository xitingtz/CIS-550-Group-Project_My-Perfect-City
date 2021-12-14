import React from 'react';
import Home from './pages/home'
import Rank from './pages/rank'
import Compare from './pages/compare'
import All from './pages/all'
import Search from './pages/search'


import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate
} from 'react-router-dom'
function App() {
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route exact path='/' element={<Navigate to="/all" />}></Route>
          <Route path='/search' element={<Search />} />
          <Route path='/rank' element={<Rank />} />
          <Route path='/compare' element={<Compare />} />
          <Route path='/home' element={<Home />} />
          <Route path='/all' element={<All />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';

import HomePage from './pages/HomePage';
import AllPage from './pages/AllPage';
import RankPage from './pages/RankPage';
import ComparePage from './pages/ComparePage';
import SearchPage from './pages/SearchPage';

import 'antd/dist/antd.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"


ReactDOM.render(
  <div>
    <Router>
      <Switch>
        <Route exact
							path="/"
							render={() => (
								<HomePage />
							)}/>
		<Route exact
							path="/all"
							render={() => (
								<AllPage />
							)}/>
        <Route exact
							path="/rank"
							render={() => (
								<RankPage />
							)}/>
        <Route exact
							path="/compare"
							render={() => (
								<ComparePage />
							)}/>
		<Route exact
							path="/search"
							render={() => (
								<SearchPage />
							)}/>					
      </Switch>
    </Router>
  </div>,
  document.getElementById('root')
);


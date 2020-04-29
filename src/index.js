import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import thunk from 'redux-thunk';
import reducer from './reducer';

import './index.css';

// import App from './App';
import QuestionPage from './question-page';

const middlewares = [
  thunk,
];

const store = createStore(reducer, applyMiddleware(...middlewares));

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route path="/question/:questionId" component={QuestionPage}/>
        {/*<Route path="/" component={App}/>*/}
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root')
);


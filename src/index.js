import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import thunk from 'redux-thunk';
import reducer from './reducer';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/index.css';

import Home from './components/home';
import EditQuestion from './components/edit-question';
import QuestionList from './components/question-list';

const middlewares = [
  thunk,
];

const store = createStore(reducer, applyMiddleware(...middlewares));

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route path="/question/:questionId" component={EditQuestion}/>
        <Route path="/questions" component={QuestionList}/>
        <Route path="/" component={Home}/>
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root')
);


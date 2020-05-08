import React, { Component } from 'react';
import { Link } from "react-router-dom";
import '../styles/edit-question.css';
import '../home.css';
import DateTimePicker from 'react-datetime-picker';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';

import LoggedInOverlay from './logged-in-overlay';
import LoginOverlay from './login-overlay';

import { withRouter } from "react-router";

import { fetchQuestions } from '../reducer';

class QuestionList extends Component {

  state = {

  };

  componentDidMount() {
    const { fetchQuestions } = this.props;
    fetchQuestions();
  }

  render() {
    const { questions, user }= this.props;
    if (!questions) return null;

    return (
      <div className="home-container">
        <div className="home-header">
          <Link to="/">
            <b>Hivemind</b>
          </Link>
          <div></div>
          {user ? <LoggedInOverlay /> : <LoginOverlay /> }
        </div>
        <div className="">
          {questions.map((q, idx) => (
            <div key={`question-list-item-${idx}`}>
              <b>{q.questionText}</b>
              <i>{q.answer}</i>
              <div>{q.startTime}</div>
              <div>____________________________</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { user, questions } = state;

  return {
    user,
    questions,
  };
};

const mapDispatchToProps = {
  fetchQuestions,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(QuestionList));

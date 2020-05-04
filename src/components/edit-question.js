import React, { Component } from 'react';
import { Link } from "react-router-dom";
// import '../styles/edit-question.css';
import '../home.css';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/Button';

import LoggedInOverlay from './logged-in-overlay';
import LoginOverlay from './login-overlay';

import { fetchQuestion, fetchUser } from '../reducer';

class EditQuestion extends Component {

  state = {
    questionText: '',
    answer: '',
    startTime: null,
  };

  save = () => {
    const { question, saveQuestion, user } = this.props;

    const { questionText, answer, startTime } = this.state;

    saveQuestion({
      ...question,
      questionText,
      answer,
      startTime,
    });

  };

  componentDidMount() {
    const {
      question,
      fetchQuestion,
      match: { params: { questionId } },
    } = this.props;

    if (!question) {
      fetchQuestion(questionId);
    }
  }

  componentDidUpdate(prevProps) {
    const { question } = this.props;
    if (!prevProps.question && question) {
      this.setState({
        questionText: question.questionText,
        answer: question.answer,
        startTime: question.startTime,
      })
    }
  }

  render() {
    const { question, user }= this.props;
    if (!question) return null;

    return (
      <div className="home-container">
        <div className="home-header">
          <Link to="/">
            <b>Hivemind</b>
          </Link>
          <div></div>
          {user ? <LoggedInOverlay /> : <LoginOverlay /> }
        </div>
        <div className="home-body">
          <div className="left-column">
            <div className="label">Past Questions</div>
            {/*
              (homeData.previousQuestions || []).map((question, idx) => (
                <Link to={`/question/${question.id}`} key={`prev-question-${idx}`}>
                  <div className="question-container">
                    <div><b>{question.questionText}</b></div>
                    <div>{question.answer}</div>
                  </div>
                </Link>
              ))
            */}
          </div>
          <div className="right-column">
            <div>
              <label>Question</label>
              <input value={this.state.questionText} onChange={e => this.setState({ questionText: e.target.value})} />
            </div>
            <div>
              <label>Answer</label>
              <input value={this.state.answer} onChange={e => this.setState({ answer: e.target.value})} />
            </div>
            <div>
              <label>Start time</label>
              <input type="date" />
              <input type="time" />
            </div>
            <div>
              <Button onClick={() => this.save()}>save</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { user, question } = state;

  return {
    question,
    user,
  };
};

const mapDispatchToProps = {
  fetchQuestion,
  fetchUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditQuestion);

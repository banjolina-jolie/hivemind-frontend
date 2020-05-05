import React, { Component } from 'react';
import { Link } from "react-router-dom";
import '../styles/edit-question.css';
import '../home.css';
import DateTimePicker from 'react-datetime-picker';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import LoggedInOverlay from './logged-in-overlay';
import LoginOverlay from './login-overlay';

import { fetchQuestion, fetchUser, saveQuestion } from '../reducer';

class EditQuestion extends Component {

  state = {
    questionText: '',
    answer: '',
    startTime: null,
  };

  save = () => {
    const { question, saveQuestion, user } = this.props;

    const { questionText, answer, startTime, endTime } = this.state;

    saveQuestion({
      ...question,
      questionText,
      answer,
      startTime,
      endTime,
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
        answer: question.answer || '',
        startTime: new Date(question.startTime),
        endTime: new Date(question.endTime),
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

            <Form>
              <Form.Group controlId="question">
                <Form.Label>Question</Form.Label>
                <Form.Control
                  placeholder="Question"
                  value={this.state.questionText}
                  onChange={e => this.setState({ questionText: e.target.value})}
                />
                {/*<Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>*/}
              </Form.Group>
              <Form.Group controlId="answer">
                <Form.Label>Answer</Form.Label>
                <Form.Control
                  placeholder="Answer"
                  value={this.state.answer}
                  onChange={e => this.setState({ answer: e.target.value})}
                />
              </Form.Group>
              <Form.Group controlId="startTime">
                <Form.Label>Start time</Form.Label>
                <div>
                  <DateTimePicker
                    className="form-control"
                    onChange={startTime => this.setState({ startTime })}
                    value={this.state.startTime}
                    disableClock={true}
                    // minDate={new Date()}
                    calendarIcon={null}
                  />
                </div>
              </Form.Group>
              <Form.Group controlId="endTime">
                <Form.Label>End time</Form.Label>
                <div>
                  <DateTimePicker
                    className="form-control"
                    value={this.state.endTime}
                    disableClock={true}
                    // minDate={new Date()}
                    calendarIcon={null}
                    disabled={true}
                  />
                </div>
              </Form.Group>


              <Button variant="primary" onClick={() => this.save()}>
                Save
              </Button>
            </Form>
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
  saveQuestion,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditQuestion);

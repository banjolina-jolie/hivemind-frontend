import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import DateTimePicker from 'react-datetime-picker';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';

import '../styles/edit-question.css';
import '../styles/home.css';

import Header from './header';

import { fetchEditQuestion, fetchUser, saveQuestion } from '../reducer';

class EditQuestion extends Component {

  state = {
    questionText: '',
    startTime: null,
    votingInterval: 0,
    loading: false,
  };

  save = () => {
    const { editQuestion, saveQuestion, history } = this.props;
    const {
      questionText,
      startTime,
      endTime,
      votingInterval,
    } = this.state;

    this.setState({ loading: true });

    saveQuestion({
      ...editQuestion,
      questionText,
      startTime,
      endTime,
      votingInterval,
    })
    .then(({ data }) => {
      history.push(`/question/${data.id}`);
    })
    .finally(() => {
      this.setState({ loading: false });
    });

  };

  startInTen = () => {
    const { editQuestion, saveQuestion, history } = this.props;
    const TEN_SECONDS = 1000 * 10;
    const startTime = new Date(Date.now() + TEN_SECONDS);
    saveQuestion({
      ...editQuestion,
      startTime,
    })
    .then(() => {
      history.push('/');
    });
  };

  updateQuestionState = () => {
    const { editQuestion } = this.props;
    this.setState({
      questionText: editQuestion.questionText || '',
      startTime: editQuestion.startTime && new Date(editQuestion.startTime),
      endTime: editQuestion.endTime && new Date(editQuestion.endTime),
      votingInterval: editQuestion.votingInterval,
    });
  };

  componentDidMount() {
    const {
      fetchEditQuestion,
      match: { params: { questionId } },
    } = this.props;

    fetchEditQuestion(questionId).then(() => {
      this.updateQuestionState();
    });
  }

  render() {
    const { editQuestion, user }= this.props;

    return (
      <div>
        <Header />

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
            {editQuestion && (
              <Form>
                <Form.Group controlId="question">
                  <Form.Label>Question</Form.Label>
                  <Form.Control
                    placeholder="Question"
                    value={this.state.questionText}
                    onChange={e => this.setState({ questionText: e.target.value})}
                  />
                </Form.Group>
                {
                  this.state.answer && (
                    <Form.Group controlId="answer">
                      <Form.Label>Answer</Form.Label>
                      <div><b>{this.state.answer}</b></div>
                    </Form.Group>
                  )
                }
                <Form.Group controlId="startTime">
                  <Form.Label>Start time</Form.Label>
                  <div>
                    <DateTimePicker
                      className="form-control"
                      onChange={startTime => this.setState({ startTime })}
                      value={this.state.startTime}
                      disableClock={true}
                      calendarIcon={null}
                    />
                  </div>
                </Form.Group>
                {
                  editQuestion.id && this.state.endTime && (
                    <Form.Group controlId="endTime">
                      <Form.Label>End time</Form.Label>
                      <div>
                        {window.moment(this.state.endTime).format('M/D/YYYY h:mm a')}
                      </div>
                    </Form.Group>
                  )
                }
                <Form.Group controlId="question">
                  <Form.Label>Voting interval (seconds)</Form.Label>
                  <Form.Control
                    className="voting-interval"
                    placeholder="Question"
                    type="number"
                    value={this.state.votingInterval}
                    onChange={e => this.setState({ votingInterval: Number(e.target.value) })}
                  />
                </Form.Group>
                <Button variant="primary" onClick={() => this.save()} disabled={this.state.loading}>
                  {this.state.loading ? <Spinner size="sm" animation="border" /> : 'Save'}
                </Button>

                <br/>
                <br/>

                {editQuestion.id && (
                  <div><Button variant="primary" onClick={() => this.startInTen()} disabled={this.state.loading}>
                    {this.state.loading ? <Spinner size="sm" animation="border" /> : 'Start in 10 seconds'}
                  </Button></div>
                )}
              </Form>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { user, editQuestion } = state;

  return {
    editQuestion,
    user,
  };
};

const mapDispatchToProps = {
  fetchEditQuestion,
  fetchUser,
  saveQuestion,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EditQuestion));

import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { withRouter } from "react-router";

import Header from './header';

import '../styles/question-list.css';

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
      <div>
        <Header />
        <div className="question-list-body">
          {questions.map((q, idx) => (
            <div className="question-li-container" key={`question-list-item-${idx}`}>
              <div><b><Link to={`/question/${q.id}`}>{q.questionText}</Link></b></div>
              <div><i>{q.answer}</i></div>
              <div>{q.startTime && window.moment(q.startTime).format('MM/DD/YYYY h:mma')}</div>
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

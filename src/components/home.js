import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import '../styles/home.css';

import Header from './header';
import ActiveQuestion from './active-question';
import AdminOnlyLink from './admin-only-link';

import { fetchUser, fetchHomeData } from '../reducer';


class Home extends Component {

  componentWillUnmount() {
    clearInterval(this.refreshTimer);
  }

  componentDidMount() {
    if (!this.props.user && localStorage.getItem('authToken')) {
      this.props.fetchUser();
    }

    if (!this.props.homeData) {
      this.props.fetchHomeData();
    }

    clearInterval(this.refreshTimer);

    this.refreshTimer = setInterval(() => {
      this.forceUpdate();
    }, 1000);
  }

  render() {
    const { user, previousQuestions, activeQuestion, activeHiveCount } = this.props;
    if (!previousQuestions) { return (<div>loading</div>) }

    return (
      <div>
        <Header activeQuestion={activeQuestion}/>

        <div className="home-body">
          <div className="left-column">
            <div className="label">Past Questions</div>
            {
              (previousQuestions || []).map((question, idx) => (
                <AdminOnlyLink to={`/question/${question.id}`} key={`prev-question-${idx}`}>
                  <div className="question-container">
                    <div><b>{question.questionText}</b></div>
                    <div>{question.answer}</div>
                  </div>
                </AdminOnlyLink>
              ))
            }
          </div>
          <div className="right-column">
            { !!activeQuestion && <ActiveQuestion/> }
          </div>
        </div>
      </div>
    );
  }

}

const mapStateToProps = state => {
  const { activeHiveCount, user, activeQuestion, previousQuestions } = state;

  return {
    activeHiveCount,
    activeQuestion,
    previousQuestions,
    user,
  };
};

const mapDispatchToProps = {
  fetchHomeData,
  fetchUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

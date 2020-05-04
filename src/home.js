import React, { Component } from 'react';
import './home.css';
import { connect } from 'react-redux';
import {
  // BrowserRouter as Router,
  // Switch,
  // Route,
  Link
} from "react-router-dom";

import LoggedInOverlay from './components/logged-in-overlay';
import LoginOverlay from './components/login-overlay';

import ActiveQuestion from './active-question';

import { fetchUser, logout, fetchHomeData } from './reducer';

class Home extends Component {

  componentDidMount() {
    if (!this.props.user && localStorage.getItem('authToken')) {
      this.props.fetchUser();
    }

    if (!this.props.homeData) {
      this.props.fetchHomeData();
    }
  }

  render() {
    const { user, logout, homeData, question, activeHiveCount } = this.props;
    if (!homeData) { return (<div>loading</div>) }

    return (
      <div className="home-container">
        <div className="home-header">
          <b>Hivemind</b>
          <div>The hive is live with  {activeHiveCount.toLocaleString()} minds</div>
          {user ? <LoggedInOverlay /> : <LoginOverlay /> }
        </div>
        <div className="home-body">
          <div className="left-column">
            <div className="label">Past Questions</div>
            {
              (homeData.previousQuestions || []).map((question, idx) => (
                <Link to={`/question/${question.id}`} key={`prev-question-${idx}`}>
                  <div className="question-container">
                    <div><b>{question.questionText}</b></div>
                    <div>{question.answer}</div>
                  </div>
                </Link>
              ))
            }
          </div>
          <div className="right-column">
            {/*<div className="label">Question</div>
            <h1 className="big-text">{homeData.activeQuestion.questionText}</h1>
            <div className="label">Answer</div>
            <h1 className="big-text">{homeData.activeQuestion.answer}</h1>*/}

            { !!question && <ActiveQuestion/> }
          </div>
        </div>
      </div>
    );
  }

}

const mapStateToProps = state => {
  const { activeHiveCount, user, question, homeData } = state;

  return {
    activeHiveCount,
    homeData,
    question,
    user,
  };
};

const mapDispatchToProps = {
  fetchHomeData,
  fetchUser,
  logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

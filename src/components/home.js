import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import '../styles/home.css';

import Header from './header';
import ActiveQuestion from './active-question';

import { fetchUser, fetchHomeData } from '../reducer';


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
    const { user, previousQuestions, activeQuestion, activeHiveCount } = this.props;
    if (!previousQuestions) { return (<div>loading</div>) }

    return (
      <div>
        <Header centerContent={`The hive is live with  ${activeHiveCount.toLocaleString()} minds`}/>

        <div className="home-body">
          <div className="left-column">
            <div className="label">Past Questions</div>
            {
              (previousQuestions || []).map((question, idx) => (
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
    previousQuestions,
    activeQuestion,
    user,
  };
};

const mapDispatchToProps = {
  fetchHomeData,
  fetchUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

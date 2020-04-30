import React from 'react';
import './home.css';
import { connect } from 'react-redux';
import {
  // BrowserRouter as Router,
  // Switch,
  // Route,
  Link
} from "react-router-dom";

function Home({ user }) {
  return (
    <div className="home-container">
      <div className="home-header">
        <b>Hivemind</b>
        <div>The hive is live with  10,000 minds</div>
        <Link to="/foo">Foo</Link>
      </div>
      <div className="home-body">
        <div className="left-column">
          <div>Today's Questions</div>
          _________________________

          <div className="question-container">
            <div><b>Is there other life on the universe?</b></div>
            <div>There probably is</div>
          </div>
          <div className="question-container">
            <div><b>If we ever meet aliens, what will be the first thing they say to us?</b></div>
            <div>Stop destroying your planet and yourselves.</div>
          </div>

        </div>
        <div className="right-column">
          <div>Question</div>
          _________________________

          <h1>What is the meaning of life?</h1>

          <div>Answer</div>
          _________________________

          <h1>To love</h1>


        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => {
  const { user } = state;

  return {
    user,
  };
};

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

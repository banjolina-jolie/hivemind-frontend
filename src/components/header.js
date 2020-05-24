import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";

import '../styles/header.css';

import LoggedInOverlay from './logged-in-overlay';
import LoginOverlay from './login-overlay';
import SignupOverlay from './signup-overlay';

import { fetchUser } from '../reducer';

class Header extends Component {

  componentDidMount() {
    const { fetchUser, user } = this.props;
    if (!user && localStorage.getItem('authToken')) {
      fetchUser();
    }
  }

  renderCenterContent() {
    const { activeQuestion, activeHiveCount } = this.props;
    let centerContent = '';

    if (activeQuestion && !activeQuestion.endTime) {
      const hiveIsLive = new Date(activeQuestion.startTime) <= Date.now();

      if (hiveIsLive) {
        centerContent = (
          <span>
            The hive is <b className="green">live</b> with {activeHiveCount.toLocaleString()} minds
          </span>
        );
      } else {
        centerContent = `The hive is buzzing with ${activeHiveCount.toLocaleString()} minds`;
      }
    } else {
      centerContent = 'The hive is sleeping';
    }

    return ( <div className="center-content">{centerContent}</div> );
  }

  render() {
    const { activeQuestion, user } = this.props;

    return (
      <div className="app-header">
        <Link to="/">
          <b>Hivemind</b>
        </Link>

        <div>
          {this.renderCenterContent()}
        </div>

        {user ? <LoggedInOverlay /> : (
          <div>
            <LoginOverlay />
            <SignupOverlay />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { activeHiveCount, activeQuestion, user } = state;

  return {
    activeHiveCount,
    activeQuestion,
    user,
  };
};

const mapDispatchToProps = {
  fetchUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);


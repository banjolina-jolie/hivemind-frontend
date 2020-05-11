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

  render() {
    const { centerContent, user } = this.props;

    return (
      <div className="app-header">
        <Link to="/">
          <b>Hivemind</b>
        </Link>

        <div>{centerContent}</div>

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
  const { user } = state;

  return {
    user,
  };
};

const mapDispatchToProps = {
  fetchUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);

